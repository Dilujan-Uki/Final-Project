// src/server.js - COMPLETE FIXED VERSION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============ DATABASE CONNECTION ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ceylon-tours';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('\n✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('📍 Host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ============ IMPORT MODELS ============
require('./model/User');
require('./model/Tour');
require('./model/Booking');
require('./model/Review');
require('./model/Contact');

// ============ IMPORT ROUTES ============
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const newBookingRoutes = require('./routes/newBookingRoutes');

// ============ USE ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/new-bookings', newBookingRoutes);

// ============ TEST ENDPOINTS ============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Ceylon Tours API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint to check bookings
app.get('/api/test/all-bookings', async (req, res) => {
  try {
    const Booking = require('./model/Booking');
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint to create a test booking
app.post('/api/test/create-test-booking', async (req, res) => {
  try {
    const Booking = require('./model/Booking');
    const User = require('./model/User');
    const Tour = require('./model/Tour');

    // Get first user
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }

    // Get first tour
    const tour = await Tour.findOne();
    if (!tour) {
      return res.status(404).json({ success: false, message: 'No tours found' });
    }

    const testBooking = new Booking({
      userId: user._id,
      tourId: tour._id,
      tourName: tour.name,
      guideName: 'Test Guide',
      participants: 2,
      duration: 3,
      totalPrice: 480,
      extraServices: { transport: false, meals: false },
      bookingDate: new Date(),
      specialRequests: 'Test booking',
      status: 'pending',
      paymentStatus: 'pending'
    });

    const saved = await testBooking.save();
    
    res.status(201).json({
      success: true,
      message: 'Test booking created',
      data: saved
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ 404 HANDLER - FIXED FOR EXPRESS v5 ============
// Use a regular expression to match all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 New Bookings API: http://localhost:${PORT}/api/new-bookings`);
  console.log(`📍 Test all bookings: http://localhost:${PORT}/api/test/all-bookings`);
});