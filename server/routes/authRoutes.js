const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Change Password (while logged in)
router.put('/change-password', protect, changePassword);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

module.exports = router;
