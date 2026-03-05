const express = require('express');
const { createBooking, getMyBookings, getBookingById, cancelBooking, confirmBooking } = require('../controller/newBookingController');
const { protect, checkNotSuspended } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, checkNotSuspended, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/confirm', protect, confirmBooking);

module.exports = router;
