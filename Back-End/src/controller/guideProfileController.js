// src/controller/guideProfileController.js - NEW FILE
const Guide = require('../model/Guide');
const User = require('../model/User');

// @desc    Get all guides (public)
// @route   GET /api/guides/profiles
// @access  Public
const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ isActive: true })
      .select('-password -__v')
      .sort({ rating: -1 });

    res.status(200).json({
      status: 'success',
      count: guides.length,
      data: guides
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching guides'
    });
  }
};

// @desc    Get guide by ID
// @route   GET /api/guides/profiles/:id
// @access  Public
const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .select('-password -__v');

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: guide
    });
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching guide'
    });
  }
};

// @desc    Get guides by category
// @route   GET /api/guides/profiles/category/:category
// @access  Public
const getGuidesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    let filter = { isActive: true };
    if (category !== 'all') {
      filter.category = category;
    }

    const guides = await Guide.find(filter)
      .select('-password -__v')
      .sort({ rating: -1 });

    res.status(200).json({
      status: 'success',
      count: guides.length,
      data: guides
    });
  } catch (error) {
    console.error('Error fetching guides by category:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching guides'
    });
  }
};

// @desc    Update guide profile (guide only)
// @route   PUT /api/guides/profiles
// @access  Private (Guide only)
const updateGuideProfile = async (req, res) => {
  try {
    // Find guide by userId
    const guide = await Guide.findOne({ userId: req.userId });

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide profile not found'
      });
    }

    // Fields that guides can update
    const updatableFields = [
      'phone', 'bio', 'languages', 'specialties', 
      'hourlyRate', 'dailyRate', 'availability', 
      'responseTime', 'profileImage'
    ];

    // Update only allowed fields
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        guide[field] = req.body[field];
      }
    });

    guide.updatedAt = Date.now();
    await guide.save();

    // Also update user phone if provided
    if (req.body.phone) {
      await User.findByIdAndUpdate(req.userId, { phone: req.body.phone });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: guide
    });
  } catch (error) {
    console.error('Error updating guide profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Get guide profile for logged in guide
// @route   GET /api/guides/profiles/me
// @access  Private (Guide only)
const getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId })
      .select('-password');

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: guide
    });
  } catch (error) {
    console.error('Error fetching guide profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
};

module.exports = {
  getAllGuides,
  getGuideById,
  getGuidesByCategory,
  updateGuideProfile,
  getMyGuideProfile
};