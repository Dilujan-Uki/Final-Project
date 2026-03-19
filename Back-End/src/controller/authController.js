import User from '../model/User.js';
import Guide from '../model/Guide.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ status: 'error', message: 'User already exists' });

    const user = await User.create({ name, email, password, phone: phone || '' });
    const token = generateToken(user._id);
    res.status(201).json({ status: 'success', message: 'User registered successfully', data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, token } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First, check the User collection (covers regular users, admins, and guide user accounts)
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

      const token = generateToken(user._id);
      return res.status(200).json({ status: 'success', message: 'Login successful', data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, token } });
    }

    // Fallback: check Guide collection directly (in case a guide exists without a linked User account)
    const guide = await Guide.findOne({ email });
    if (guide) {
      const isPasswordValid = await guide.comparePassword(password);
      if (!isPasswordValid) return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

      const token = generateToken(guide._id);
      return res.status(200).json({ status: 'success', message: 'Login successful', data: { _id: guide._id, name: guide.name, email: guide.email, phone: guide.phone, role: 'guide', token } });
    }

    return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.status(200).json({ status: 'success', data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
