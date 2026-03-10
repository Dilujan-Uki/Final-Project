import User from '../model/User.js';
import Booking from '../model/Booking.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const bookings = await Booking.find({ userId: user._id }).populate('tourId', 'name price').sort({ createdAt: -1 });
        return { ...user.toObject(), totalBookings: bookings.length, totalSpent: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0), recentBookings: bookings.slice(0, 3) };
      })
    );
    res.status(200).json({ status: 'success', count: usersWithDetails.length, data: usersWithDetails });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    const bookings = await Booking.find({ userId: user._id }).populate('tourId', 'name price duration image').sort({ createdAt: -1 });
    const stats = {
      totalBookings: bookings.length,
      totalSpent: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length
    };
    res.status(200).json({ status: 'success', data: { user, stats, bookings } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching user' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (preferences) user.preferences = preferences;
    await user.save();
    res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: { name: user.name, email: user.email, phone: user.phone, address: user.address, preferences: user.preferences } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating profile' });
  }
};

export const toggleSuspendUser = async (req, res) => {
  try {
    const { isSuspended, reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ status: 'error', message: 'Cannot suspend admin accounts' });
    user.isSuspended = isSuspended;
    user.suspendedReason = isSuspended ? (reason || 'Suspended by admin') : '';
    await user.save();
    res.status(200).json({ status: 'success', message: `User ${isSuspended ? 'suspended' : 'unsuspended'} successfully`, data: { isSuspended: user.isSuspended, suspendedReason: user.suspendedReason } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
