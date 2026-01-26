// scripts/seedAdmin.js
const mongoose = require('mongoose');
const User = require('../model/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'dilujan2005@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Administrator',
      email: 'dilujan2005@gmail.com',
      password: 'Dilujan@2005', // Change this in production!
      phone: '+94 759427364',
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: dilujan2005@gmail.com');
    console.log('🔑 Password: Dilujan@2005');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();