import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isTeacher } from '../middleware/roleMiddleware.js';
import {
  getMyTickets,
  getTicketById,
  verifyTicket,
  useTicket,
  downloadTicketPDF
} from '../controllers/ticketController.js';

const router = express.Router();

// Student routes
router.get('/my', protect, getMyTickets); // Get student's tickets
router.get('/:id', protect, getTicketById); // Get single ticket
router.get('/:id/pdf', protect, downloadTicketPDF); // Download ticket PDF

// Teacher routes
router.get('/verify/:code', protect, isTeacher, verifyTicket); // Verify ticket by code
router.put('/:id/use', protect, isTeacher, useTicket); // Mark ticket as used

export default router;
