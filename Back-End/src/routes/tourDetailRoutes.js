import express from 'express';
import TourDetail from '../model/TourDetail.js';
import Tour from '../model/Tour.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:tourId', async (req, res) => {
  try {
    const tourDetail = await TourDetail.findOne({ tourId: req.params.tourId }).populate('tourId', 'name duration price groupSize image features');
    if (!tourDetail) return res.status(404).json({ status: 'error', message: 'Tour details not found' });
    res.status(200).json({ status: 'success', data: tourDetail });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching tour details' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { tourId } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ status: 'error', message: 'Tour not found' });
    const existingDetails = await TourDetail.findOne({ tourId });
    if (existingDetails) {
      const updated = await TourDetail.findByIdAndUpdate(existingDetails._id, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
      return res.status(200).json({ status: 'success', message: 'Tour details updated successfully', data: updated });
    }
    const tourDetail = await TourDetail.create(req.body);
    res.status(201).json({ status: 'success', message: 'Tour details created successfully', data: tourDetail });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while creating tour details' });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tourDetail = await TourDetail.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!tourDetail) return res.status(404).json({ status: 'error', message: 'Tour details not found' });
    res.status(200).json({ status: 'success', message: 'Tour details updated successfully', data: tourDetail });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating tour details' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tourDetail = await TourDetail.findByIdAndDelete(req.params.id);
    if (!tourDetail) return res.status(404).json({ status: 'error', message: 'Tour details not found' });
    res.status(200).json({ status: 'success', message: 'Tour details deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while deleting tour details' });
  }
});

export default router;
