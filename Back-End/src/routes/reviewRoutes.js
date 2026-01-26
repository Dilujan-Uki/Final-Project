// src/routes/reviewRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  submitReview,
  getAllReviews,
  getMyReviews,
  updateReviewApproval,
  deleteReview
} = require('../controller/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('tour').notEmpty().withMessage('Tour is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().withMessage('Title is required'),
  body('comment').notEmpty().withMessage('Comment is required')
];

// Public routes
router.get('/', getAllReviews);

// Protected routes
router.post('/', protect, reviewValidation, submitReview);
router.get('/my-reviews', protect, getMyReviews);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.patch('/:id/approve', protect, adminOnly, updateReviewApproval);

module.exports = router;