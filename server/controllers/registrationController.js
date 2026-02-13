const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/sendEmail');

// Register for an event (Student only)
const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: studentId,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        message: 'You are already registered for this event',
        status: existingRegistration.status 
      });
    }

    // Create registration
    const registration = await Registration.create({
      student: studentId,
      event: eventId,
      status: 'pending',
    });

    // Populate student and event details for response
    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    res.status(201).json({
      message: 'Registration successful! Awaiting approval.',
      registration,
    });
  } catch (error) {
    console.error('Register Event Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// Get student's own registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate('event', 'title date location description')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get My Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching registrations' });
  }
};

// Get all registrations for a specific event (Event Creator/Teacher only)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists and user is the creator
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('student', 'name email college regNo department')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get Event Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching registrations' });
  }
};

// Approve a registration (Event Creator/Teacher only)
const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user is the event creator
    const event = await Event.findById(registration.event);
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this registration' });
    }

    // Check if ticket already exists (idempotency)
    if (registration.status === 'approved') {
      return res.status(400).json({ message: 'Registration already approved' });
    }

    // Update registration status
    registration.status = 'approved';
    await registration.save();

    // Generate unique ticket code
    const ticketCode = 'TKT-' + Date.now().toString(36).toUpperCase() + 
                       Math.random().toString(36).substring(2, 8).toUpperCase();

    // Generate QR code (base64) containing ticket info
    const qrData = JSON.stringify({
      ticketId: 'PENDING',
      ticketCode: ticketCode,
      eventId: registration.event._id || registration.event,
      studentId: registration.student._id || registration.student
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Auto-create ticket for the student
    const ticket = await Ticket.create({
      student: registration.student,
      event: registration.event,
      registration: registration._id,
      ticketCode: ticketCode,
      qrCode: qrCodeDataURL,
    });

    // Update registration with ticket code
    registration.ticketId = ticket.ticketCode;
    await registration.save();

    // Send approval email to student (non-blocking)
    sendApprovalEmail(
      registration.student.email || registration.student._id.toString(),
      registration.student.name,
      event.title,
      ticket.ticketCode,
      event.date,
      event.location
    ).then(emailResult => {
      if (emailResult.success) {
        console.log('✅ Approval email sent to:', registration.student.email);
      } else {
        console.warn('⚠️  Failed to send approval email:', emailResult.error);
      }
    }).catch(err => {
      console.warn('⚠️  Email send error:', err.message);
    });

    // Populate for response
    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    res.json({
      message: 'Registration approved! Ticket generated successfully.',
      registration,
      ticket: {
        ticketId: ticket._id,
        ticketCode: ticket.ticketCode,
        qrCode: ticket.qrCode,
        status: ticket.status,
        issuedAt: ticket.issuedAt,
      },
    });
  } catch (error) {
    console.error('Approve Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error approving registration' });
  }
};

// Reject a registration (Event Creator/Teacher only)
const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user is the event creator
    const event = await Event.findById(registration.event);
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this registration' });
    }

    registration.status = 'rejected';
    await registration.save();

    // Send rejection email to student (non-blocking)
    const rejectionReason = req.body.reason || 'Your registration was not approved.';
    sendRejectionEmail(
      registration.student.email || registration.student._id.toString(),
      registration.student.name,
      event.title,
      event.date,
      rejectionReason
    ).then(emailResult => {
      if (emailResult.success) {
        console.log('✅ Rejection email sent to:', registration.student.email);
      } else {
        console.warn('⚠️  Failed to send rejection email:', emailResult.error);
      }
    }).catch(err => {
      console.warn('⚠️  Email send error:', err.message);
    });

    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    res.json({
      message: 'Registration rejected',
      registration,
    });
  } catch (error) {
    console.error('Reject Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error rejecting registration' });
  }
};

// Get all pending registrations across all teacher's events
const getAllPendingRegistrations = async (req, res) => {
  try {
    // Find all events created by this teacher
    const teacherEvents = await Event.find({ createdBy: req.user._id }).select('_id');
    
    if (teacherEvents.length === 0) {
      return res.json([]);
    }
    
    const eventIds = teacherEvents.map(event => event._id);
    
    // Find all pending registrations for these events
    const registrations = await Registration.find({
      event: { $in: eventIds },
      status: 'pending'
    })
      .populate('student', 'name email college regNo department')
      .populate('event', 'title date location')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get All Pending Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching registrations' });
  }
};

module.exports = {
  registerEvent,
  getMyRegistrations,
  getEventRegistrations,
  getAllPendingRegistrations,
  approveRegistration,
  rejectRegistration,
};
