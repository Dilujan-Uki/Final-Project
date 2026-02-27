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

// src/controller/reviewController.js (UPDATED)

// @desc    Update review approval status (Admin only)
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    // Validate input
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'isApproved must be a boolean value'
      });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Update the review
    review.isApproved = isApproved;
    await review.save();

    // Populate user data for response
    await review.populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error while updating review'
    });
  }
};
// @desc    Delete review (User can delete their own, admin gets notification)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'name email');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user._id.toString() !== req.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this review'
      });
    }

    // Store review data for response
    const deletedReview = {
      id: review._id,
      userName: review.user.name,
      tour: review.tour,
      rating: review.rating
    };

    await review.deleteOne();

    // Log for admin (in real app, you'd save this to a deletion log)
    console.log(`🗑️ REVIEW DELETED - User: ${deletedReview.userName} deleted review for ${deletedReview.tour} (Rating: ${deletedReview.rating})`);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully',
      data: {
        deletedReview,
        notification: `Admin notification: User ${deletedReview.userName} deleted their review`
      }
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting review'
    });
  }
};

// @desc    Get all reviews with user details (Admin only)
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviewsAdmin = async (req, res) => {
  try {
    const { limit } = req.query;
    
    let query = Review.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    // Apply limit if provided (for random/recent reviews)
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const reviews = await query;

    // Calculate statistics
    const stats = {
      totalReviews: reviews.length,
      approvedReviews: reviews.filter(r => r.isApproved).length,
      pendingReviews: reviews.filter(r => !r.isApproved).length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0
    };

    res.status(200).json({
      status: 'success',
      count: reviews.length,
      stats,
      data: reviews
    });
  } catch (error) {
    console.error('Get all reviews admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching reviews'
    });
  }
};
module.exports = {
  submitReview,
  getAllReviews,
  getMyReviews,
  updateReviewApproval,
  deleteReview,
  getAllReviewsAdmin
};