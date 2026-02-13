const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');
const {
  getMyTickets,
  getTicketById,
  verifyTicket,
  useTicket,
  downloadTicketPDF
} = require('../controllers/ticketController');

// Student routes
router.get('/my', protect, getMyTickets); // Get student's tickets
router.get('/:id', protect, getTicketById); // Get single ticket
router.get('/:id/pdf', protect, downloadTicketPDF); // Download ticket PDF

// Teacher routes
router.get('/verify/:code', protect, isTeacher, verifyTicket); // Verify ticket by code
router.put('/:id/use', protect, isTeacher, useTicket); // Mark ticket as used

module.exports = router;
