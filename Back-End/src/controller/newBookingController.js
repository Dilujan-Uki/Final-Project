import Booking from '../model/Booking.js';
import Guide from '../model/Guide.js';
import Tour from '../model/Tour.js';
import User from '../model/User.js';
import GuideAssignment from '../model/GuideAssignment.js';
import GuideBookingRequest from '../model/GuideBookingRequest.js';

// Helper: check if a guide has a date-overlapping confirmed assignment or pending request
const guideHasOverlap = async (guideId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlap = await GuideAssignment.findOne({
    guideId,
    status: { $in: ['upcoming', 'ongoing'] },
    startDate: { $lt: end },
    endDate: { $gt: start }
  });
  return overlap;
};

// Also check pending requests (soft reservations)
const guideHasPendingOverlap = async (guideId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlap = await GuideBookingRequest.findOne({
    guideId,
    status: 'pending',
    startDate: { $lt: end },
    endDate: { $gt: start }
  });
  return overlap;
};

export const createBooking = async (req, res) => {
  try {
    const {
      tourId, tourName, guideName, guideId,
      participants, duration, totalPrice,
      extraServices, bookingDate, specialRequests
    } = req.body;

    const requiredFields = {
      tourId: 'Tour ID', tourName: 'Tour name',
      participants: 'Participants', duration: 'Duration',
      totalPrice: 'Total price', bookingDate: 'Booking date'
    };
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${label} is required` });
      }
    }

    // Past-date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(bookingDate);
    requestedDate.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past. Please select today or a future date.'
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });

    // Date-overlap availability check
    if (guideId) {
      const tourStart = new Date(bookingDate);
      const tourEnd = new Date(tourStart);
      tourEnd.setDate(tourEnd.getDate() + parseInt(duration));

      const overlap = await guideHasOverlap(guideId, tourStart, tourEnd);
      if (overlap) {
        const freeDate = new Date(overlap.endDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        return res.status(409).json({
          success: false,
          message: `This guide already has a confirmed tour during your selected dates and will be free from ${freeDate}. Please choose different dates or a different guide.`,
          availableFrom: overlap.endDate,
          conflictType: 'date_overlap'
        });
      }
    }

    const booking = new Booking({
      userId: req.userId,
      tourId,
      tourName,
      guideName: guideName || '',
      guideId: guideId || null,
      participants: parseInt(participants),
      duration: parseInt(duration),
      totalPrice: parseFloat(totalPrice),
      extraServices: {
        transport: extraServices?.transport || false,
        meals: extraServices?.meals || false
      },
      bookingDate: new Date(bookingDate),
      specialRequests: specialRequests || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    const saved = await booking.save();

    // Create a guide booking REQUEST (guide must accept/reject)
    if (guideId && guideName) {
      const guide = await Guide.findById(guideId);
      if (guide) {
        const tourStart = new Date(bookingDate);
        const tourEnd = new Date(tourStart);
        tourEnd.setDate(tourEnd.getDate() + parseInt(duration));

        const user = await User.findById(req.userId).select('name email phone');

        await GuideBookingRequest.create({
          guideId: guide._id,
          guideName: guide.name,
          bookingId: saved._id,
          tourId,
          tourName,
          customerName: user?.name || 'Customer',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '',
          participants: parseInt(participants),
          duration: parseInt(duration),
          startDate: tourStart,
          endDate: tourEnd,
          specialRequests: specialRequests || '',
          status: 'pending'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: guideId
        ? 'Booking created! A request has been sent to your selected tour guide. They will accept or decline it. You will be notified of their decision.'
        : 'Booking created successfully',
      data: {
        id: saved._id,
        tourName: saved.tourName,
        bookingDate: saved.bookingDate,
        status: saved.status,
        totalPrice: saved.totalPrice,
        guideName: saved.guideName,
        guideRequestPending: !!guideId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      bookings.map(async (b) => {
        const obj = b.toObject();
        if (b.guideId) {
          const guideReq = await GuideBookingRequest.findOne({ bookingId: b._id }).sort({ createdAt: -1 });
          obj.guideRequestStatus = guideReq?.status || null;
          obj.guideRejectionReason = guideReq?.rejectionReason || '';
        }
        return obj;
      })
    );

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.userId)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const obj = booking.toObject();
    if (booking.guideId) {
      const guideReq = await GuideBookingRequest.findOne({ bookingId: booking._id }).sort({ createdAt: -1 });
      obj.guideRequestStatus = guideReq?.status || null;
      obj.guideRejectionReason = guideReq?.rejectionReason || '';
    }
    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking', error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.userId.toString() !== req.userId)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    if (booking.status === 'completed')
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });

    let refundAmount = 0;
    let newPaymentStatus = 'pending';
    if (booking.paymentStatus === 'paid') {
      refundAmount = parseFloat(((booking.paidAmount || booking.totalPrice) * 0.5).toFixed(2));
      newPaymentStatus = 'partial_refund';
    }

    booking.status = 'cancelled';
    booking.paymentStatus = newPaymentStatus;
    booking.refundAmount = refundAmount;
    booking.cancelledAt = new Date();
    await booking.save();

    await GuideAssignment.updateMany(
      { bookingId: booking._id, status: { $in: ['upcoming', 'ongoing'] } },
      { status: 'cancelled' }
    );
    await GuideBookingRequest.updateMany(
      { bookingId: booking._id, status: 'pending' },
      { status: 'rejected', rejectionReason: 'Booking was cancelled by the customer', respondedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        ...booking.toObject(),
        refundAmount,
        refundMessage: refundAmount > 0
          ? `A 50% refund of $${refundAmount} will be processed to your original payment method within 5-7 business days.`
          : 'No refund applicable as payment was not completed.'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'name email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Past-date guard
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.bookingDate);
    bookingDate.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'The booking date has already passed. Please create a new booking with a valid future date.'
      });
    }

    if (booking.guideId) {
      const guideReq = await GuideBookingRequest.findOne({ bookingId: booking._id }).sort({ createdAt: -1 });

      if (guideReq && guideReq.status === 'rejected') {
        return res.status(409).json({
          success: false,
          message: `Your selected tour guide has declined this booking${guideReq.rejectionReason ? ': ' + guideReq.rejectionReason : ''}. Please go back and choose another guide.`,
          guideRejected: true
        });
      }

      // Date-overlap race-condition guard
      const tourStart = new Date(booking.bookingDate);
      const tourEnd = new Date(tourStart);
      tourEnd.setDate(tourEnd.getDate() + booking.duration);

      const overlap = await guideHasOverlap(booking.guideId, tourStart, tourEnd);
      if (overlap) {
        const freeDate = new Date(overlap.endDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        return res.status(409).json({
          success: false,
          message: `This guide is no longer available for the requested dates. They will be free from ${freeDate}. Please go back and choose another guide or different dates.`,
          availableFrom: overlap.endDate
        });
      }
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.paidAmount = booking.totalPrice;
    await booking.save();

    if (booking.guideName) {
      let guide = await Guide.findById(booking.guideId);
      if (!guide) guide = await Guide.findOne({ name: booking.guideName });

      if (guide) {
        const startDate = new Date(booking.bookingDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + booking.duration);

        await GuideAssignment.create({
          guideId: guide._id,
          guideName: guide.name,
          bookingId: booking._id,
          tourId: booking.tourId,
          tourName: booking.tourName,
          customerName: booking.userId.name,
          customerEmail: booking.userId.email,
          customerPhone: booking.userId.phone || '',
          participants: booking.participants,
          duration: booking.duration,
          startDate: booking.bookingDate,
          endDate,
          specialRequests: booking.specialRequests || '',
          meetingPoint: 'To be confirmed with customer',
          status: 'upcoming'
        });

        await GuideBookingRequest.updateMany(
          { bookingId: booking._id, status: 'pending' },
          { status: 'accepted', respondedAt: new Date() }
        );
      }
    }

    res.status(200).json({ success: true, message: 'Booking confirmed successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm booking', error: error.message });
  }
};

// Check guide availability for specific date range
export const checkGuideAvailabilityForDates = async (req, res) => {
  try {
    const { guideId, startDate, endDate } = req.query;
    if (!guideId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'guideId, startDate and endDate are required' });
    }
    const overlap = await guideHasOverlap(guideId, startDate, endDate);
    if (overlap) {
      return res.status(200).json({
        success: true,
        available: false,
        message: `Guide already has a tour from ${new Date(overlap.startDate).toLocaleDateString()} to ${new Date(overlap.endDate).toLocaleDateString()}.`,
        conflictStart: overlap.startDate,
        conflictEnd: overlap.endDate
      });
    }
    res.status(200).json({ success: true, available: true, message: 'Guide is available for the selected dates.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking availability', error: error.message });
  }
};
