const express = require('express');
const TourDetail = require('../model/TourDetail');
const Tour = require('../model/Tour');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

//  Get tour details by tour ID
//  GET /api/tour-details/:tourId
//  Public
router.get('/:tourId', async (req, res) => {
  try {
    const tourDetail = await TourDetail.findOne({ tourId: req.params.tourId })
      .populate('tourId', 'name duration price groupSize image features');
    
    if (!tourDetail) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour details not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: tourDetail
    });
  } catch (error) {
    console.error('Error fetching tour details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tour details'
    });
  }
});

//  Create or update tour details (Admin only)
//  POST /api/tour-details
//  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { tourId } = req.body;

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found'
      });
    }

    // Check if details already exist
    const existingDetails = await TourDetail.findOne({ tourId });
    if (existingDetails) {
      // Update existing
      const updated = await TourDetail.findByIdAndUpdate(
        existingDetails._id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        status: 'success',
        message: 'Tour details updated successfully',
        data: updated
      });
    }

    // Create new
    const tourDetail = await TourDetail.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Tour details created successfully',
      data: tourDetail
    });
  } catch (error) {
    console.error('Error creating tour details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating tour details'
    });
  }
});

//  Update tour details (Admin only)
//  PUT /api/tour-details/:id
//  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tourDetail = await TourDetail.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!tourDetail) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour details not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Tour details updated successfully',
      data: tourDetail
    });
  } catch (error) {
    console.error('Error updating tour details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating tour details'
    });
  }
});

//  Delete tour details (Admin only)
//  DELETE /api/tour-details/:id
//  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tourDetail = await TourDetail.findByIdAndDelete(req.params.id);

    if (!tourDetail) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour details not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Tour details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting tour details'
    });
  }
});

module.exports = router;