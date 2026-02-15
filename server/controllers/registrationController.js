import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

// Create new registration
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
    
    res.status(201).json({
      message: 'Registration successful! Awaiting approval.',
      registration,
    });
  } catch (error) {
    console.error('Create Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get student's registrations
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

// Get teacher's registrations (all registrations for teacher's events)
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

// Approve registration
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

// Reject registration
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
    res.json({
      message: 'Registration rejected',
      registration,
    });
  } catch (error) {
    console.error('Reject Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Cancel registration (student cancels their own)
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
