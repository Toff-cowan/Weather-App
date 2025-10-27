# 🌪️ Weather Disaster Tracker

A modern web application for tracking hurricanes and natural disasters with real-time data, AI chatbot assistance, and emergency reporting.

## 🚀 Features

- **Real-Time Hurricane Tracking** - Live data from Meteosource API
- **Interactive Map** - Zoom Earth integration for visual storm tracking
- **AI Chatbot** - Get safety tips and current hurricane information
- **Emergency Reporting** - Submit reports directly to authorities
- **Analytics Dashboard** - View storm growth, wind speed trends, and pressure changes
- **Emergency Contacts** - Quick access to regional emergency services
- **Bluetooth Communication** - Low-energy emergency communication system

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- API Keys (see setup below)

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Toff-cowan/Weather-App.git
cd Weather-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Get API Keys

#### Meteosource API (Required for Hurricane Data)
1. Visit [Meteosource](https://www.meteosource.com/)
2. Sign up for a free account
3. Copy your API key from the dashboard

#### Google Gemini API (Required for AI Chatbot)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key

#### SendGrid API (Required for Email Notifications)
1. Visit [SendGrid](https://sendgrid.com/)
2. Create a free account
3. Generate an API key
4. Verify your sender email

#### MongoDB (Required for Database)
- **Local**: Install MongoDB locally or use `mongodb://localhost:27017/`
- **Cloud**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 4. Configure Environment Variables

Edit your `.env` file and add your API keys:

```env
# Required
METEOSOURCE_API_KEY=your_meteosource_key_here
GOOGLE_GEMINI_KEY=your_gemini_key_here
DATABASE_URL=mongodb://localhost:27017/

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_key_here
EMAIL_FROM=your_verified_email@example.com
EMERGENCY_EMAIL_TO=emergency_contact@example.com

# Optional (SMS alerts)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
EMERGENCY_PHONE_NUMBER=

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Start the Application

**Backend Server:**
```bash
npm run server
```

**Frontend Development Server:**
```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 🌐 API Endpoints

- `GET /api/active-storms` - Get current active hurricanes
- `GET /api/storm-analytics` - Get detailed storm analytics and history
- `POST /api/emergency-report` - Submit an emergency report
- `POST /api/chat` - Chat with the AI assistant
- `GET /api/reports` - Get all emergency reports (admin)

## 📱 Features Breakdown

### Hurricane Tracking
- Monitors 5 key hurricane-prone regions
- Real-time wind speeds, pressure, and movement data
- Automatic storm categorization (Cat 1-5)

### AI Chatbot
- Provides current hurricane information
- Offers safety tips and evacuation guidance
- Emergency supply kit recommendations
- Available on every page

### Emergency Reporting
- GPS location capture
- Severity classification
- Automatic email notifications to authorities
- SMS alerts for critical emergencies (if Twilio configured)

### Analytics Dashboard
- Wind speed trends over time
- Barometric pressure charts
- Storm growth visualization
- Historical data comparison

## 🔒 Security

- API keys stored in `.env` file (gitignored)
- Email verification required for SendGrid
- Database access controlled via MongoDB authentication

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Vite
- Tailwind CSS
- Chart.js
- React Router

**Backend:**
- Node.js
- Express
- MongoDB & Mongoose
- Google Gemini AI
- SendGrid
- Meteosource API

## 📝 License

MIT License

## 👨‍💻 Developer

Created by Christoff Cowan

## 🆘 Support

For issues or questions, please open an issue on GitHub.
