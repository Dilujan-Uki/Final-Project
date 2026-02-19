// src/routes/userRoutes.js (NEW FILE)
const express = require('express');
const {
  getAllUsers,
  getUserById
} = require('../controller/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);

module.exports = router;