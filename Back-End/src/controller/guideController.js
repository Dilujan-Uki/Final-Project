// src/controller/guideController.js
const GuideAssignment = require('../model/GuideAssignment');
const Booking = require('../model/Booking');
const User = require('../model/User');

// @desc    Get guide's assigned tours
// @route   GET /api/guide/assignments
// @access  Private (Guide only)
const getGuideAssignments = async (req, res) => {
  try {
    const assignments = await GuideAssignment.find({ guideId: req.userId })
      .sort({ startDate: 1 });

    res.status(200).json({
      status: 'success',
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching guide assignments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching assignments'
    });
  }
};

// @desc    Get single assignment details
// @route   GET /api/guide/assignments/:id
// @access  Private (Guide only)
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await GuideAssignment.findOne({
      _id: req.params.id,
      guideId: req.userId
    });

    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: assignment
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching assignment'
    });
  }
};

// @desc    Update assignment status (guide marks as ongoing/completed)
// @route   PATCH /api/guide/assignments/:id/status
// @access  Private (Guide only)
const updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const assignment = await GuideAssignment.findOneAndUpdate(
      { _id: req.params.id, guideId: req.userId },
      { status },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Assignment marked as ${status}`,
      data: assignment
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating assignment'
    });
  }
};

// @desc    Create assignment when booking is confirmed (Admin only)
// @route   POST /api/guide/assignments
// @access  Private/Admin
const createAssignment = async (req, res) => {
  try {
    const { bookingId, guideId } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if guide exists
    const guide = await User.findById(guideId);
    if (!guide || guide.role !== 'guide') {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
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
      status: 'upcoming'
    });

    res.status(201).json({
      status: 'success',
      message: 'Guide assignment created successfully',
      data: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating assignment'
    });
  }
};

module.exports = {
  getGuideAssignments,
  getAssignmentById,
  updateAssignmentStatus,
  createAssignment
};