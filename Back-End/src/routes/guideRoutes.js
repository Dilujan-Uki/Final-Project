// src/routes/guideRoutes.js - COMPLETE REPLACE
const express = require('express');
const {
  getGuideAssignments,
  getAssignmentById,
  updateAssignmentStatus,
  createAssignment
} = require('../controller/guideController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.get('/assignments', protect, getGuideAssignments);
router.get('/assignments/:id', protect, getAssignmentById);
router.patch('/assignments/:id/status', protect, updateAssignmentStatus);

// Admin only route to create assignments
router.post('/assignments', protect, adminOnly, createAssignment);

module.exports = router;