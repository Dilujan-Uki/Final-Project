// src/routes/bookingRoutes.js
const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getBookingById
} = require('../controller/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);

// Admin routes
router.get('/', protect, adminOnly, getAllBookings);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;