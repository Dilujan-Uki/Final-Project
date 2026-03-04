// src/routes/userRoutes.js - Add this route
const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserProfile
} = require('../controller/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// User routes (protected)
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);

module.exports = router;