// src/model/Guide.js - UPDATED (certifications as array)
const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Guide name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  
  // Profile Details
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  
  // Professional Details
  languages: [{
    type: String
  }],
  specialties: [{
    type: String
  }],
  certifications: [{
    type: String  // Changed from String to [String] (array of strings)
  }],
  
  // Tour Specialties
  tourSpecialties: [{
    type: String
  }],
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Rates
  hourlyRate: {
    type: Number,
    default: 20
  },
  dailyRate: {
    type: Number,
    default: 70
  },
  
  // Availability
  availability: {
    type: String,
    default: 'Available for bookings 7 days a week'
  },
  responseTime: {
    type: String,
    default: 'Usually responds within 1 hour'
  },
  
  // Contact Info (for public display)
  contactInfo: {
    email: String,
    phone: String
  },
  
  // Category for filtering
  category: {
    type: String,
    enum: ['cultural', 'wildlife', 'adventure', 'beach', 'photography', 'all'],
    default: 'cultural'
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Reference to user account (if created from application)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
guideSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Guide = mongoose.model('Guide', guideSchema);
module.exports = Guide;