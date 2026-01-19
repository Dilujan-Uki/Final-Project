// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ceylon-tours-secret-key');

      // Get user from database and attach to request
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Add user to request object
      req.user = user;
      req.userId = decoded.id;
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token'
    });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    // Check if user exists in request (from protect middleware)
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin only.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = { protect, adminOnly };