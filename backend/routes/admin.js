const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');
const { adminAuth } = require('../middleware/auth');
const { uploadProof } = require('../config/cloudinary');
const { sendEmail, isEmailConfigured } = require('../config/email');

// Admin Register (for initial setup)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ email, password, name });
    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Static admin credentials – no DB check
const STATIC_ADMIN_EMAIL = 'admingov@gmail.com';
const STATIC_ADMIN_PASSWORD = 'admingov123';
const STATIC_ADMIN_ID = 'static-admin';

// Admin Login (static only – no database)
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== STATIC_ADMIN_EMAIL || password !== STATIC_ADMIN_PASSWORD) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: STATIC_ADMIN_ID, role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      admin: {
        id: STATIC_ADMIN_ID,
        name: 'Admin User',
        email: STATIC_ADMIN_EMAIL
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all complaints
router.get('/complaints', adminAuth, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email mobile')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get complaint by ID
router.get('/complaints/:id', adminAuth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email mobile')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update complaint status
router.put('/complaints/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, officerRemarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!['Pending', 'In Progress', 'Rejected', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    complaint.status = status;
    if (officerRemarks) complaint.officerRemarks = officerRemarks;
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }
    complaint.updatedAt = new Date();
    // Only set assignedTo for DB-backed admins (ObjectId); static admin has no ObjectId
    if (req.admin.adminId !== STATIC_ADMIN_ID) {
      complaint.assignedTo = req.admin.adminId;
    }

    await complaint.save();

    if (isEmailConfigured()) {
      const populated = await Complaint.findById(req.params.id).populate('userId', 'name email');
      const userEmail = populated?.userId?.email;
      if (userEmail) {
        sendEmail({
          to: userEmail,
          subject: `Complaint ${complaint.complaintId} – Status updated to ${status}`,
          html: `<p>Hi ${populated.userId.name || 'User'},</p><p>Your complaint <strong>${complaint.complaintId}</strong> has been updated to <strong>${status}</strong>.</p>${officerRemarks ? `<p>Remarks: ${officerRemarks}</p>` : ''}<p>— Smart City Issue Tracker</p>`
        }).catch(err => console.error('Status email failed:', err.message));
      }
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resolution proof
router.post('/complaints/:id/resolution-proof', adminAuth, uploadProof.array('proof', 5), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.files && req.files.length > 0) {
      // Cloudinary returns file.secure_url or file.url or file.path
      const proofFiles = req.files.map(file => {
        const url = file.secure_url || file.url || file.path;
        console.log('Resolution proof file:', {
          secure_url: file.secure_url,
          url: file.url,
          path: file.path,
          final_url: url
        });
        return url;
      }).filter(url => url); // Filter out any null/undefined URLs
      
      console.log('Storing resolution proof URLs:', proofFiles);
      complaint.resolutionProof = proofFiles;
      complaint.status = 'Resolved';
      complaint.resolvedAt = new Date();
      await complaint.save();

      if (isEmailConfigured()) {
        const populated = await Complaint.findById(req.params.id).populate('userId', 'name email');
        const userEmail = populated?.userId?.email;
        if (userEmail) {
          const proofImagesHtml = proofFiles
            .filter(url => url && typeof url === 'string')
            .map(url => `<img src="${url}" alt="Resolution proof" style="max-width:100%;height:auto;border-radius:8px;margin:8px 0;border:1px solid #ddd;" />`)
            .join('');
          const proofSection = proofImagesHtml
            ? `<h3 style="color:#1a4d4d;margin:16px 0 8px;">Resolution Proof</h3><div style="margin:12px 0;">${proofImagesHtml}</div><p style="font-size:12px;color:#666;">You can also view these in the app under Complaint Details.</p>`
            : '';
          sendEmail({
            to: userEmail,
            subject: `Complaint ${complaint.complaintId} – Resolved with proof`,
            html: `
              <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <h2 style="color:#1a4d4d;">Complaint Resolved</h2>
                <p>Hi ${populated.userId.name || 'User'},</p>
                <p>Your complaint <strong>${complaint.complaintId}</strong> (${complaint.category || 'General'}) has been <strong>Resolved</strong>.</p>
                <p>Resolved on: <strong>${new Date(complaint.resolvedAt).toLocaleString()}</strong></p>
                ${complaint.officerRemarks ? `<p><strong>Remarks:</strong> ${complaint.officerRemarks}</p>` : ''}
                ${proofSection}
                <p style="font-size:12px;color:#666;margin-top:12px;">If images don't load above, you can view the resolution proof in the app under <strong>My Complaints → Complaint Details</strong>.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
                <p style="color:#666;font-size:12px;">— Smart City Issue Tracker</p>
              </div>
            `
          }).catch(err => console.error('Resolution proof email failed:', err.message));
        }
      }
    } else {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email mobile');

    res.json({
      total,
      pending,
      inProgress,
      rejected,
      resolved,
      recentComplaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current admin (static admin has no DB record)
router.get('/me', adminAuth, (req, res) => {
  try {
    if (req.admin.adminId === STATIC_ADMIN_ID) {
      return res.json({
        _id: STATIC_ADMIN_ID,
        name: 'Admin User',
        email: STATIC_ADMIN_EMAIL
      });
    }
    Admin.findById(req.admin.adminId).select('-password')
      .then(admin => res.json(admin))
      .catch(err => res.status(500).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
