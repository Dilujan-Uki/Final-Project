import express from 'express';
import GuideDetail from '../model/GuideDetail.js';
import Guide from '../model/Guide.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/guide-details/:guideId  — fetch detail by Guide _id
router.get('/:guideId', async (req, res) => {
  try {
    const detail = await GuideDetail.findOne({ guideId: req.params.guideId })
      .populate('guideId', 'name email phone profileImage rating totalReviews specialties experience languages dailyRate category bio availability responseTime contactInfo');

    if (!detail) {
      return res.status(404).json({ status: 'error', message: 'Guide details not found' });
    }

    res.status(200).json({ status: 'success', data: detail });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching guide details' });
  }
});

// POST /api/guide-details  — create (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { guideId } = req.body;
    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ status: 'error', message: 'Guide not found' });

    const existing = await GuideDetail.findOne({ guideId });
    if (existing) {
      const updated = await GuideDetail.findByIdAndUpdate(
        existing._id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ status: 'success', message: 'Guide details updated', data: updated });
    }

    const detail = await GuideDetail.create(req.body);
    res.status(201).json({ status: 'success', message: 'Guide details created', data: detail });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while creating guide details' });
  }
});

// PUT /api/guide-details/:id  — update (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const detail = await GuideDetail.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!detail) return res.status(404).json({ status: 'error', message: 'Guide details not found' });
    res.status(200).json({ status: 'success', message: 'Guide details updated', data: detail });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating guide details' });
  }
});

export default router;