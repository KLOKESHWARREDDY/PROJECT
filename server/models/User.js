import mongoose from 'mongoose';

/**
 * User Model
 * =============================================================================
 * Purpose: Defines the schema for user data in the EventSphere application
 * 
 * This model represents both students and teachers who can register for events.
 * Users can sign up, login, and manage their profiles.
 * 
 * Schema Fields:
 * - name: User's full name (required)
 * - email: User's email address (required, unique)
 * - password: Hashed password (required)
 * - role: User type - 'student' or 'teacher' (default: 'student')
 * - college: User's college name (optional)
 * - regNo: Registration number (optional)
 * - department: User's department (optional)
 * - profileImage: URL to profile picture (optional)
 * - createdAt: Account creation timestamp
 * =============================================================================
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student',
  },
  // Academic Information Fields
  college: {
    type: String,
    default: '',
  },
  regNo: {
    type: String,
    default: '',
  },
  department: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema);
