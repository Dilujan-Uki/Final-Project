import express from 'express';
import { getAllUsers, getUserById, updateUserProfile, toggleSuspendUser } from '../controller/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.patch('/:id/suspend', protect, adminOnly, toggleSuspendUser);

export default router;
