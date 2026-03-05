const express = require('express');
const { getAllUsers, getUserById, updateUserProfile, toggleSuspendUser } = require('../controller/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.patch('/:id/suspend', protect, adminOnly, toggleSuspendUser);

module.exports = router;
