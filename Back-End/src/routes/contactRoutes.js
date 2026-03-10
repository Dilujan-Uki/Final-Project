import express from 'express';
import { body } from 'express-validator';
import { submitContactForm, getAllContacts, updateContactStatus } from '../controller/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

router.post('/', contactValidation, submitContactForm);
router.get('/', protect, adminOnly, getAllContacts);
router.patch('/:id', protect, adminOnly, updateContactStatus);

export default router;
