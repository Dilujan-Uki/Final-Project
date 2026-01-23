// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Debug: Show actual structure
console.log('=== ACTUAL FOLDER STRUCTURE ===');
console.log('Current directory (src/):', __dirname);

console.log('\nChecking controller folder:');
const controllerPath = path.join(__dirname, 'controller');
console.log('Controller path:', controllerPath);
console.log('Exists:', fs.existsSync(controllerPath));
if (fs.existsSync(controllerPath)) {
  console.log('Files in controller/:');
  fs.readdirSync(controllerPath).forEach(file => {
    console.log('  -', file);
  });
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ceylon-tours')
  .then(() => console.log('\n✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

console.log('\n=== LOADING ROUTES ===');

// Load routes with error handling
try {
  console.log('Loading authRoutes...');
  const authRoutes = require('./routes/authRoutes');
  console.log('✅ authRoutes loaded');
  
  console.log('Loading tourRoutes...');
  const tourRoutes = require('./routes/tourRoutes');
  console.log('✅ tourRoutes loaded');
  
  console.log('Loading contactRoutes...');
  const contactRoutes = require('./routes/contactRoutes');
  console.log('✅ contactRoutes loaded');

  console.log('Loading bookingRoutes...');
  const bookingRoutes = require('./routes/bookingRoutes');
  console.log('✅ bookingRoutes loaded');
  
  console.log('Loading reviewRoutes...');
  const reviewRoutes = require('./routes/reviewRoutes');
  console.log('✅ reviewRoutes loaded');

  
  // Use routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tours', tourRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/reviews', reviewRoutes);

  
  console.log('✅ All routes mounted successfully');
  
} catch (error) {
  console.error('\n❌ Error loading routes:', error.message);
  console.error('Error stack:', error.stack);
  console.log('\nMake sure:');
  console.log('1. Controller files are in src/controller/ (not src/controllers/)');
  console.log('2. Import paths in route files use "../controller/" not "../controllers/"');
  process.exit(1);
}

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Ceylon Tours API is running' 
  });
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
try {
  const errorHandler = require('./middleware/errorMiddleware');
  app.use(errorHandler);
  console.log('✅ Error middleware loaded');
} catch (error) {
  console.error('❌ Error loading error middleware:', error.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🗺️ Tour endpoints: http://localhost:${PORT}/api/tours`);
  console.log(`📞 Contact endpoints: http://localhost:${PORT}/api/contact`);
  console.log(`📊 Booking endpoints: http://localhost:${PORT}/api/bookings`);
  console.log(`⭐ Review endpoints: http://localhost:${PORT}/api/reviews`);
});