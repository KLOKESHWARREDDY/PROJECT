import express from "express";
import { registerUser, loginUser, googleAuth, getUserProfile, updateUserProfile, forgotPassword, resetPassword, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// AUTH ROUTES - Handles user authentication and profile management
// These routes manage user registration, login, and profile updates

// TEST ENDPOINT - Verifies server receives JSON data correctly
// Used for debugging request body parsing
router.post("/test-register", (req, res) => {
  console.log('[TEST] Raw req.body:', req.body);
  console.log('[TEST] Content-Type:', req.headers['content-type']);
  res.json({
    message: 'Test endpoint working',
    receivedBody: req.body,
    contentType: req.headers['content-type']
  });
});

// AUTHENTICATION ROUTES
// POST /api/auth/register - Create new user account
router.post('/register', registerUser);

// POST /api/auth/login - Authenticate user and get token
router.post('/login', loginUser);

// POST /api/auth/google - Login/register with Google OAuth
router.post('/google', googleAuth);

// GET /api/auth/profile - Get current user profile (requires authentication)
router.get('/profile', protect, getUserProfile);

// PUT /api/auth/profile - Update user profile (requires authentication)
router.put('/profile', protect, updateUserProfile);

// PASSWORD RESET ROUTES
// POST /api/auth/forgot-password - Send password reset email
router.post('/forgot-password', forgotPassword);

// PUT /api/auth/reset-password/:token - Reset password with token
router.put('/reset-password/:token', resetPassword);

// PUT /api/auth/change-password - Change password while logged in
router.put('/change-password', protect, changePassword);

// TEST ROUTE - Verify routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

export default router;
