import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const guideSchema = new mongoose.Schema({
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
  languages: [{ type: String }],

  specialties: [{ type: String }],

  certifications: [{ type: String }],

  tourSpecialties: [{ type: String }],

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
  dailyRate: {
    type: Number,
    default: 70
  },
  availability: {
    type: String,
    default: 'Available for bookings 7 days a week'
  },
  responseTime: {
    type: String,
    default: 'Usually responds within 1 hour'
  },
  contactInfo: {
    email: String,
    phone: String
  },
  category: {
    type: String,
    enum: ['cultural', 'wildlife', 'adventure', 'beach', 'photography', 'all'],
    default: 'cultural'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspendedReason: {
    type: String,
    default: ''
  },
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

guideSchema.pre('save', async function (next) {
  this.updatedAt = Date.now();
  // Hash password if it has been modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

guideSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Guide = mongoose.model('Guide', guideSchema);
export default Guide;
