
import mongoose from 'mongoose';

const guideApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 18,
    max: 70
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  certifications: {
    type: String,
    required: [true, 'Certification details are required']
  },
  languages: [{
    type: String
  }],
  specialties: [{
    type: String
  }],
  availableFrom: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
guideApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const GuideApplication = mongoose.model('GuideApplication', guideApplicationSchema);
export default GuideApplication;