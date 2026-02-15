import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true,
  },
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
  ticketCode: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['valid', 'used', 'cancelled'],
    default: 'valid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Ticket', ticketSchema);
