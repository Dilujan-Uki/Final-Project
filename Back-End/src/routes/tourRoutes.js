// src/routes/tourRoutes.js
const express = require('express');
const {
  getAllTours,
  getTourById,
  getToursByCategory,
  createTour
} = require('../controller/tourController'); // Changed from ../controllers to ../controller
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllTours);
router.get('/:id', getTourById);
router.get('/category/:category', getToursByCategory);

// Protected/Admin routes
router.post('/', protect, adminOnly, createTour);

module.exports = router;