import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../model/User.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env file');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    const existingAdmin = await User.findOne({ email: 'dilujan2005@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    const admin = new User({ name: 'Administrator', email: 'dilujan2005@gmail.com', password: 'Dilujan@2005', phone: '+94 759427364', role: 'admin' });
    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
