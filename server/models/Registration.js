import mongoose from 'mongoose';

/**
 * Registration Model
 * =============================================================================
 * Purpose: Tracks student registrations for events
 * 
 * This model represents the relationship between students and events.
 * When a student registers for an event, a registration record is created.
 * Teachers can approve or reject registrations.
 * 
 * Schema Fields:
 * - student: Reference to the registering student (User)
 * - event: Reference to the event being registered for
 * - teacher: Reference to the event owner/teacher
 * - status: Registration state - 'pending', 'approved', 'rejected', 'cancelled'
 * - createdAt: Registration timestamp
 * 
 * Use Cases:
 * - Student registers for event -> status: 'pending'
 * - Teacher approves registration -> status: 'approved'
 * - Teacher rejects registration -> status: 'rejected'
 * - Student cancels registration -> status: 'cancelled'
 * =============================================================================
 */

const registrationSchema = new mongoose.Schema({
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  ticketId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Registration', registrationSchema);
