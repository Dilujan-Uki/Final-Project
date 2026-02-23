const path = require('path');
const mongoose = require('mongoose');
const Booking = require('../model/Booking'); // Changed from '../src/model/Booking' to '../model/Booking'
const User = require('../model/User');
const Tour = require('../model/Tour');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const testBooking = async () => {
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

    // Check if we have users
    const users = await User.find();
    console.log(`👥 Users found: ${users.length}`);
    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      console.log('👉 Run: npm run seed:admin');
      process.exit(1);
    }
    users.forEach((user, i) => {
      console.log(`   ${i+1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check if we have tours
    const tours = await Tour.find();
    console.log(`\n🎫 Tours found: ${tours.length}`);
    if (tours.length === 0) {
      console.log('❌ No tours found. Please seed tours first.');
      console.log('👉 Run: npm run seed:tours');
      process.exit(1);
    }
    tours.forEach((tour, i) => {
      console.log(`   ${i+1}. ${tour.name} - $${tour.price}`);
    });

    // Test creating a booking
    console.log('\n📝 Testing booking creation...');
    
    const testBookingData = {
      userId: users[0]._id,
      tourId: tours[0]._id,
      tourName: tours[0].name,
      guideName: 'Test Guide',
      participants: 2,
      duration: 3,
      totalPrice: 480,
      extraServices: {
        transport: true,
        meals: false
      },
      bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      specialRequests: 'This is a test booking',
      status: 'pending',
      paymentStatus: 'pending'
    };

    console.log('Booking data:', JSON.stringify(testBookingData, null, 2));

    const booking = new Booking(testBookingData);
    const saved = await booking.save();

    console.log('\n✅ Booking created successfully!');
    console.log('Booking ID:', saved._id);
    console.log('Tour:', saved.tourName);
    console.log('Date:', saved.bookingDate);
    console.log('Status:', saved.status);

    // Verify we can find it
    const found = await Booking.findById(saved._id);
    console.log('\n✅ Booking verified in database');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
};

testBooking();