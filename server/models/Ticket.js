const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
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
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true,
  },
  ticketCode: {
    type: String,
    required: true,
    unique: true,
  },
  qrCode: {
    type: String,  // Base64 QR code image
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'used', 'cancelled'],
    default: 'active',
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Auto-generate ticket code
ticketSchema.pre('save', function (next) {
  if (!this.ticketCode) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.ticketCode = `TKT-${date}-${random}`;
  }
  next();
});

// Index for fast lookup
ticketSchema.index({ student: 1, event: 1 });
// Note: ticketCode already has unique: true in schema, so no extra index needed

module.exports = mongoose.model('Ticket', ticketSchema);
