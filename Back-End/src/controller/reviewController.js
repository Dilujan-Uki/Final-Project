// src/controller/reviewController.js
const Review = require('../model/Review');
const { validationResult } = require('express-validator');

// @desc    Submit review
// @route   POST /api/reviews
// @access  Private
const submitReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { tour, guide, rating, title, comment } = req.body;

    // Check if user already reviewed this tour
    const existingReview = await Review.findOne({
      user: req.userId,
      tour
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this tour'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.userId,
      tour,
      guide,
      rating,
      title,
      comment,
      isApproved: false // Admin needs to approve
    });

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully. It will be published after moderation.',
      data: review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting review'
    });
  }
};

// @desc    Get all reviews (with optional filtering)
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const { tour, approved } = req.query;
    
    let filter = {};
    
    if (tour) filter.tour = tour;
    if (approved !== undefined) {
      filter.isApproved = approved === 'true';
    } else {
      // Default to showing only approved reviews for public
      filter.isApproved = true;
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      status: 'success',
      count: reviews.length,
      averageRating: averageRating.toFixed(1),
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Update review approval status (Admin only)
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Review ${isApproved ? 'approved' : 'rejected'}`,
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating review'
    });
  }
};

// @desc    Delete review (Admin or owner)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting review'
    });
  }
};

module.exports = {
  submitReview,
  getAllReviews,
  getMyReviews,
  updateReviewApproval,
  deleteReview
};