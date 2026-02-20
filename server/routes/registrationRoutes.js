import express from "express";
import {
  createRegistration,
  getStudentRegistrations,
  getTeacherRegistrations,
  getEventRegistrations,
  approveRegistration,
  rejectRegistration,
  cancelRegistration,
  getRegistrationById,
  getPendingRegistrationsCount,
  approveAllRegistrations,
  rejectAllRegistrations
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTeacher } from '../middleware/roleMiddleware.js';

const router = express.Router();

// REGISTRATION ROUTES - Handles event registration operations
// Students register for events, teachers approve/reject registrations

// Create new registration
router.post("/", protect, createRegistration);

// Get student's registrations
router.get("/student/:id", protect, getStudentRegistrations);

// Get teacher's registrations (all registrations for teacher's events)
router.get("/teacher", protect, isTeacher, getTeacherRegistrations);

// Get pending registrations count for teacher dashboard
router.get("/teacher/pending-count", protect, isTeacher, getPendingRegistrationsCount);

// Get registrations for specific event
router.get("/event/:id", protect, isTeacher, getEventRegistrations);

// Approve registration
router.put("/approve/:id", protect, isTeacher, approveRegistration);

// Reject registration
router.put("/reject/:id", protect, isTeacher, rejectRegistration);

// Approve ALL registrations
router.put("/approve-all", protect, isTeacher, approveAllRegistrations);

// Reject ALL registrations
router.put("/reject-all", protect, isTeacher, rejectAllRegistrations);

// Cancel registration (student cancels their own)
router.delete("/:id", protect, cancelRegistration);

// Get single registration by ID (for ticket view)
router.get("/:id", protect, getRegistrationById);

// Get ticket by registration ID (alias for getRegistrationById)
router.get("/ticket/:id", protect, getRegistrationById);

export default router;
