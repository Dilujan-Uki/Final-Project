
// src/models/Tour.js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  groupSize: {
    type: String,
    required: [true, 'Group size is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'
  },
  category: {
    type: String,
    enum: ['cultural', 'adventure', 'beach', 'wildlife', 'hill', 'food'],
    default: 'cultural'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
