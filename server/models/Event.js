import mongoose from 'mongoose';

/**
 * Event Model
 * =============================================================================
 * Purpose: Defines the schema for event data in EventSphere
 * 
 * This model represents events that teachers can create and students can register for.
 * Events have a draft/publish system for content management.
 * 
 * Schema Fields:
 * - title: Event name
 * - description: Event details
 * - date: Event date/time
 * - location: Event venue
 * - teacher: Reference to creating teacher (User)
 * - category: Event category (default: 'Tech')
 * - image: URL to event banner image
 * - status: Event lifecycle - 'draft', 'published', or 'completed'
 * - createdBy: User who created the event
 * - updatedAt: Last modification timestamp
 * - publishedAt: When event was published
 * - publishAt: Scheduled publish date (for future publishing)
 * - isDeleted: Soft delete flag
 * - createdAt: Creation timestamp
 * 
 * Indexes:
 * - status + isDeleted: Efficient filtering of active events
 * - teacher + status: Quick lookup of teacher's events
 * =============================================================================
 */

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false, // Not required - drafts can have empty title
  },
  description: {
    type: String,
    required: false, // Not required - drafts can have empty description
  },
  date: {
    type: String,
    required: false, // Not required - drafts can have empty date
  },
  location: {
    type: String,
    required: false, // Not required - drafts can have empty location
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    default: 'Tech',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  // Universal Draft + Publish System
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft'
  },
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  // Scheduled publish
  publishAt: {
    type: Date,
    default: null,
  },
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
eventSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Index for efficient queries
eventSchema.index({ status: 1, isDeleted: 1 });
eventSchema.index({ teacher: 1, status: 1 });

export default mongoose.model('Event', eventSchema);
