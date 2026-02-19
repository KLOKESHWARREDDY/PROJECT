import mongoose from 'mongoose';

/**
 * Ticket Model
 * =============================================================================
 * Purpose: Generates and tracks event tickets for confirmed registrations
 * 
 * When a student's registration is approved, a ticket is generated.
 * Tickets contain a unique code for verification at event entry.
 * 
 * Schema Fields:
 * - registration: Reference to the registration this ticket is for
 * - student: Reference to the ticket holder
 * - event: Reference to the event
 * - ticketCode: Unique identifier (used for QR code generation)
 * - status: Ticket validity - 'valid', 'used', 'cancelled'
 * - createdAt: Ticket generation timestamp
 * 
 * Ticket Lifecycle:
 * 1. Registration approved -> ticket created with status: 'valid'
 * 2. Student attends event -> ticket marked as status: 'used'
 * 3. Ticket cancelled -> status: 'cancelled'
 * =============================================================================
 */

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
