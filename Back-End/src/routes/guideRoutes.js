const express = require('express');
const { getGuideAssignments, getAssignmentById, updateAssignmentStatus, createAssignment, getPendingCompletions, adminConfirmCompletion } = require('../controller/guideController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/assignments', protect, getGuideAssignments);
router.get('/assignments/pending-completions', protect, adminOnly, getPendingCompletions);
router.get('/assignments/:id', protect, getAssignmentById);
router.patch('/assignments/:id/status', protect, updateAssignmentStatus);
router.patch('/assignments/:id/confirm-completion', protect, adminOnly, adminConfirmCompletion);
router.post('/assignments', protect, adminOnly, createAssignment);

module.exports = router;
