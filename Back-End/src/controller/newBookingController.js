// src/controller/newBookingController.js
const Booking = require('../model/Booking');
const Tour = require('../model/Tour');

// @desc    Create a new booking
// @route   POST /api/new-bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    console.log('\n========== NEW BOOKING SYSTEM ==========');
    console.log('1. Creating new booking for user:', req.userId);
    console.log('2. Request body:', JSON.stringify(req.body, null, 2));

    const {
      tourId,
      tourName,
      guideName,
      participants,
      duration,
      totalPrice,
      extraServices,
      bookingDate,
      specialRequests
    } = req.body;

    // Validate required fields
    const requiredFields = {
      tourId: 'Tour ID is required',
      tourName: 'Tour name is required',
      participants: 'Number of participants is required',
      duration: 'Duration is required',
      totalPrice: 'Total price is required',
      bookingDate: 'Booking date is required'
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        console.log(`❌ Missing field: ${field}`);
        return res.status(400).json({
          success: false,
          message: message
        });
      }
    }

    // Verify tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      console.log('❌ Tour not found with ID:', tourId);
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Create booking object
    const bookingData = {
      userId: req.userId,
      tourId: tourId,
      tourName: tourName,
      guideName: guideName || '',
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
    };

    console.log('3. Saving booking data:', JSON.stringify(bookingData, null, 2));

    // Save to database
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    console.log('4. Booking saved successfully with ID:', savedBooking._id);
    console.log('=========================================\n');

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: savedBooking._id,
        tourName: savedBooking.tourName,
        bookingDate: savedBooking.bookingDate,
        status: savedBooking.status,
        totalPrice: savedBooking.totalPrice
      }
    });

  } catch (error) {
    console.error('❌ ERROR in createBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/new-bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    console.log('📋 Fetching bookings for user:', req.userId);

    const bookings = await Booking.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings`);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/new-bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/new-bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = Date.now();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
};