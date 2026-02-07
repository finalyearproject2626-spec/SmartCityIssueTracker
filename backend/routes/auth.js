const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendEmail, isEmailConfigured } = require('../config/email');

// Normalize email: trim, lowercase, fix common typo @gmail@gmail.com
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  let e = email.trim().toLowerCase();
  if (e.endsWith('@gmail@gmail.com')) e = e.replace('@gmail@gmail.com', '@gmail.com');
  return e;
}

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

    const normalizedEmail = normalizeEmail(email);
    const conditions = [{ email: normalizedEmail }];
    if (mobile && String(mobile).trim()) conditions.push({ mobile: String(mobile).trim() });
    const existingUser = await User.findOne({ $or: conditions });
    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({ message: 'An account with this email already exists. Try logging in.' });
      }
      return res.status(400).json({ message: 'An account with this mobile number already exists.' });
    }

    const user = new User({
      name: name || 'User',
      email: normalizedEmail,
      password,
      mobile: mobile ? String(mobile).trim() : undefined,
      language: language || 'english'
    });

    await user.save();

    if (isEmailConfigured() && user.email) {
      sendEmail({
        to: user.email,
        subject: 'Welcome to Smart City Issue Tracker',
        html: `<p>Hi ${user.name || 'User'},</p><p>Your account has been created successfully. You can now log in and raise complaints.</p><p>— Smart City Issue Tracker</p>`
      }).catch(err => console.error('Welcome email failed:', err.message));
    }

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
    const normalizedEmail = normalizeEmail(email);

    // Static admin (no DB) – if these credentials, redirect to admin dashboard
    if (normalizedEmail === 'admingov@gmail.com' && password === 'admingov123') {
      const token = jwt.sign(
        { adminId: 'static-admin', role: 'admin' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
      );
      return res.json({
        token,
        admin: { id: 'static-admin', name: 'Admin User', email: 'admingov@gmail.com' },
        isAdmin: true
      });
    }

    // Regular user login (use normalized email so register typo matches)
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'This account uses mobile OTP. Please sign in with your mobile number.' });
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

// Forgot Password – sends reset link to email
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: 'No account found with this email.' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'This account uses mobile OTP. Please sign in with your mobile number.' });
    }

    const resetToken = jwt.sign(
      { userId: user._id, purpose: 'password-reset' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    if (isEmailConfigured()) {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password – Smart City Issue Tracker',
        html: `<p>Hi ${user.name || 'User'},</p><p>You requested a password reset. Click the link below (valid for 1 hour):</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you didn't request this, ignore this email.</p><p>— Smart City Issue Tracker</p>`
      });
    } else {
      return res.status(503).json({ message: 'Email is not configured. Contact support.' });
    }

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
