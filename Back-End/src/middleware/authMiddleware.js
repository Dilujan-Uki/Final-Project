import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import Guide from '../model/Guide.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ceylon-tours-secret-key');

      // Try User collection first
      let user = await User.findById(decoded.id).select('-password');

      // If not found in User collection, try Guide collection (fallback for standalone guide accounts)
      if (!user) {
        const guide = await Guide.findById(decoded.id).select('-password');
        if (guide) {
          req.user = { _id: guide._id, name: guide.name, email: guide.email, phone: guide.phone, role: 'guide', isSuspended: guide.isSuspended };
          req.userId = decoded.id;
          return next();
        }
        return res.status(401).json({ status: 'error', message: 'User not found' });
      }

      req.user = user;
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ status: 'error', message: 'Not authorized' });
    if (req.user.role !== 'admin') return res.status(403).json({ status: 'error', message: 'Access denied. Admin only.' });
    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const checkNotSuspended = async (req, res, next) => {
  if (req.user && req.user.isSuspended && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Your account has been suspended. Please contact support.',
      isSuspended: true,
      reason: req.user.suspendedReason
    });
  }
  next();
};
