import express from 'express';
import { submitApplication, getAllApplications, updateApplicationStatus, getApplicationById } from '../controller/guideApplicationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitApplication);
router.get('/', protect, adminOnly, getAllApplications);
router.get('/:id', protect, adminOnly, getApplicationById);
router.patch('/:id', protect, adminOnly, updateApplicationStatus);

export default router;
