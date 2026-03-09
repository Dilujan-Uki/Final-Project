const express = require('express');
const {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById
} = require('../controller/guideApplicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route
router.post('/', submitApplication);

// Admin routes
router.get('/', protect, adminOnly, getAllApplications);
router.get('/:id', protect, adminOnly, getApplicationById);
router.patch('/:id', protect, adminOnly, updateApplicationStatus);

module.exports = router;