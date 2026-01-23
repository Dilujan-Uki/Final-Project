// src/model/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  guide: {
    type: String,
    default: ''
  },
  participants: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  extraServices: {
    transport: { type: Boolean, default: false },
    meals: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    required: true
  },
  specialRequests: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;