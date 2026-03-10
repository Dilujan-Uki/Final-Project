import express from 'express';
import { getAllTours, getTourById, getToursByCategory, createTour } from '../controller/tourController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.get('/category/:category', getToursByCategory);
router.post('/', protect, adminOnly, createTour);

export default router;
