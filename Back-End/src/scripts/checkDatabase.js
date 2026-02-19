// scripts/checkDatabase.js
const mongoose = require('mongoose');
const Tour = require('../src/model/Tour');
const User = require('../src/model/User');
const Booking = require('../src/model/Booking');
require('dotenv').config({ path: '../.env' });

const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check Tours
    const tours = await Tour.find();
    console.log(`📋 Tours in database: ${tours.length}`);
    if (tours.length > 0) {
      tours.forEach((tour, index) => {
        console.log(`   ${index + 1}. ${tour.name}`);
        console.log(`      ID: ${tour._id}`);
        console.log(`      Price: $${tour.price}`);
        console.log(`      Duration: ${tour.duration}`);
        console.log('      ---');
      });
    } else {
      console.log('   ⚠️ No tours found! You need to seed tours first.');
    }

    // Check Users
    const users = await User.find();
    console.log(`\n👥 Users in database: ${users.length}`);
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      Role: ${user.role}`);
        console.log(`      ID: ${user._id}`);
        console.log('      ---');
      });
    }

    // Check Bookings
    const bookings = await Booking.find()
      .populate('tour', 'name')
      .populate('user', 'name email');
    
    console.log(`\n📅 Bookings in database: ${bookings.length}`);
    if (bookings.length > 0) {
      bookings.forEach((booking, index) => {
        console.log(`   ${index + 1}. Tour: ${booking.tour?.name || 'Unknown'}`);
        console.log(`      User: ${booking.user?.name || 'Unknown'}`);
        console.log(`      Status: ${booking.status}`);
        console.log(`      Date: ${booking.bookingDate}`);
        console.log(`      Participants: ${booking.participants}`);
        console.log(`      Total: $${booking.totalPrice}`);
        console.log('      ---');
      });
    } else {
      console.log('   No bookings yet');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkDatabase();