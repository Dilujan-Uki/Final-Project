import mongoose from 'mongoose';

const guideDetailSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide',
    required: true,
    unique: true
  },

  // Extended bio / about section
  fullBio: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  // Title shown on profile
  title: {
    type: String,
    required: true
  },

  // Tour places the guide specialises in
  tourSpecialties: [{ type: String }],

  // Certifications
  certifications: [{ type: String }],

  // Recent reviews shown on detail page
  reviews: [
    {
      name: String,
      date: String,
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      tour: String
    }
  ],

  // Contact
  contactInfo: {
    email: String,
    phone: String
  },

  // Availability text
  availability: {
    type: String,
    default: 'Available for bookings 7 days a week'
  },
  responseTime: {
    type: String,
    default: 'Usually responds within 1 hour'
  },

  // Fun / highlight stats shown in hero
  highlights: [
    {
      icon: String,
      label: String,
      value: String
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

guideDetailSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const GuideDetail = mongoose.model('GuideDetail', guideDetailSchema);
export default GuideDetail;