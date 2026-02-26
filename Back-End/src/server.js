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

// ============ DATABASE CONNECTION ============
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

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
const bookingRoutes = require('./routes/bookingRoutes');  
const tourDetailRoutes = require('./routes/tourDetailRoutes'); 

// ============ USE ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/new-bookings', newBookingRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/tour-details', tourDetailRoutes);  

// ============ TEST ENDPOINTS ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});