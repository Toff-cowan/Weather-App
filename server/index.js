import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { connectDatabase, saveReport, getAllReports, getReportsBySeverity, updateReportStatus } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
const genAI = process.env.GOOGLE_GEMINI_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY)
  : null;

// Initialize SendGrid if API key is provided
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Twilio if credentials are provided
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Meteosource API Key
const METEOSOURCE_API_KEY = process.env.METEOSOURCE_API_KEY;

// Connect to database
await connectDatabase();

app.use(cors());
app.use(express.json());

app.get('/api/storm-analytics', async (req, res) => {
  try {
    if (!METEOSOURCE_API_KEY) {
      console.log('⚠️  No Meteosource API key provided');
      return res.json(null);
    }

    // Get severe weather alerts for hurricane-prone regions
    const hurricaneRegions = [
      { name: 'Caribbean', lat: 18.2208, lon: -66.5901 }, // Puerto Rico
      { name: 'Gulf Coast', lat: 29.7604, lon: -95.3698 }, // Houston
      { name: 'Florida', lat: 25.7617, lon: -80.1918 }, // Miami
      { name: 'Atlantic Coast', lat: 32.0809, lon: -81.0912 } // Savannah
    ];

    let stormData = null;

    for (const region of hurricaneRegions) {
      const url = `https://www.meteosource.com/api/v1/free/point?lat=${region.lat}&lon=${region.lon}&sections=alerts,current&key=${METEOSOURCE_API_KEY}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.alerts && data.alerts.length > 0) {
          const hurricaneAlert = data.alerts.find(alert => 
            alert.event && (
              alert.event.toLowerCase().includes('hurricane') || 
              alert.event.toLowerCase().includes('tropical storm') ||
              alert.event.toLowerCase().includes('cyclone')
            )
          );

          if (hurricaneAlert && data.current) {
            stormData = {
              stormName: hurricaneAlert.event || 'Tropical System',
              region: region.name,
              windSpeedHistory: {
                labels: ['Current', '6h ago', '12h ago', '18h ago', '24h ago'],
                data: [
                  data.current.wind?.speed || 0,
                  Math.max(0, (data.current.wind?.speed || 0) - 5),
                  Math.max(0, (data.current.wind?.speed || 0) - 10),
                  Math.max(0, (data.current.wind?.speed || 0) - 15),
                  Math.max(0, (data.current.wind?.speed || 0) - 20)
                ]
              },
              pressureHistory: {
                labels: ['Current', '6h ago', '12h ago', '18h ago', '24h ago'],
                data: [
                  data.current.pressure || 1013,
                  (data.current.pressure || 1013) + 3,
                  (data.current.pressure || 1013) + 6,
                  (data.current.pressure || 1013) + 9,
                  (data.current.pressure || 1013) + 12
                ]
              },
              sizeGrowth: {
                labels: ['Current', '6h ago', '12h ago', '18h ago', '24h ago'],
                data: [100, 90, 80, 70, 60]
              },
              currentStats: {
                maxWindSpeed: `${Math.round(data.current.wind?.speed * 2.237 || 0)} mph`, // m/s to mph
                minPressure: `${Math.round(data.current.pressure || 1013)} mb`,
                movement: `${data.current.wind?.dir || 'N/A'}`,
                category: hurricaneAlert.severity || 'Unknown',
                description: hurricaneAlert.description || 'No description available',
                headline: hurricaneAlert.headline || '',
                expires: hurricaneAlert.expires || ''
              }
            };
            break;
          }
        }
      } catch (fetchError) {
        console.log(`Could not fetch data for ${region.name}:`, fetchError.message);
      }
    }

    res.json(stormData);
  } catch (error) {
    console.error('Error fetching storm data from Meteosource:', error.message);
    res.json(null);
  }
});

app.get('/api/active-storms', async (req, res) => {
  try {
    if (!METEOSOURCE_API_KEY) {
      console.log('⚠️  No Meteosource API key provided');
      return res.json([]);
    }

    // Check multiple hurricane-prone locations
    const locations = [
      { name: 'Caribbean Sea', lat: 18.2208, lon: -66.5901 },
      { name: 'Gulf of Mexico', lat: 25.0, lon: -90.0 },
      { name: 'Florida Coast', lat: 25.7617, lon: -80.1918 },
      { name: 'Atlantic Ocean (East Coast)', lat: 32.0809, lon: -81.0912 },
      { name: 'Bahamas', lat: 25.0343, lon: -77.3963 }
    ];

    const activeStorms = [];
    let stormId = 1;

    for (const location of locations) {
      const url = `https://www.meteosource.com/api/v1/free/point?lat=${location.lat}&lon=${location.lon}&sections=alerts,current&key=${METEOSOURCE_API_KEY}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.alerts && data.alerts.length > 0) {
          for (const alert of data.alerts) {
            const isStorm = alert.event && (
              alert.event.toLowerCase().includes('hurricane') ||
              alert.event.toLowerCase().includes('tropical storm') ||
              alert.event.toLowerCase().includes('cyclone')
            );

            if (isStorm) {
              const windSpeedMph = Math.round((data.current?.wind?.speed || 0) * 2.237);
              let category = 'Tropical Storm';
              
              if (windSpeedMph >= 157) category = 'Category 5';
              else if (windSpeedMph >= 130) category = 'Category 4';
              else if (windSpeedMph >= 111) category = 'Category 3';
              else if (windSpeedMph >= 96) category = 'Category 2';
              else if (windSpeedMph >= 74) category = 'Category 1';

              activeStorms.push({
                id: stormId++,
                name: alert.event || 'Unnamed Storm',
                category: category,
                windSpeed: `${windSpeedMph} mph`,
                pressure: `${Math.round(data.current?.pressure || 1013)} mb`,
                location: { lat: location.lat, lon: location.lon },
                movement: data.current?.wind?.dir || 'N/A',
                status: alert.severity || 'Active',
                region: location.name,
                description: alert.description || '',
                expires: alert.expires || ''
              });
            }
          }
        }
      } catch (fetchError) {
        console.log(`Could not fetch alerts for ${location.name}:`, fetchError.message);
      }
    }

    res.json(activeStorms);
  } catch (error) {
    console.error('Error fetching active storms from Meteosource:', error.message);
    res.json([]);
  }
});

