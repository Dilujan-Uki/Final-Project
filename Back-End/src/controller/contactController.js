import Contact from '../model/Contact.js';
import { validationResult } from 'express-validator';

export const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ status: 'success', message: 'Thank you for your message. We will contact you soon.', data: { _id: contact._id, name: contact.name, email: contact.email, subject: contact.subject, createdAt: contact.createdAt } });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ status: 'error', message: 'Server error while submitting contact form' });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ status: 'error', message: 'Server error while fetching contacts' });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ status: 'error', message: 'Contact message not found' });
    res.status(200).json({ status: 'success', message: 'Contact status updated', data: contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ status: 'error', message: 'Server error while updating contact' });
  }
};
