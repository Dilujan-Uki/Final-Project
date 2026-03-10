import Review from '../model/Review.js';
import { validationResult } from 'express-validator';

export const submitReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    const { tour, guide, rating, title, comment } = req.body;
    const existingReview = await Review.findOne({ user: req.userId, tour });
    if (existingReview) return res.status(400).json({ status: 'error', message: 'You have already reviewed this tour' });
    const review = await Review.create({ user: req.userId, tour, guide, rating, title, comment, isApproved: false });
    res.status(201).json({ status: 'success', message: 'Review submitted successfully. It will be published after moderation.', data: review });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while submitting review' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { tour, approved } = req.query;
    let filter = {};
    if (tour) filter.tour = tour;
    if (approved !== undefined) filter.isApproved = approved === 'true';
    const reviews = await Review.find(filter).populate('user', 'name').sort({ createdAt: -1 });
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    res.status(200).json({ status: 'success', count: reviews.length, averageRating: averageRating.toFixed(1), data: reviews });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching reviews' });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching reviews' });
  }
};

export const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    if (typeof isApproved !== 'boolean') return res.status(400).json({ status: 'error', message: 'isApproved must be a boolean value' });
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
    review.isApproved = isApproved;
    await review.save();
    await review.populate('user', 'name email');
    res.status(200).json({ status: 'success', message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`, data: review });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message || 'Server error while updating review' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'name email');
    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
    if (review.user._id.toString() !== req.userId) return res.status(403).json({ status: 'error', message: 'Not authorized to delete this review' });
    const deletedReview = { id: review._id, userName: review.user.name, tour: review.tour, rating: review.rating };
    await review.deleteOne();
    res.status(200).json({ status: 'success', message: 'Review deleted successfully', data: { deletedReview, notification: `Admin notification: User ${deletedReview.userName} deleted their review` } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while deleting review' });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { limit } = req.query;
    let query = Review.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit));
    const reviews = await query;
    const stats = {
      totalReviews: reviews.length,
      approvedReviews: reviews.filter(r => r.isApproved).length,
      pendingReviews: reviews.filter(r => !r.isApproved).length,
      averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
    };
    res.status(200).json({ status: 'success', count: reviews.length, stats, data: reviews });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching reviews' });
  }
};
