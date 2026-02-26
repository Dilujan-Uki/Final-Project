const mongoose = require('mongoose');

const tourDetailSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
    unique: true
  },
  
  // Overview Section
  overview: {
    type: String,
    required: true
  },
  highlights: [{
    type: String,
    required: true
  }],
  
  // Detailed Itinerary
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String,
    image: String
  }],
  
  // Inclusions & Exclusions
  inclusions: [{
    category: String,
    items: [String]
  }],
  exclusions: [{
    category: String,
    items: [String]
  }],
  
  // Practical Information
  practicalInfo: {
    bestTimeToVisit: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging']
    },
    groupSize: String,
    minimumAge: Number,
    pickupInfo: String,
    whatToBring: [String]
  },
  
  // Gallery
  gallery: [{
    url: String,
    caption: String
  }],
  
  // FAQ
  faqs: [{
    question: String,
    answer: String
  }],
  
  // Map Coordinates
  mapCoordinates: {
    lat: Number,
    lng: Number
  },
  
  // Reviews Summary
  reviewsSummary: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    ratingBreakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
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
tourDetailSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const TourDetail = mongoose.model('TourDetail', tourDetailSchema);
module.exports = TourDetail;