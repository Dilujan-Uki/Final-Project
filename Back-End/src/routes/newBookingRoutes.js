// src/routes/newBookingRoutes.js -
const express = require('express');
const User = require('../model/User');
const GuideAssignment = require('../model/GuideAssignment');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  confirmBooking  // ADD THIS
} = require('../controller/newBookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/confirm', protect, confirmBooking);  // ADD THIS

module.exports = router;