// Endpoint to submit emergency reports
app.post('/api/emergency-report', async (req, res) => {
  try {
    const reportData = req.body;
    
    console.log('🚨 Emergency report received:', {
      type: reportData.emergencyType,
      severity: reportData.severity,
      location: reportData.location,
      contact: reportData.contactName
    });

    let savedReport = null;
    let emailSent = false;
    let smsSent = false;

    // 1. Save to database if connected
    try {
      savedReport = await saveReport({
        ...reportData,
        emailSent: false,
        smsSent: false
      });
    } catch (dbError) {
      console.log('⚠️  Report not saved to database, but continuing with notifications');
    }

    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM && process.env.EMERGENCY_EMAIL_TO) {
      try {
        const emailMsg = {
          to: process.env.EMERGENCY_EMAIL_TO,
          from: process.env.EMAIL_FROM,
          subject: `🚨 Emergency Report: ${reportData.emergencyType} - ${reportData.severity}`,
          html: `
            <h2>Emergency Report Received</h2>
            <p><strong>Type:</strong> ${reportData.emergencyType}</p>
            <p><strong>Severity:</strong> ${reportData.severity}</p>
            <p><strong>Location:</strong> ${reportData.location}</p>
            <p><strong>Coordinates:</strong> ${reportData.latitude}, ${reportData.longitude}</p>
            <p><strong>Description:</strong> ${reportData.description}</p>
            <p><strong>People Affected:</strong> ${reportData.peopleAffected || 'Unknown'}</p>
            <hr>
            <h3>Reporter Contact Information</h3>
            <p><strong>Name:</strong> ${reportData.contactName}</p>
            <p><strong>Phone:</strong> ${reportData.contactPhone}</p>
            <p><strong>Email:</strong> ${reportData.contactEmail || 'Not provided'}</p>
            <hr>
            <p><em>Report received at: ${new Date().toLocaleString()}</em></p>
          `
        };
        
        await sgMail.send(emailMsg);
        console.log('✅ Email sent to authorities');
        emailSent = true;
      } catch (emailError) {
        console.error('Email error:', emailError.message);
      }
    }

    if (reportData.severity === 'critical' && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const smsMessage = `🚨 CRITICAL EMERGENCY: ${reportData.emergencyType} at ${reportData.location}. Contact: ${reportData.contactPhone}`;
        
        if (process.env.EMERGENCY_PHONE_NUMBER) {
          await twilioClient.messages.create({
            body: smsMessage,
            to: process.env.EMERGENCY_PHONE_NUMBER,
            from: process.env.TWILIO_PHONE_NUMBER
          });
          console.log('✅ SMS alert sent');
          smsSent = true;
        }
      } catch (smsError) {
        console.error('SMS error:', smsError.message);
      }
    }

    if (savedReport) {
      try {
        savedReport.emailSent = emailSent;
        savedReport.smsSent = smsSent;
        await savedReport.save();
      } catch (updateError) {
        console.log('⚠️  Could not update notification status');
      }
    }

    if (reportData.contactEmail && process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
      try {
        const confirmMsg = {
          to: reportData.contactEmail,
          from: process.env.EMAIL_FROM,
          subject: 'Emergency Report Confirmation',
          html: `
            <h2>Your Emergency Report Has Been Received</h2>
            <p>Dear ${reportData.contactName},</p>
            <p>Thank you for submitting an emergency report. Your report has been received and forwarded to the appropriate authorities.</p>
            <p><strong>Report Details:</strong></p>
            <ul>
              <li>Type: ${reportData.emergencyType}</li>
              <li>Severity: ${reportData.severity}</li>
              <li>Location: ${reportData.location}</li>
              <li>Time: ${new Date().toLocaleString()}</li>
            </ul>
            <p>Emergency services will contact you if additional information is needed.</p>
            <p>Stay safe!</p>
          `
        };
        
        await sgMail.send(confirmMsg);
      } catch (confirmError) {
        console.error('Confirmation email error:', confirmError.message);
      }
    }

    res.json({
      success: true,
      message: 'Emergency report submitted successfully',
      reportId: savedReport ? savedReport._id : Date.now(),
      saved: !!savedReport,
      emailSent,
      smsSent
    });

  } catch (error) {
    console.error('Error processing emergency report:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit emergency report' 
    });
  }
});

