import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Tour from '../model/Tour.js';
import User from '../model/User.js';
import Booking from '../model/Booking.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    const tours = await Tour.find();
    console.log(`Tours in database: ${tours.length}`);
    tours.forEach((tour, i) => console.log(`  ${i + 1}. ${tour.name} (ID: ${tour._id})`));
    const users = await User.find();
    console.log(`\nUsers in database: ${users.length}`);
    users.forEach((user, i) => console.log(`  ${i + 1}. ${user.name} (${user.email}) - ${user.role}`));
    const bookings = await Booking.find();
    console.log(`\nBookings in database: ${bookings.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDatabase();
