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
const guideApplicationRoutes = require('./routes/guideApplicationRoutes'); 
const guideRoutes = require('./routes/guideRoutes');

// ============ USE ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/new-bookings', newBookingRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/tour-details', tourDetailRoutes);  
app.use('/api/guide-applications', guideApplicationRoutes); 
app.use('/api/guides', guideRoutes);

// ============ TEST ENDPOINTS ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

// TEMPORARY TEST ENDPOINT - Add this to server.js
app.get('/api/create-test-assignment', async (req, res) => {
  try {
    const GuideAssignment = require('./model/GuideAssignment');
    const User = require('./model/User');
    
    // Find the first guide
    const guide = await User.findOne({ role: 'guide' });
    
    if (!guide) {
      return res.json({ 
        success: false, 
        message: 'No guide found. Run seedGuides.js first.' 
      });
    }
    
    // Find the first tour
    const Tour = require('./model/Tour');
    const tour = await Tour.findOne();
    
    if (!tour) {
      return res.json({ 
        success: false, 
        message: 'No tour found. Run seedTours.js first.' 
      });
    }
    
    // Create a test assignment
    const assignment = await GuideAssignment.create({
      guideId: guide._id,
      guideName: guide.name,
      bookingId: new mongoose.Types.ObjectId(),
      tourId: tour._id,
      tourName: tour.name,
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+94 77 123 4567',
      participants: 2,
      duration: 3,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      meetingPoint: 'Colombo Airport',
      specialRequests: 'Vegetarian meals please',
      status: 'upcoming'
    });
    
    res.json({
      success: true,
      message: 'Test assignment created',
      assignment,
      guide: {
        id: guide._id,
        name: guide.name,
        email: guide.email
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Add this temporary endpoint to server.js
app.get('/api/check-database', async (req, res) => {
  try {
    const User = require('./model/User');
    const GuideAssignment = require('./model/GuideAssignment');
    const Tour = require('./model/Tour');
    
    const guides = await User.find({ role: 'guide' });
    const assignments = await GuideAssignment.find();
    const tours = await Tour.find();
    
    res.json({
      guides: guides.map(g => ({ id: g._id, name: g.name, email: g.email })),
      assignments: assignments,
      tours: tours.map(t => ({ id: t._id, name: t.name }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error(' Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});



// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}`);
});