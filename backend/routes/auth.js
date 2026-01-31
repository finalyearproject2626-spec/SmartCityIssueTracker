const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { auth } = require('../middleware/auth');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register with Email/Password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, language } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      mobile,
      language: language || 'english'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login with Email/Password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin credentials
    if (email === 'admin@city.gov') {
      const admin = await Admin.findOne({ email });
      if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch) {
          const token = jwt.sign(
            { adminId: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
          );

          return res.json({
            token,
            admin: {
              id: admin._id,
              name: admin.name,
              email: admin.email
            },
            isAdmin: true
          });
        }
      }
      // If admin credentials don't match, continue to check as user
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        language: user.language
      },
      isAdmin: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ mobile });
    
    if (user) {
      user.otp = { code: otp, expiresAt };
      await user.save();
    } else {
      user = new User({
        mobile,
        otp: { code: otp, expiresAt }
      });
      await user.save();
    }

    // In production, send OTP via SMS (Twilio)
    // For now, return OTP in response (remove in production)
    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({ message: 'OTP sent successfully', otp }); // Remove otp in production
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp, name, language } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Update user if name provided
    if (name) {
      user.name = name;
    }
    if (language) {
      user.language = language;
    }
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate reset token (simplified - in production use proper reset flow)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // In production, send email with reset link
    res.json({ message: 'Password reset link sent to email', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
