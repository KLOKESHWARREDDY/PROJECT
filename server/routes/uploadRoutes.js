import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: profile-[userId]-[timestamp].[ext]
    const ext = path.extname(file.originalname);
    const filename = `profile-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: fileFilter,
});

// @route   POST /api/auth/upload-profile-image
// @desc    Upload profile image
// @access  Private (requires JWT token)
router.post('/upload-profile-image', protect, (req, res, next) => {
  upload.single('profileImage')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const userId = req.user._id;

    // Find user and update profileImage
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile image if exists and is not default
    if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new image path to database
    // Store relative path: /uploads/profiles/filename.ext
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    user.profileImage = imagePath;
    await user.save();

    console.log('✅ Profile image uploaded:', user.email, '->', imagePath);

    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: imagePath,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message || 'Server error uploading image' });
  }
});

// @route   DELETE /api/auth/delete-profile-image
// @desc    Delete profile image
// @access  Private (requires JWT token)
router.delete('/delete-profile-image', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile image if exists and is not default
    if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Set profileImage to empty/null
    user.profileImage = '';
    await user.save();

    console.log('✅ Profile image deleted:', user.email);

    res.json({
      message: 'Profile image deleted successfully',
    });
  } catch (error) {
    console.error('Delete Image Error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting image' });
  }
});

export default router;
