import express from 'express';
import { getAllGuides, getAllGuidesAdmin, getGuideById, getGuidesByCategory, updateGuideProfile, getMyGuideProfile, toggleSuspendGuide } from '../controller/guideProfileController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profiles', getAllGuides);
router.get('/profiles-admin', protect, adminOnly, getAllGuidesAdmin);
router.get('/profiles/category/:category', getGuidesByCategory);
router.get('/profiles/:id', getGuideById);
router.get('/profile/me', protect, getMyGuideProfile);
router.put('/profile', protect, updateGuideProfile);
router.patch('/profiles/:id/suspend', protect, adminOnly, toggleSuspendGuide);

export default router;
