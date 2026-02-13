const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    ticketId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but ensures uniqueness when present
    },
  },
  { timestamps: true }
);

// Generate unique ticket ID before saving
registrationSchema.pre('save', function (next) {
  if (this.status === 'approved' && !this.ticketId) {
    this.ticketId = 'TKT-' + Date.now().toString(36).toUpperCase() + 
                   Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
