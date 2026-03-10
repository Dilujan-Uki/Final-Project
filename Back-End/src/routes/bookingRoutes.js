import express from 'express';
import Booking from '../model/Booking.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email phone')
      .populate('tourId', 'name price duration')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch bookings' });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ status: 'error', message: 'Invalid status value' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking not found' });
    res.status(200).json({ status: 'success', message: `Booking status updated to ${status}`, data: booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update booking status' });
  }
});

export default router;
