import mongoose from 'mongoose';

const guideBookingRequestSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide',
    required: true
  },
  guideName: { type: String, required: true },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  tourName: { type: String, required: true },

  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },

  participants: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  specialRequests: { type: String, default: '' },

  // 'pending' = waiting for guide response
  // 'accepted' = guide accepted (booking proceeds to payment)
  // 'rejected' = guide rejected (user must pick another guide)
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },

  rejectionReason: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
});

const GuideBookingRequest = mongoose.model('GuideBookingRequest', guideBookingRequestSchema);
export default GuideBookingRequest;
