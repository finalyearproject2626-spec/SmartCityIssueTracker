const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, mobile, language } = req.body;
    const user = await User.findById(req.user.userId);

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (language) user.language = language;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      language: user.language
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
