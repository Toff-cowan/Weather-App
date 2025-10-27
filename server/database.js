import mongoose from 'mongoose';

// Connect to MongoDB
export const connectDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  No DATABASE_URL found - reports will not be saved to database');
    return null;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Database connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return null;
  }
};

// Emergency Report Schema
const emergencyReportSchema = new mongoose.Schema({
  // Report Type and Severity
  emergencyType: {
    type: String,
    required: true,
    enum: ['hurricane', 'flood', 'fire', 'powerOutage', 'structuralDamage', 'roadClosed', 'other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['critical', 'high', 'moderate', 'low']
  },

  // Location Information
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },

  // Report Details
  description: {
    type: String,
    required: true
  },
  peopleAffected: {
    type: Number
  },

  // Reporter Contact Information
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String
  },

  // Metadata
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Notifications sent
  emailSent: {
    type: Boolean,
    default: false
  },
  smsSent: {
    type: Boolean,
    default: false
  }
});

// Update the updatedAt timestamp before saving
emergencyReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create model
export const EmergencyReport = mongoose.model('EmergencyReport', emergencyReportSchema);

// Helper function to save a report
export const saveReport = async (reportData) => {
  try {
    const report = new EmergencyReport(reportData);
    await report.save();
    console.log('✅ Report saved to database:', report._id);
    return report;
  } catch (error) {
    console.error('❌ Failed to save report to database:', error.message);
    throw error;
  }
};

// Helper function to get all reports
export const getAllReports = async () => {
  try {
    return await EmergencyReport.find().sort({ reportedAt: -1 });
  } catch (error) {
    console.error('❌ Failed to fetch reports:', error.message);
    return [];
  }
};

// Helper function to get reports by severity
export const getReportsBySeverity = async (severity) => {
  try {
    return await EmergencyReport.find({ severity }).sort({ reportedAt: -1 });
  } catch (error) {
    console.error('❌ Failed to fetch reports by severity:', error.message);
    return [];
  }
};

// Helper function to update report status
export const updateReportStatus = async (reportId, status) => {
  try {
    const report = await EmergencyReport.findByIdAndUpdate(
      reportId,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    console.log('✅ Report status updated:', reportId);
    return report;
  } catch (error) {
    console.error('❌ Failed to update report status:', error.message);
    throw error;
  }
};

