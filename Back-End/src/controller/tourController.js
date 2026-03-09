const Tour = require('../model/Tour');

//  Get all tours
//  GET /api/tours
//  Public
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      count: tours.length,
      data: tours
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tours'
    });
  }
};

//  Get single tour
//  GET /api/tours/:id
//  Public
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    
    if (!tour || !tour.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tour'
    });
  }
};

//  Get tours by category
//  GET /api/tours/category/:category
//  Public
const getToursByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const tours = await Tour.find({ 
      category, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: tours.length,
      data: tours
    });
  } catch (error) {
    console.error('Get tours by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tours'
    });
  }
};

// Create tour (Admin only)
// POST /api/tours
// Private/Admin
const createTour = async (req, res) => {
  try {
    // Double-check admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin only.'
      });
    }

    const tour = await Tour.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating tour'
    });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  getToursByCategory,
  createTour
};