import Tour from '../model/Tour.js';

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching tours' });
  }
};

export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour || !tour.isActive) return res.status(404).json({ status: 'error', message: 'Tour not found' });
    res.status(200).json({ status: 'success', data: tour });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching tour' });
  }
};

export const getToursByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const tours = await Tour.find({ category, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching tours' });
  }
};

export const createTour = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ status: 'error', message: 'Access denied. Admin only.' });
    const tour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', message: 'Tour created successfully', data: tour });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ status: 'error', message: error.message });
    res.status(500).json({ status: 'error', message: 'Server error while creating tour' });
  }
};
