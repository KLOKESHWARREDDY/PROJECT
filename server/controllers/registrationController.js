import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

// REGISTRATION CONTROLLER - Handles student event registrations
// This controller manages registration creation, approval, rejection, and cancellation
// Students register for events, teachers approve/reject registrations

// Helper function to create notification - used internally
// Step 1: Create notification object with user, title, message, type
// Step 2: Save to MongoDB
// Step 3: Handle any errors silently (non-blocking)
const createNotification = async (userId, title, message, type, relatedId = null) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// CREATE REGISTRATION - Student registers for an event
// Step 1: Extract eventId from request body
// Step 2: Get student ID from authenticated user (req.user)
// Step 3: Validate eventId is provided
// Step 4: Check if event exists in database
// Step 5: Check if student already registered for this event
// Step 6: Create new registration with status 'pending'
// Step 7: Send notification to event teacher
// Step 8: Return success message with registration data
// Request: POST /api/registrations with body { eventId }
export const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    console.log("=== CREATE REGISTRATION ===");
    console.log("eventId:", eventId);
    console.log("studentId:", studentId);

    // Validate eventId is provided
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

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
        message: 'Already registered for this event',
        status: existingRegistration.status
      });
    }

    // Create registration
    const registration = await Registration.create({
      student: studentId,
      event: eventId,
      teacher: event.teacher,
      status: 'pending',
    });

    console.log("Registration created:", registration._id);

    // Populate for response
    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    // Send notification to teacher
    const eventWithTeacher = await Event.findById(eventId).populate('teacher', 'name');
    await createNotification(
      eventWithTeacher.teacher._id,
      'New Registration',
      `A student registered for your event "${eventWithTeacher.title}"`,
      'registration',
      registration._id
    );

    res.status(201).json({
      message: 'Registration successful! Awaiting approval.',
      registration,
    });
  } catch (error) {
    console.error('Create Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET STUDENT REGISTRATIONS - Returns all registrations for a specific student
// Step 1: Extract student ID from request parameters
// Step 2: Verify requesting user owns these registrations
// Step 3: Query MongoDB for registrations matching student ID
// Step 4: Populate event and teacher details
// Step 5: Sort by creation date (newest first)
// Step 6: Return array of registrations
// Request: GET /api/registrations/student/:id
export const getStudentRegistrations = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log("=== GET STUDENT REGISTRATIONS ===");
    console.log("Student ID from params:", studentId);
    console.log("Current user:", req.user._id);

    // Ensure user can only see their own registrations
    if (studentId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ student: studentId })
      .populate('event', 'title date location description image')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    console.log("Found registrations:", registrations.length);
    res.json(registrations);
  } catch (error) {
    console.error('Get Student Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET TEACHER REGISTRATIONS - Returns all registrations for teacher's events
// Step 1: Get teacher ID from authenticated user
// Step 2: Query MongoDB for registrations where teacher matches logged in user
// Step 3: Populate student and event details
// Step 4: Sort by creation date (newest first)
// Step 5: Return array of all registrations across teacher's events
// Request: GET /api/registrations/teacher (requires teacher authentication)
export const getTeacherRegistrations = async (req, res) => {
  try {
    console.log("=== GET TEACHER REGISTRATIONS ===");
    console.log("Teacher ID:", req.user._id);

    // Find all registrations where teacher matches logged-in teacher
    const registrations = await Registration.find({ teacher: req.user._id })
      .populate('student', 'name email college regNo department')
      .populate('event', 'title date location')
      .sort({ createdAt: -1 });

    console.log("Found registrations:", registrations.length);
    res.json(registrations);
  } catch (error) {
    console.error('Get Teacher Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


// Get registrations for a specific event (Teacher only)
export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params; // Event ID
    console.log("=== GET EVENT REGISTRATIONS ===");
    console.log("Event ID:", id);
    console.log("Teacher ID:", req.user._id);

    // Verify event exists and belongs to teacher
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ event: id })
      .populate('student', 'name email college regNo department')
      .populate('event', 'title date location')
      .sort({ createdAt: -1 });

    console.log(`Found ${registrations.length} registrations for event ${id}`);
    res.json(registrations);
  } catch (error) {
    console.error('Get Event Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// APPROVE REGISTRATION - Teacher approves a student's registration
// Step 1: Extract registration ID from request parameters
// Step 2: Find registration in database
// Step 3: Verify teacher owns the event
// Step 4: Update registration status to 'approved'
// Step 5: Generate unique ticket code
// Step 6: Generate QR code for the ticket
// Step 7: Create ticket in database
// Step 8: Send notification to student
// Step 9: Return success with registration and ticket code
// Request: PUT /api/registrations/:id/approve
export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("=== APPROVE REGISTRATION ===");
    console.log("Registration ID:", id);

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify teacher owns the event
    const event = await Event.findById(registration.event);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status
    registration.status = 'approved';
    await registration.save();

    // Generate ticket
    const ticketCode = 'TKT-' + Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    const qrData = JSON.stringify({
      ticketCode: ticketCode,
      eventId: registration.event,
      studentId: registration.student
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 200 });

    // Create ticket
    const ticket = await Ticket.create({
      student: registration.student,
      event: registration.event,
      registration: registration._id,
      ticketCode: ticketCode,
      qrCode: qrCodeDataURL,
    });

    // Update registration with ticket
    registration.ticketId = ticket.ticketCode;
    await registration.save();

    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    console.log("Registration approved successfully");

    // Send notification to student
    await createNotification(
      registration.student._id,
      'Registration Approved',
      `Your registration for "${registration.event.title}" has been approved!`,
      'approval',
      registration._id
    );

    res.json({
      message: 'Registration approved!',
      registration,
      ticket: { ticketCode: ticket.ticketCode }
    });
  } catch (error) {
    console.error('Approve Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// REJECT REGISTRATION - Teacher rejects a student's registration
// Step 1: Extract registration ID from request parameters
// Step 2: Find registration in database
// Step 3: Verify teacher owns the event
// Step 4: Update registration status to 'rejected'
// Step 5: Send notification to student
// Step 6: Return success message
// Request: PUT /api/registrations/:id/reject
export const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("=== REJECT REGISTRATION ===");
    console.log("Registration ID:", id);

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify teacher owns the event
    const event = await Event.findById(registration.event);
    if (event.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status
    registration.status = 'rejected';
    await registration.save();

    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    console.log("Registration rejected successfully");

    // Send notification to student
    await createNotification(
      registration.student._id,
      'Registration Rejected',
      `Your registration for "${registration.event.title}" has been rejected.`,
      'approval',
      registration._id
    );

    res.json({
      message: 'Registration rejected',
      registration,
    });
  } catch (error) {
    console.error('Reject Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// CANCEL REGISTRATION - Student cancels their own registration
// Step 1: Extract registration ID from request parameters
// Step 2: Get user ID from authenticated user
// Step 3: Find registration in database
// Step 4: Verify student owns this registration
// Step 5: If already approved, also delete the associated ticket
// Step 6: Delete registration from database
// Step 7: Return success message
// Request: DELETE /api/registrations/:id (student only)
export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("=== CANCEL REGISTRATION ===");
    console.log("Registration ID:", id);
    console.log("User ID:", req.user._id);

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify student owns the registration
    console.log("Registration student:", registration.student);
    console.log("User ID:", req.user._id);

    if (registration.student.toString() !== req.user._id.toString()) {
      console.log("Authorization failed!");
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    // Check if already approved - if so, also delete ticket
    if (registration.status === 'approved') {
      await Ticket.deleteOne({ registration: id });
    }

    // Delete registration
    await Registration.findByIdAndDelete(id);

    console.log("Registration cancelled successfully");
    res.json({
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get single registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id)
      .populate('student', 'name email')
      .populate('event', 'title date location')
      .populate('teacher', 'name');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Get Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get pending registrations count for teacher's events
export const getPendingRegistrationsCount = async (req, res) => {
  try {
    console.log("=== GET PENDING REGISTRATIONS COUNT ===");
    console.log("Teacher ID:", req.user._id);

    // Count registrations where teacher matches logged-in teacher AND status is pending
    const count = await Registration.countDocuments({
      teacher: req.user._id,
      status: 'pending'
    });

    console.log("Pending registrations count:", count);
    res.json({ count });
  } catch (error) {
    console.error('Get Pending Count Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
