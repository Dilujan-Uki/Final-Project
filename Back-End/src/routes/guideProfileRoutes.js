// src/routes/guideProfileRoutes.js - NEW FILE
const express = require('express');
const {
  getAllGuides,
  getGuideById,
  getGuidesByCategory,
  updateGuideProfile,
  getMyGuideProfile
} = require('../controller/guideProfileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/profiles', getAllGuides);
router.get('/profiles/category/:category', getGuidesByCategory);
router.get('/profiles/:id', getGuideById);

// Protected routes (guides only)
router.get('/profile/me', protect, getMyGuideProfile);
router.put('/profile', protect, updateGuideProfile);

module.exports = router;