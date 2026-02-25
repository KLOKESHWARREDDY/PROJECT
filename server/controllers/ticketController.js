import Ticket from '../models/Ticket.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// TICKET CONTROLLER - Handles ticket operations
// This controller manages getting tickets, verifying tickets, and generating PDFs

// GET MY TICKENS - Returns all tickets for logged-in student
// Step 1: Get user ID from authentication middleware
// Step 2: Query MongoDB for tickets matching student ID
// Step 3: Populate event and registration details
// Step 4: Sort by creation date (newest first)
// Step 5: Return tickets array
// Request: GET /api/tickets/my (requires authentication)
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ student: req.user._id })
      .populate('event', 'title date location description')
      .populate('registration', 'status')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Get My Tickets Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching tickets' });
  }
};

// GET TICKET BY ID - Returns single ticket details
// Step 1: Extract ticket ID from request parameters
// Step 2: Find ticket in database
// Step 3: Check if ticket exists
// Step 4: Verify user is ticket owner or teacher (event creator)
// Step 5: Return ticket data
// Request: GET /api/tickets/:id
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name email college regNo')
      .populate('event', 'title date location description')
      .populate('registration', 'status');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only the ticket owner or event creator can view
    if (ticket.student._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get Ticket By ID Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching ticket' });
  }
};

// VERIFY TICKET - Validates ticket by code (for event entry)
// Step 1: Extract ticket code from request parameters
// Step 2: Search for ticket with matching code
// Step 3: If not found, return invalid response
// Step 4: If already used, return used response with timestamp
// Step 5: If cancelled, return cancelled response
// Step 6: If valid, return valid response with ticket details
// Request: GET /api/tickets/verify/:code
export const verifyTicket = async (req, res) => {
  try {
    const { code } = req.params;

    const ticket = await Ticket.findOne({ ticketCode: code })
      .populate('student', 'name email')
      .populate('event', 'title date location');

    if (!ticket) {
      return res.status(404).json({
        valid: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.status === 'used') {
      return res.status(400).json({
        valid: false,
        message: 'Ticket has already been used',
        ticket: {
          ticketCode: ticket.ticketCode,
          event: ticket.event,
          student: ticket.student,
          usedAt: ticket.updatedAt
        }
      });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({
        valid: false,
        message: 'Ticket has been cancelled',
        ticket: {
          ticketCode: ticket.ticketCode,
          event: ticket.event,
          student: ticket.student
        }
      });
    }

    // Ticket is valid
    res.json({
      valid: true,
      message: 'Ticket is valid',
      ticket: {
        ticketCode: ticket.ticketCode,
        status: ticket.status,
        event: ticket.event,
        student: ticket.student,
        issuedAt: ticket.issuedAt
      }
    });
  } catch (error) {
    console.error('Verify Ticket Error:', error);
    res.status(500).json({ message: error.message || 'Server error verifying ticket' });
  }
};

// USE TICKET - Marks ticket as used (for event check-in)
// Step 1: Extract ticket ID from request parameters
// Step 2: Find ticket in database
// Step 3: Check if ticket exists
// Step 4: Check if ticket already used - return error if so
// Step 5: Check if ticket is cancelled - return error if so
// Step 6: Update ticket status to 'used'
// Step 7: Save to database and return success
// Request: PUT /api/tickets/:id/use
export const useTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status === 'used') {
      return res.status(400).json({ message: 'Ticket already used' });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ message: 'Ticket is cancelled' });
    }

    ticket.status = 'used';
    await ticket.save();

    res.json({
      message: 'Ticket marked as used (checked-in)',
      ticket
    });
  } catch (error) {
    console.error('Use Ticket Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating ticket' });
  }
};

