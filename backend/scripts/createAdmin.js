const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await Admin.findOne({ email: 'admingov@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({
      email: 'admingov@gmail.com',
      password: 'admingov123',
      name: 'Admin User'
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admingov@gmail.com');
    console.log('Password: admingov123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
