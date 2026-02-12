const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific user
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      email: user.email,
      name: user.name,
      role: user.role,
      passwordLength: user.password.length,
      isHashed: user.password.startsWith('$2'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test database connection
router.get('/test', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ 
      status: 'connected', 
      userCount: count,
      message: count === 0 ? 'No users. Register first.' : `${count} users found.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
