// src/controller/newBookingController.js
const Booking = require('../model/Booking');
const Tour = require('../model/Tour');

// In src/controller/newBookingController.js - Update the createBooking function

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
      status: 'pending',  // Start as pending
      paymentStatus: 'pending'
    };

    console.log('3. Saving booking data:', JSON.stringify(bookingData, null, 2));

    // Save to database
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    console.log('4. Booking saved successfully with ID:', savedBooking._id);
    
    // IMPORTANT: If guide is selected, we should auto-confirm? Or wait for payment?
    // For now, let's create a pending assignment that will be activated when payment is confirmed
    if (guideName) {
      console.log('5. Guide selected - will create assignment after payment confirmation');
      // Store in session or handle later
    }
    
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
        totalPrice: savedBooking.totalPrice,
        guideName: savedBooking.guideName
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

// Add this to src/controller/newBookingController.js

// @desc    Auto-create guide assignment when booking is confirmed
// @route   (called internally, not an endpoint)
const createGuideAssignment = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone');
    
    if (!booking) {
      console.log('❌ Booking not found for assignment');
      return false;
    }

    // Only create assignment if there's a guide name
    if (!booking.guideName) {
      console.log('ℹ️ No guide selected for this booking');
      return false;
    }

    // Find the guide by name
    const guide = await User.findOne({ 
      name: booking.guideName,
      role: 'guide'
    });

    if (!guide) {
      console.log('❌ Guide not found with name:', booking.guideName);
      return false;
    }

    // Calculate end date
    const startDate = new Date(booking.bookingDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + booking.duration);

    // Create assignment
    const assignment = await GuideAssignment.create({
      guideId: guide._id,
      guideName: guide.name,
      bookingId: booking._id,
      tourId: booking.tourId,
      tourName: booking.tourName,
      customerName: booking.userId.name,
      customerEmail: booking.userId.email,
      customerPhone: booking.userId.phone,
      participants: booking.participants,
      duration: booking.duration,
      startDate: booking.bookingDate,
      endDate: endDate,
      specialRequests: booking.specialRequests,
      meetingPoint: 'To be confirmed with customer',
      status: 'upcoming'
    });

    console.log('✅ Guide assignment created automatically:', assignment._id);
    return true;
  } catch (error) {
    console.error('❌ Error creating guide assignment:', error);
    return false;
  }
};



// Add this to src/controller/newBookingController.js

// @desc    Confirm booking after payment and create guide assignment
// @route   PATCH /api/new-bookings/:id/confirm
// @access  Private
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Create guide assignment if guide was selected
    if (booking.guideName) {
      const guide = await User.findOne({ 
        name: booking.guideName,
        role: 'guide'
      });

      if (guide) {
        // Calculate end date
        const startDate = new Date(booking.bookingDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + booking.duration);

        // Create assignment
        await GuideAssignment.create({
          guideId: guide._id,
          guideName: guide.name,
          bookingId: booking._id,
          tourId: booking.tourId,
          tourName: booking.tourName,
          customerName: booking.userId.name,
          customerEmail: booking.userId.email,
          customerPhone: booking.userId.phone,
          participants: booking.participants,
          duration: booking.duration,
          startDate: booking.bookingDate,
          endDate: endDate,
          specialRequests: booking.specialRequests,
          status: 'upcoming'
        });

        console.log('✅ Guide assignment created for booking:', booking._id);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });

  } catch (error) {
    console.error('❌ Error confirming booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking',
      error: error.message
    });
  }
};

// Add to module.exports
module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  confirmBooking  
};