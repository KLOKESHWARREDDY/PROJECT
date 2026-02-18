import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/history', protect, getChatHistory);
router.post('/send', protect, sendMessage);

export default router;
