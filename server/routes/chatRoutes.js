import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CHAT ROUTES - Handles chatbot conversation operations
// GET /api/chat/history - Get chat history for current user (requires authentication)
router.get('/history', protect, getChatHistory);

// POST /api/chat/send - Send message and get bot response (requires authentication)
router.post('/send', protect, sendMessage);

export default router;
