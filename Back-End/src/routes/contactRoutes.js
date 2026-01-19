// src/routes/contactRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  submitContactForm,
  getAllContacts,
  updateContactStatus
} = require('../controller/contactController'); // Changed from ../controllers to ../controller
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Public route
router.post('/', contactValidation, submitContactForm);

// Protected/Admin routes
router.get('/', protect, adminOnly, getAllContacts);
router.patch('/:id', protect, adminOnly, updateContactStatus);

module.exports = router;