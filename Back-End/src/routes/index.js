// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const tourRoutes = require('./tourRoutes');
const contactRoutes = require('./contactRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/contact', contactRoutes);

module.exports = router;