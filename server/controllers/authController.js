import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'eventsphere_secret_key_2024', { expiresIn: '30d' });
};

// Register User - Complete with Debugging
export const registerUser = async (req, res) => {
  console.log('\n========== REGISTER CONTROLLER ==========');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request Body:', JSON.stringify(req.body));
  console.log('===========================================\n');

  try {
    const { name, email, password, role, college, regNo, department } = req.body;

    // Debug: Check if req.body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('❌ req.body is EMPTY - Express JSON middleware may not be working');
      return res.status(400).json({ 
        message: 'Request body is empty. Please check API configuration.',
        hint: 'Make sure Content-Type header is application/json'
      });
    }

    console.log('✅ Received data:', { name, email, role, hasPassword: !!password });

    // Validate required fields
    if (!name || !email || !password || !role) {
      const missing = [];
      if (!name) missing.push('name');
      if (!email) missing.push('email');
      if (!password) missing.push('password');
      if (!role) missing.push('role');
      
      console.error('❌ Missing fields:', missing);
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}`,
        missingFields: missing
      });
    }

    // Only allow Gmail accounts
    if (!email.endsWith('@gmail.com')) {
      console.error('❌ Invalid email domain:', email);
      return res.status(400).json({ message: 'Only Gmail accounts are allowed' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.log('✅ Creating new user...');

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('✅ Password hashed successfully');

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      college: college || '',
      regNo: regNo || '',
      department: department || '',
    });

    console.log('✅ User created successfully:', user._id);

    // Return success response
    res.status(201).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      regNo: user.regNo,
      department: user.department,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: validationErrors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// Login User - Complete with Debugging
export const loginUser = async (req, res) => {
  console.log('\n========== LOGIN CONTROLLER ==========');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request Body:', JSON.stringify(req.body));
  console.log('======================================\n');

  try {
    let { email, password } = req.body;

    // Debug: Check if req.body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('❌ req.body is EMPTY');
      return res.status(400).json({ 
        message: 'Request body is empty. Please check API configuration.'
      });
    }

    // Validate inputs
    if (!email || !password) {
      console.error('❌ Missing credentials');
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    // Normalize email
    email = email.trim().toLowerCase();
    console.log('✅ Attempting login for:', email);

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ User found:', user.email, '| Role:', user.role);
    console.log('✅ Stored password length:', user.password.length);
    console.log('✅ Is password hashed:', user.password.startsWith('$2'));

    // Check password
    let isMatch = false;
    
    if (user.password.startsWith('$2')) {
      // Password is hashed - use bcrypt.compare
      isMatch = await bcrypt.compare(password, user.password);
      console.log('✅ bcrypt.compare result:', isMatch);
    } else {
      // Legacy: Plain text password
      isMatch = (password === user.password);
      console.log('✅ Plain text compare result:', isMatch);
      
      // Auto-upgrade to hashed password
      if (isMatch) {
        console.log('🔄 Upgrading to hashed password...');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        console.log('✅ Password upgraded to hashed');
      }
    }

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful for:', user.email);

    // Return success response
    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      regNo: user.regNo,
      department: user.department,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('❌ Login Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// Google Auth - Verify token and login/register user
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Verify Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('Google token verification error:', verifyError.message);
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - generate token and return
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        regNo: user.regNo,
        profileImage: user.profileImage || picture,
        token: generateToken(user._id),
      });
    } else {
      // Create new user (default role is student)
      const hashedPassword = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'student', // Default role for Google sign-in
        college: '',
        regNo: '',
        department: '',
        profileImage: picture,
      });

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        regNo: user.regNo,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: error.message || 'Server error during Google authentication' });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // Get user by ID from JWT token - exclude password
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data with all fields, using defaults for missing values
    res.json({
      _id: user._id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'student',
      college: user.college || '',
      regNo: user.regNo || '',
      department: user.department || '',
      profileImage: user.profileImage || '',
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching profile' });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log('📝 Update Profile Request Body:', req.body);
    console.log('📝 User ID from token:', req.user?._id);

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      console.error('❌ No user ID in request');
      return res.status(400).json({ message: 'User ID not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error('❌ User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('📝 Current user:', user.email);
    console.log('📝 Fields to update:', {
      name: req.body.name,
      college: req.body.college,
      regNo: req.body.regNo,
      department: req.body.department,
      profileImage: req.body.profileImage
    });

    // Update fields from request body
    if (req.body.name) user.name = req.body.name;
    if (req.body.college !== undefined) user.college = req.body.college;
    if (req.body.regNo !== undefined) user.regNo = req.body.regNo;
    if (req.body.department !== undefined) user.department = req.body.department;
    if (req.body.profileImage) user.profileImage = req.body.profileImage;

    // Save updated user
    await user.save();

    console.log('✅ User saved successfully:', user.email);
    console.log('✅ Updated fields:', {
      name: user.name,
      college: user.college,
      regNo: user.regNo,
      department: user.department,
      profileImage: user.profileImage
    });

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please enter your email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"EventSphere" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent to:', user.email);

      res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } catch (error) {
      console.error('Email send error:', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please enter a new password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash token and find user
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.status(200).json({
      message: 'Password reset successful! You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Change Password (while logged in)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password changed successfully for:', user.email);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
