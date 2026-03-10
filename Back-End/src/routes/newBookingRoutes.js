import express from 'express';
import { createBooking, getMyBookings, getBookingById, cancelBooking, confirmBooking } from '../controller/newBookingController.js';
import { protect, checkNotSuspended } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, checkNotSuspended, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/confirm', protect, confirmBooking);

export default router;
