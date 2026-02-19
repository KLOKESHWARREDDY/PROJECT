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

// TICKET ROUTES - Handles ticket operations
// Students can view/download tickets, teachers can verify and use tickets

// GET /api/tickets/my - Get student's tickets (requires authentication)
router.get('/my', protect, getMyTickets);

// GET /api/tickets/:id - Get single ticket details
router.get('/:id', protect, getTicketById);

// GET /api/tickets/:id/pdf - Download ticket as PDF
router.get('/:id/pdf', protect, downloadTicketPDF);

// GET /api/tickets/verify/:code - Verify ticket by code (teacher only)
router.get('/verify/:code', protect, isTeacher, verifyTicket);

// PUT /api/tickets/:id/use - Mark ticket as used (teacher only)
router.put('/:id/use', protect, isTeacher, useTicket);

export default router;
