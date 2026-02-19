// src/routes/newBookingRoutes.js
const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require('../controller/newBookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;