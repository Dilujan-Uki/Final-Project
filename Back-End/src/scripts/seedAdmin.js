// scripts/seedAdmin.js
const mongoose = require('mongoose');
const User = require('./src/model/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@ceylontours.lk' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Administrator',
      email: 'admin@ceylontours.lk',
      password: 'admin123', // Change this in production!
      phone: '+94 11 234 5678',
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@ceylontours.lk');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();