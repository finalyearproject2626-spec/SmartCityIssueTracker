const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const { upload } = require('../config/cloudinary');

// Generate unique complaint ID
const generateComplaintId = () => {
  return 'COMP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create complaint
router.post('/', auth, (req, res, next) => {
  upload.array('media', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary upload error:', err);
      return res.status(400).json({ 
        message: err.message || 'File upload failed',
        error: err.toString()
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { category, description, latitude, longitude, address } = req.body;

    const images = [];
    const videos = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Cloudinary returns file.secure_url or file.url
        const fileUrl = file.secure_url || file.url || file.path;
        if (!fileUrl) {
          console.error('File upload error: No URL returned', file);
          return;
        }
        
        const isVideo = file.resource_type === 'video' || 
                       file.mimetype?.startsWith('video/') ||
                       file.originalname?.match(/\.(mp4|mov|avi)$/i);
        
        if (isVideo) {
          videos.push(fileUrl);
        } else {
          images.push(fileUrl);
        }
      });
    }

    const complaint = new Complaint({
      complaintId: generateComplaintId(),
      userId: req.user.userId,
      category,
      description,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || ''
      },
      images,
      videos,
      status: 'Pending'
    });

    await complaint.save();
    await complaint.populate('userId', 'name email mobile');

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    const errorMessage = error.message || 'Failed to create complaint';
    const errorDetails = error.toString();
    
    res.status(500).json({ 
      message: errorMessage,
      error: errorDetails,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user's complaints
router.get('/my-complaints', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email mobile');
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaint by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email mobile')
      .populate('assignedTo', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user owns the complaint or is admin
    if (complaint.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit feedback
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.feedback = { rating, comment };
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaint statistics for user
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const total = await Complaint.countDocuments({ userId: req.user.userId });
    const resolved = await Complaint.countDocuments({ 
      userId: req.user.userId, 
      status: 'Resolved' 
    });
    const pending = await Complaint.countDocuments({ 
      userId: req.user.userId, 
      status: 'Pending' 
    });
    const inProgress = await Complaint.countDocuments({ 
      userId: req.user.userId, 
      status: 'In Progress' 
    });

    res.json({ total, resolved, pending, inProgress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
