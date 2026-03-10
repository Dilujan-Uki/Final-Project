import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  tourName: {
    type: String,
    required: true
  },
  guideName: {
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
  paidAmount: {
    type: Number,
    default: 0
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  extraServices: {
    transport: {
      type: Boolean,
      default: false
    },
    meals: {
      type: Boolean,
      default: false
    }
  },
  bookingDate: {
    type: Date,
    required: true
  },
  specialRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  cancelledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
