import Guide from '../model/Guide.js';
import User from '../model/User.js';

export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ isActive: true }).select('-password -__v').sort({ rating: -1 });
    res.status(200).json({ status: 'success', count: guides.length, data: guides });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guides' });
  }
};

export const getAllGuidesAdmin = async (req, res) => {
  try {
    const guides = await Guide.find({}).select('-password -__v').sort({ rating: -1 });
    res.status(200).json({ status: 'success', count: guides.length, data: guides });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guides' });
  }
};

export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).select('-password -__v');
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide not found' });
    res.status(200).json({ status: 'success', data: guide });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guide' });
  }
};

export const getGuidesByCategory = async (req, res) => {
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

export const updateGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId });
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });
    const updatableFields = ['phone', 'bio', 'languages', 'specialties', 'dailyRate', 'availability', 'responseTime', 'profileImage'];
    updatableFields.forEach(field => { if (req.body[field] !== undefined) guide[field] = req.body[field]; });
    guide.updatedAt = Date.now();
    await guide.save();
    if (req.body.phone) await User.findByIdAndUpdate(req.userId, { phone: req.body.phone });
    res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: guide });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating profile' });
  }
};

export const getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.userId }).select('-password');
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide profile not found' });
    res.status(200).json({ status: 'success', data: guide });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching profile' });
  }
};

export const toggleSuspendGuide = async (req, res) => {
  try {
    const { isSuspended, reason } = req.body;
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide not found' });
    guide.isSuspended = isSuspended;
    guide.suspendedReason = isSuspended ? (reason || 'Suspended by admin') : '';
    await guide.save();
    if (guide.userId) await User.findByIdAndUpdate(guide.userId, { isSuspended: isSuspended, suspendedReason: isSuspended ? (reason || 'Suspended by admin') : '' });
    res.status(200).json({ status: 'success', message: `Guide ${isSuspended ? 'suspended' : 'unsuspended'} successfully`, data: { isSuspended: guide.isSuspended, suspendedReason: guide.suspendedReason } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
