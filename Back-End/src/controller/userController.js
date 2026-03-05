// src/controller/userController.js
const User = require('../model/User');
const Booking = require('../model/Booking');

// @desc    Get all users with their booking counts (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    // For each user, get their booking count and recent bookings
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const bookings = await Booking.find({ userId: user._id })
          .populate('tourId', 'name price')
          .sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          totalBookings: bookings.length,
          totalSpent: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
          recentBookings: bookings.slice(0, 3) // Last 3 bookings
        };
      })
    );

    res.status(200).json({
      status: 'success',
      count: usersWithDetails.length,
      data: usersWithDetails
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get single user with all details (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get all bookings for this user
    const bookings = await Booking.find({ userId: user._id })
      .populate('tourId', 'name price duration image')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalBookings: bookings.length,
      totalSpent: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length
    };

    res.status(200).json({
      status: 'success',
      data: {
        user,
        stats,
        bookings
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user'
    });
  }
};


// src/controller/userController.js - Add this function
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (preferences) user.preferences = preferences;
    
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
};

// Add to exports
module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile
};