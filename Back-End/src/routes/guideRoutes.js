// src/routes/guideRoutes.js
const express = require('express');
const {
  getGuideAssignments,
  getAssignmentById,
  updateAssignmentStatus
} = require('../controller/guideController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and require guide role
router.get('/assignments', protect, getGuideAssignments);
router.get('/assignments/:id', protect, getAssignmentById);
router.patch('/assignments/:id/status', protect, updateAssignmentStatus);

module.exports = router;