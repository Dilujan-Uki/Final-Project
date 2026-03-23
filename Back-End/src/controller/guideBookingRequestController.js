import GuideBookingRequest from '../model/GuideBookingRequest.js';
import Guide from '../model/Guide.js';
import Booking from '../model/Booking.js';

// GET /api/guides/booking-requests  — guide sees their pending requests
export const getMyBookingRequests = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });

    const requests = await GuideBookingRequest.find({ guideId: guide._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

// PATCH /api/guides/booking-requests/:id/respond
// Body: { action: 'accept' | 'reject', reason?: string }
export const respondToBookingRequest = async (req, res) => {
  try {
    const { action, reason } = req.body;
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ status: 'error', message: 'Action must be accept or reject' });
    }

    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });

    const request = await GuideBookingRequest.findOne({ _id: req.params.id, guideId: guide._id });
    if (!request) return res.status(404).json({ status: 'error', message: 'Booking request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ status: 'error', message: `Request has already been ${request.status}` });
    }

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    request.respondedAt = new Date();
    if (action === 'reject') {
      request.rejectionReason = reason || 'The guide is unable to take this booking';
    }
    await request.save();

    // If rejected: the booking stays "pending" but the user will see the rejection message
    // If accepted: booking will be confirmed when user pays
    const message = action === 'accept'
      ? 'Booking request accepted! The customer will be notified and can proceed to payment.'
      : 'Booking request declined. The customer will be notified to choose another guide.';

    res.status(200).json({ status: 'success', message, data: request });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

// GET /api/guides/booking-requests/pending-count  — for notification badge
export const getPendingRequestCount = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(200).json({ status: 'success', count: 0 });
    const count = await GuideBookingRequest.countDocuments({ guideId: guide._id, status: 'pending' });
    res.status(200).json({ status: 'success', count });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
