const express = require('express');
const { getAllGuides, getAllGuidesAdmin, getGuideById, getGuidesByCategory, updateGuideProfile, getMyGuideProfile, toggleSuspendGuide } = require('../controller/guideProfileController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profiles', getAllGuides);
router.get('/profiles-admin', protect, adminOnly, getAllGuidesAdmin);
router.get('/profiles/category/:category', getGuidesByCategory);
router.get('/profiles/:id', getGuideById);
router.get('/profile/me', protect, getMyGuideProfile);
router.put('/profile', protect, updateGuideProfile);
router.patch('/profiles/:id/suspend', protect, adminOnly, toggleSuspendGuide);

module.exports = router;
