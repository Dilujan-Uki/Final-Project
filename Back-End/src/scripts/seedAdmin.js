const path = require('path');
const mongoose = require('mongoose');
const User = require('../model/User'); // Changed from '../src/model/User' to '../model/User'
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const createAdmin = async () => {
  try {
    console.log('🔍 Current directory:', __dirname);
    console.log('📁 Loading .env from:', path.join(__dirname, '..', '..', '.env'));
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'dilujan2005@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Administrator',
      email: 'dilujan2005@gmail.com',
      password: 'Dilujan@2005',
      phone: '+94 759427364',
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: dilujan2005@gmail.com');
    console.log('🔑 Password: Dilujan@2005');
    console.log('⚠️  IMPORTANT: Change this password in production!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();