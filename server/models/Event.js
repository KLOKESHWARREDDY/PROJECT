import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
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
  status: {
    type: String,
    enum: ['draft', 'active', 'cancelled', 'completed'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Event', eventSchema);
