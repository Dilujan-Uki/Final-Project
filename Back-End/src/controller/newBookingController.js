import Booking from '../model/Booking.js';
import Guide from '../model/Guide.js';
import Tour from '../model/Tour.js';
import User from '../model/User.js';
import GuideAssignment from '../model/GuideAssignment.js';

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
      if (!req.body[field]) return res.status(400).json({ success: false, message: `${label} is required` });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });

    // If a guide was selected, validate they are still available
    if (guideId) {
      const activeAssignment = await GuideAssignment.findOne({
        guideId,
        status: { $in: ['upcoming', 'ongoing'] }
      });
      if (activeAssignment) {
        const freeDate = new Date(activeAssignment.endDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        return res.status(409).json({
          success: false,
          message: `This guide is currently on another tour and will be available from ${freeDate}. Please choose a different guide or try again later.`,
          availableFrom: activeAssignment.endDate
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
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: saved._id,
        tourName: saved.tourName,
        bookingDate: saved.bookingDate,
        status: saved.status,
        totalPrice: saved.totalPrice,
        guideName: saved.guideName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
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
    res.status(200).json({ success: true, data: booking });
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

    // If the booking had a guide assignment, cancel it so the guide becomes available again
    if (booking.guideId || booking.guideName) {
      const query = booking.guideId
        ? { bookingId: booking._id }
        : { bookingId: booking._id };
      await GuideAssignment.updateMany(
        { bookingId: booking._id, status: { $in: ['upcoming', 'ongoing'] } },
        { status: 'cancelled' }
      );
    }

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

    // Double-check guide availability at confirmation time too
    if (booking.guideName) {
      let guide = await Guide.findOne({ name: booking.guideName });
      if (!guide && booking.guideId) guide = await Guide.findById(booking.guideId);

      if (guide) {
        const activeAssignment = await GuideAssignment.findOne({
          guideId: guide._id,
          status: { $in: ['upcoming', 'ongoing'] }
        });
        if (activeAssignment) {
          const freeDate = new Date(activeAssignment.endDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          return res.status(409).json({
            success: false,
            message: `This guide became unavailable before payment was completed. They will be free from ${freeDate}. Please go back and choose another guide.`,
            availableFrom: activeAssignment.endDate
          });
        }
      }
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.paidAmount = booking.totalPrice;
    await booking.save();

    // Create guide assignment immediately on confirmation
    if (booking.guideName) {
      let guide = await Guide.findOne({ name: booking.guideName });
      if (!guide && booking.guideId) guide = await Guide.findById(booking.guideId);

      if (!guide) {
        const userGuide = await User.findOne({ name: booking.guideName, role: 'guide' });
        if (userGuide) {
          guide = await Guide.create({
            name: userGuide.name, email: userGuide.email,
            password: userGuide.password, phone: userGuide.phone || '',
            userId: userGuide._id, dailyRate: 70, isActive: true
          });
        }
      }

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
      }
    }

    res.status(200).json({ success: true, message: 'Booking confirmed successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm booking', error: error.message });
  }
};