// DOWNLOAD TICKET PDF - Generates PDF ticket for download
// Step 1: Extract ticket ID from request parameters
// Step 2: Find ticket with populated student and event data
// Step 3: Check if ticket exists
// Step 4: Verify user is ticket owner or teacher
// Step 5: Set response headers for PDF download
// Step 6: Create new PDF document using PDFKit
// Step 7: Add event name, student details, date, location to PDF
// Step 8: Add ticket code box with visual styling
// Step 9: Convert QR code base64 to image and add to PDF
// Step 10: Add footer with ticket ID and issue date
// Step 11: Send PDF to client
// Request: GET /api/tickets/:id/pdf
export const downloadTicketPDF = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name email college regNo')
      .populate('event', 'title date location description')
      .populate('registration', 'status');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Authorization check
    if (ticket.student._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to download this ticket' });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticket.ticketCode}.pdf`);

    // Create PDF document
    const doc = new PDFDocument({ size: 'A5', margin: 50 });

    // Pipe to response
    doc.pipe(res);

    // PDF Design
    // Header
    doc.fontSize(25).font('Helvetica-Bold').fillColor('#4F46E5')
      .text('EventSphere', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).font('Helvetica').fillColor('#333')
      .text('EVENT TICKET', { align: 'center' });
    doc.moveDown(2);

    // Event Name
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#1F2937')
      .text(ticket.event.title, { align: 'center' });
    doc.moveDown();

    // Divider line
    doc.strokeColor('#E5E7EB').lineWidth(2)
      .moveTo(50, doc.y).lineTo(400, doc.y).stroke();
    doc.moveDown();

    // Ticket Details
    doc.fontSize(12).font('Helvetica').fillColor('#4B5563');

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    doc.text(`Student Name: ${ticket.student.name}`, { align: 'left' });
    doc.text(`Email: ${ticket.student.email}`, { align: 'left' });
    if (ticket.student.college) {
      doc.text(`College: ${ticket.student.college}`, { align: 'left' });
    }
    doc.moveDown();

    doc.text(`Date: ${formatDate(ticket.event.date)}`, { align: 'left' });
    doc.text(`Location: ${ticket.event.location}`, { align: 'left' });
    doc.moveDown();

    // Ticket Code Box
    doc.rectangle(50, doc.y, 350, 40)
      .fill('#F3F4F6');
    doc.fillColor('#1F2937').fontSize(14).font('Helvetica-Bold')
      .text(`Ticket Code: ${ticket.ticketCode}`, 60, doc.y - 30, { align: 'center' });
    doc.moveDown(2);

    // QR Code (base64 to image) dynamically generated with text
    const qrDataText = `🎟️ TICKET DETAILS 🎟️\n\nTicket Code: ${ticket.ticketCode}\nEvent: ${ticket.event.title}\nDate: ${formatDate(ticket.event.date)}\nLocation: ${ticket.event.location}\n\n👤 ATTENDEE INFO\nName: ${ticket.student.name}\nEmail: ${ticket.student.email}`;

    try {
      const newQrCodeDataURL = await QRCode.toDataURL(qrDataText, { width: 400 });
      const base64Data = newQrCodeDataURL.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      doc.text('Scan at event entrance:', { align: 'center' });
      doc.moveDown(0.5);
      doc.image(imageBuffer, {
        fit: [150, 150],
        align: 'center'
      });
    } catch (qrErr) {
      console.error('Error generating new QR code for PDF:', qrErr);
      // Fallback to original DB QR code if dynamic generation fails
      if (ticket.qrCode) {
        try {
          const fallbackBase64 = ticket.qrCode.replace(/^data:image\/png;base64,/, '');
          const fallbackBuffer = Buffer.from(fallbackBase64, 'base64');
          doc.text('Scan at event entrance:', { align: 'center' });
          doc.moveDown(0.5);
          doc.image(fallbackBuffer, { fit: [150, 150], align: 'center' });
        } catch (e) {
          console.error('Fallback QR code failed too:', e);
        }
      }
    }

    doc.moveDown();

    // Footer
    doc.fontSize(10).fillColor('#9CA3AF')
      .text(`Ticket ID: ${ticket._id}`, { align: 'center' })
      .text(`Issued: ${new Date(ticket.issuedAt).toLocaleDateString()}`, { align: 'center' })
      .text('Thank you for using EventSphere!', { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Download PDF Error:', error);
    res.status(500).json({ message: error.message || 'Server error generating PDF' });
  }
};
