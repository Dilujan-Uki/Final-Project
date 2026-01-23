// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const tourRoutes = require('./tourRoutes');
const contactRoutes = require('./contactRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/contact', contactRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;