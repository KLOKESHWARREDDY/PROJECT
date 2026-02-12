const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    ticketId: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
