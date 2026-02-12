const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    college: String,
    regNo: String,
    department: String,

    // ⭐ ADD THIS (VERY IMPORTANT)
    profileImage: {
      type: String,
      default: ""
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
