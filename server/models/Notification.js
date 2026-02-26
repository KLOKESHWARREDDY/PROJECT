import mongoose from 'mongoose';

/**
 * Notification Model
 * =============================================================================
 * Purpose: Stores user notifications for various events in the system
 * 
 * This model tracks notifications sent to users about important events
 * such as registration updates, event approvals, and system announcements.
 * 
 * Schema Fields:
 * - user: Reference to the user who receives the notification
 * - title: Notification title/heading
 * - message: Notification content/details
 * - type: Notification category - 'registration', 'approval', 'publish', 'delete', 'general'
 * - relatedId: Optional reference to related entity (e.g., event ID)
 * - isRead: Read status flag (true = read, false = unread)
 * - timestamps: Auto-created createdAt and updatedAt fields
 * 
 * Indexes:
 * - user + createdAt: Quick lookup sorted by date
 * - user + isRead: Filter unread notifications
 * =============================================================================
 */

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['registration', 'approval', 'publish', 'delete', 'general', 'new_event', 'popular_event', 'event_update', 'registration_sent'],
    default: 'general'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
