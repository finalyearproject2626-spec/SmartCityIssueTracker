const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '383299996356661',
  api_key: process.env.CLOUDINARY_API_KEY || 'UFE7QfsQ9yS_rEf6GJ8M6aYsQB8',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET === 'your_api_secret_here' || process.env.CLOUDINARY_API_SECRET.trim() === '') {
  console.warn('⚠️  Cloudinary API Secret not set or invalid. File uploads will fail.');
  console.warn('   Please set CLOUDINARY_API_SECRET in your .env file');
}

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartcity/complaints',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
    resource_type: 'auto', // Automatically detect image or video
    transformation: [
      { width: 1000, height: 1000, crop: 'limit', quality: 'auto' }
    ]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Storage for resolution proof (admin uploads)
const proofStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartcity/resolution-proof',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    resource_type: 'image',
    transformation: [
      { width: 1000, height: 1000, crop: 'limit', quality: 'auto' }
    ]
  }
});

const uploadProof = multer({
  storage: proofStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

module.exports = { upload, uploadProof, cloudinary };
