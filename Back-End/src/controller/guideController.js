const GuideAssignment = require('../model/GuideAssignment');
const Booking = require('../model/Booking');
const User = require('../model/User');
const Guide = require('../model/Guide');

const getGuideAssignments = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });

    const assignments = await GuideAssignment.find({ guideId: guide._id }).sort({ startDate: 1 });
    res.status(200).json({ status: 'success', count: assignments.length, data: assignments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching assignments' });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });

    const assignment = await GuideAssignment.findOne({ _id: req.params.id, guideId: guide._id });
    if (!assignment) return res.status(404).json({ status: 'error', message: 'Assignment not found' });

    res.status(200).json({ status: 'success', data: assignment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching assignment' });
  }
};

const updateAssignmentStatus = async (req, res) => {
  try {
    const { status, completionNote } = req.body;
    const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status value' });
    }

    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });

    const assignment = await GuideAssignment.findOne({ _id: req.params.id, guideId: guide._id });
    if (!assignment) return res.status(404).json({ status: 'error', message: 'Assignment not found' });

    // If guide marks as completed, set the pending completion flag (wait for admin)
    if (status === 'completed') {
      assignment.guideMarkedCompleted = true;
      assignment.guideCompletionNote = completionNote || '';
      assignment.guideCompletedAt = new Date();
      // Keep status as 'ongoing' until admin confirms
      assignment.status = 'ongoing';
    } else {
      assignment.status = status;
    }

    await assignment.save();

    // When guide starts tour (ongoing), sync booking status to 'confirmed'
    if (status === 'ongoing') {
      await Booking.findByIdAndUpdate(assignment.bookingId, { status: 'confirmed', updatedAt: Date.now() });
    }

    const responseMsg = status === 'completed'
      ? 'Tour completion reported. Awaiting admin confirmation.'
      : `Assignment marked as ${status}`;

    res.status(200).json({ status: 'success', message: responseMsg, data: assignment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating assignment' });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { bookingId, guideId } = req.body;
    const booking = await Booking.findById(bookingId).populate('userId', 'name email phone');
    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking not found' });

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide not found' });

    const startDate = new Date(booking.bookingDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (booking.duration || 1));

    const assignment = await GuideAssignment.create({
      guideId: guide._id,
      guideName: guide.name,
      bookingId: booking._id,
      tourId: booking.tourId,
      tourName: booking.tourName,
      customerName: booking.userId?.name || 'Customer',
      customerEmail: booking.userId?.email || '',
      customerPhone: booking.userId?.phone || '',
      participants: booking.participants || 1,
      duration: booking.duration || 1,
      startDate: booking.bookingDate,
      endDate: endDate,
      specialRequests: booking.specialRequests || '',
      status: 'upcoming'
    });

    res.status(201).json({ status: 'success', message: 'Guide assignment created successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while creating assignment' });
  }
};

// Admin: Get all pending completion reports
const getPendingCompletions = async (req, res) => {
  try {
    const pending = await GuideAssignment.find({ guideMarkedCompleted: true, adminConfirmedCompleted: false });
    res.status(200).json({ status: 'success', count: pending.length, data: pending });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Admin: Confirm or reject tour completion
const adminConfirmCompletion = async (req, res) => {
  try {
    const { confirm } = req.body; // true = confirm completed, false = reject
    const assignment = await GuideAssignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ status: 'error', message: 'Assignment not found' });

    if (confirm) {
      assignment.adminConfirmedCompleted = true;
      assignment.adminConfirmedAt = new Date();
      assignment.status = 'completed';
      await assignment.save();

      // Update the booking status to completed
      await Booking.findByIdAndUpdate(assignment.bookingId, { status: 'completed', updatedAt: Date.now() });

      res.status(200).json({ status: 'success', message: 'Tour completion confirmed', data: assignment });
    } else {
      // Reject: reset the completion report, revert to ongoing
      assignment.guideMarkedCompleted = false;
      assignment.guideCompletionNote = '';
      assignment.guideCompletedAt = undefined;
      assignment.status = 'ongoing';
      await assignment.save();

      res.status(200).json({ status: 'success', message: 'Completion report rejected, tour set back to ongoing', data: assignment });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

module.exports = { getGuideAssignments, getAssignmentById, updateAssignmentStatus, createAssignment, getPendingCompletions, adminConfirmCompletion };
