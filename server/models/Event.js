import mongoose from 'mongoose';

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
