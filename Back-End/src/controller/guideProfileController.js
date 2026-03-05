const Guide = require('../model/Guide');
const User = require('../model/User');

const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ isActive: true }).select('-password -__v').sort({ rating: -1 });
    res.status(200).json({ status: 'success', count: guides.length, data: guides });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guides' });
  }
};

// Admin: get all guides including inactive
const getAllGuidesAdmin = async (req, res) => {
  try {
    const guides = await Guide.find({}).select('-password -__v').sort({ rating: -1 });
    res.status(200).json({ status: 'success', count: guides.length, data: guides });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guides' });
  }
};

const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).select('-password -__v');
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide not found' });
    res.status(200).json({ status: 'success', data: guide });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guide' });
  }
};

const getGuidesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let filter = { isActive: true };
    if (category !== 'all') filter.category = category;
    const guides = await Guide.find(filter).select('-password -__v').sort({ rating: -1 });
    res.status(200).json({ status: 'success', count: guides.length, data: guides });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guides' });
  }
};

const updateGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });

    const updatableFields = ['phone', 'bio', 'languages', 'specialties', 'dailyRate', 'availability', 'responseTime', 'profileImage'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) guide[field] = req.body[field];
    });

    guide.updatedAt = Date.now();
    await guide.save();

    if (req.body.phone) await User.findByIdAndUpdate(req.userId, { phone: req.body.phone });

    res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: guide });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating profile' });
  }
};

const getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId }).select('-password');
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });
    res.status(200).json({ status: 'success', data: guide });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching profile' });
  }
};

// Admin: Suspend or unsuspend a guide
const toggleSuspendGuide = async (req, res) => {
  try {
    const { isSuspended, reason } = req.body;
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide not found' });

    guide.isSuspended = isSuspended;
    guide.suspendedReason = isSuspended ? (reason || 'Suspended by admin') : '';
    await guide.save();

    // Also update the linked User account if it exists
    if (guide.userId) {
      await User.findByIdAndUpdate(guide.userId, {
        isSuspended: isSuspended,
        suspendedReason: isSuspended ? (reason || 'Suspended by admin') : ''
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Guide ${isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      data: { isSuspended: guide.isSuspended, suspendedReason: guide.suspendedReason }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

module.exports = { getAllGuides, getAllGuidesAdmin, getGuideById, getGuidesByCategory, updateGuideProfile, getMyGuideProfile, toggleSuspendGuide };
