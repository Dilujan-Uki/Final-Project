import express from 'express';
import { getGuideAssignments, getAssignmentById, updateAssignmentStatus, createAssignment, getPendingCompletions, adminConfirmCompletion } from '../controller/guideController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/assignments', protect, getGuideAssignments);
router.get('/assignments/pending-completions', protect, adminOnly, getPendingCompletions);
router.get('/assignments/:id', protect, getAssignmentById);
router.patch('/assignments/:id/status', protect, updateAssignmentStatus);
router.patch('/assignments/:id/confirm-completion', protect, adminOnly, adminConfirmCompletion);
router.post('/assignments', protect, adminOnly, createAssignment);

export default router;
