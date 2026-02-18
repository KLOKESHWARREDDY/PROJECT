import express from "express";
import { registerUser, loginUser, googleAuth, getUserProfile, updateUserProfile, forgotPassword, resetPassword, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test endpoint to verify server is receiving data
router.post("/test-register", (req, res) => {
  console.log('[TEST] Raw req.body:', req.body);
  console.log('[TEST] Content-Type:', req.headers['content-type']);
  res.json({ 
    message: 'Test endpoint working',
    receivedBody: req.body,
    contentType: req.headers['content-type']
  });
});

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Change Password (while logged in)
router.put('/change-password', protect, changePassword);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

export default router;
