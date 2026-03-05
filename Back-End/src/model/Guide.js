const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Guide name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  experience: { type: String, default: '' },
  languages: [{ type: String }],
  specialties: [{ type: String }],
  certifications: [{ type: String }],
  tourSpecialties: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  dailyRate: { type: Number, default: 70 },
  availability: { type: String, default: 'Available for bookings 7 days a week' },
  responseTime: { type: String, default: 'Usually responds within 1 hour' },
  contactInfo: { email: String, phone: String },
  category: { type: String, enum: ['cultural', 'wildlife', 'adventure', 'beach', 'photography', 'all'], default: 'cultural' },
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspendedReason: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

guideSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Guide = mongoose.model('Guide', guideSchema);
module.exports = Guide;