// Endpoint for AI chatbot (Google Gemini)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const activeStorms = await fetch('http://localhost:5000/api/active-storms').then(r => r.json()).catch(() => []);
    const stormAnalytics = await fetch('http://localhost:5000/api/storm-analytics').then(r => r.json()).catch(() => null);
    
    if (genAI) {
      try {
        let stormContext = '';
        if (activeStorms.length > 0) {
          stormContext = `\n\nCURRENT ACTIVE STORMS:\n${activeStorms.map(s => 
            `- ${s.name}: Category ${s.category}, winds ${s.windSpeed}, pressure ${s.pressure}, moving ${s.movement}`
          ).join('\n')}`;
        }
        if (stormAnalytics) {
          stormContext += `\n\nLATEST STORM DATA:\n${stormAnalytics.stormName}: Current winds ${stormAnalytics.currentStats.maxWindSpeed}, pressure ${stormAnalytics.currentStats.minPressure}, category ${stormAnalytics.currentStats.category}`;
        }
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `You are a disaster safety assistant helping people during hurricanes and severe weather.
Provide clear, concise, and actionable safety advice.
${stormContext}

User question: ${message}

If the user asks about current hurricanes or storms, tell them about the active storms listed above with specific details. Otherwise, provide helpful safety tips and emergency guidance:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();
        
        return res.json({ reply });
      } catch (aiError) {
        console.log('AI failed, using fallback:', aiError.message);
      }
    }
    
    const lowerMessage = message.toLowerCase();
    let reply = '';
    
    if (lowerMessage.includes('hurricane') || lowerMessage.includes('storm') || lowerMessage.includes('current') || lowerMessage.includes('active')) {
      if (activeStorms.length > 0 || stormAnalytics) {
        reply = '**Current Hurricane Information:**\n\n';
        if (activeStorms.length > 0) {
          reply += 'Active Storms:\n';
          activeStorms.forEach(storm => {
            reply += `• ${storm.name} - Category ${storm.category}\n`;
            reply += `  Winds: ${storm.windSpeed} | Pressure: ${storm.pressure}\n`;
            reply += `  Movement: ${storm.movement} | Status: ${storm.status}\n\n`;
          });
        }
        if (stormAnalytics) {
          reply += `\nLatest Data for ${stormAnalytics.stormName}:\n`;
          reply += `• Category: ${stormAnalytics.currentStats.category}\n`;
          reply += `• Max Winds: ${stormAnalytics.currentStats.maxWindSpeed}\n`;
          reply += `• Min Pressure: ${stormAnalytics.currentStats.minPressure}\n`;
          reply += `• Movement: ${stormAnalytics.currentStats.movement}\n\n`;
        }
        reply += '\n**Safety Reminder:** If you\'re in the affected area, follow local evacuation orders and stay informed through official channels.';
      } else {
        reply = 'Currently, there are no active hurricane systems being tracked. However, it\'s always good to stay prepared during hurricane season. Would you like tips on hurricane preparedness?';
      }
    } else if (lowerMessage.includes('evacuat')) {
      reply = '**Evacuation Guidelines:**\n\n1. Follow official evacuation orders immediately\n2. Take your emergency kit\n3. Bring important documents\n4. Tell someone where you\'re going\n5. Use recommended evacuation routes\n6. Don\'t drive through flooded areas\n7. Turn off utilities if instructed\n8. Lock your home';
    } else if (lowerMessage.includes('supply') || lowerMessage.includes('kit')) {
      reply = '**Emergency Supply Kit Essentials:**\n\n1. Water (1 gallon per person per day)\n2. Non-perishable food (3-day supply)\n3. First aid kit\n4. Flashlight and extra batteries\n5. Battery-powered radio\n6. Medications (7-day supply)\n7. Important documents in waterproof container\n8. Cash\n9. Phone chargers\n10. Basic tools';
    } else {
      reply = 'I can help with:\n\n• Current hurricane information\n• Hurricane & storm preparedness\n• Evacuation procedures\n• Emergency supply kits\n• Flood safety\n• Power outage tips\n\nWhat would you like to know more about?';
    }
    
    res.json({ reply });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

// Get all emergency reports (for admin dashboard)
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await getAllReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get reports by severity
app.get('/api/reports/severity/:severity', async (req, res) => {
  try {
    const reports = await getReportsBySeverity(req.params.severity);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports by severity:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update report status
app.patch('/api/reports/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const report = await updateReportStatus(req.params.id, status);
    res.json(report);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const services = {
    ai: !!genAI,
    email: !!process.env.SENDGRID_API_KEY,
    sms: !!twilioClient,
    database: !!process.env.DATABASE_URL
  };
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api\n`);
  console.log('📋 Service Status:');
  console.log(`   ${genAI ? '✅' : '❌'} AI Chatbot (Gemini)`);
  console.log(`   ${process.env.SENDGRID_API_KEY ? '✅' : '❌'} Email Service (SendGrid)`);
  console.log(`   ${twilioClient ? '✅' : '❌'} SMS Service (Twilio)`);
  console.log(`   ${process.env.DATABASE_URL ? '✅' : '❌'} Database (MongoDB)`);
  console.log('\n');
});
