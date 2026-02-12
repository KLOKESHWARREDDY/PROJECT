const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  registerUser, 
  loginUser, 
  updateUser, 
  getUser, 
  changePassword,
  uploadProfileImage,
  debugUser, 
  getAllUsers, 
  testDB 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ✅ ENSURE UPLOAD FOLDER EXISTS
const ensureUploadFolder = () => {
  const uploadDir = 'uploads/profiles';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created upload folder:', uploadDir);
  }
};

// Call once on startup
ensureUploadFolder();

// ✅ MULTER CONFIGURATION
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Multer: Destination called');
    const uploadDir = 'uploads/profiles';
    
    // Ensure folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log('📁 Multer: Filename called');
    // Create unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'profileImage' + uniqueSuffix + ext);
  }
});

// ✅ FILE FILTER - Only allow images
const fileFilter = (req, file, cb) => {
  console.log('📁 Multer: File filter called', file.mimetype);
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
  }
};

// ✅ CREATE MULTER INSTANCE
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// ✅ PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/test-db', testDB);
router.get('/users', getAllUsers);
router.get('/debug/:email', debugUser);

// ✅ PROTECTED ROUTES
router.put('/profile', protect, updateUser);
router.get('/profile', protect, getUser);
router.put('/change-password', protect, changePassword);

// ✅ IMAGE UPLOAD ROUTE
// Note: protect middleware runs BEFORE upload.single()
// So req.user will be available
router.post(
  '/upload-profile-image', 
  protect, 
  upload.single('profileImage'), 
  uploadProfileImage
);

// ✅ MULTER ERROR HANDLER (must be after routes)
router.use((err, req, res, next) => {
  console.error('❌ Multer error:', err.message);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  
  if (err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }
  
  next(err);
});

module.exports = router;
