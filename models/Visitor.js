import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    page: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of recent visits
visitorSchema.index({ timestamp: -1 });
visitorSchema.index({ sessionId: 1, timestamp: -1 });

export default mongoose.model('Visitor', visitorSchema);
