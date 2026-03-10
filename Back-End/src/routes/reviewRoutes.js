import express from 'express';
import { body } from 'express-validator';
import { submitReview, getAllReviews, getMyReviews, updateReviewApproval, deleteReview, getAllReviewsAdmin } from '../controller/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const reviewValidation = [
  body('tour').notEmpty().withMessage('Tour is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().withMessage('Title is required'),
  body('comment').notEmpty().withMessage('Comment is required')
];

router.get('/', getAllReviews);
router.post('/', protect, reviewValidation, submitReview);
router.get('/my-reviews', protect, getMyReviews);
router.delete('/:id', protect, deleteReview);
router.get('/all', protect, adminOnly, getAllReviewsAdmin);
router.patch('/:id/approve', protect, adminOnly, updateReviewApproval);

export default router;
