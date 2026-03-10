import GuideApplication from '../model/GuideApplication.js';
import User from '../model/User.js';
import Guide from '../model/Guide.js';

export const submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, age, gender, experience, certifications, languages, specialties, availableFrom } = req.body;
    const existing = await GuideApplication.findOne({ email });
    if (existing) return res.status(400).json({ status: 'error', message: 'You have already submitted an application' });
    const application = await GuideApplication.create({ fullName, email, phone, age, gender, experience, certifications, languages: languages || [], specialties: specialties || [], availableFrom, status: 'pending' });
    res.status(201).json({ status: 'success', message: 'Application submitted successfully. We will contact you soon.', data: { id: application._id, name: application.fullName, status: application.status } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while submitting application' });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await GuideApplication.find().sort({ appliedAt: -1 });
    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      interview: applications.filter(a => a.status === 'interview').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
    res.status(200).json({ status: 'success', count: applications.length, stats, data: applications });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching applications' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const application = await GuideApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ status: 'error', message: 'Application not found' });
    application.status = status;
    if (status === 'rejected' && rejectionReason) application.rejectionReason = rejectionReason;
    if (status === 'accepted') {
      let userRecord = await User.findOne({ email: application.email });
      if (!userRecord) {
        const tempPassword = Math.random().toString(36).slice(-8);
        userRecord = await User.create({ name: application.fullName, email: application.email, password: tempPassword, phone: application.phone, role: 'guide' });
      }
      const guideExists = await Guide.findOne({ email: application.email });
      if (!guideExists && userRecord) {
        const tempPassword2 = Math.random().toString(36).slice(-8);
        await Guide.create({ name: application.fullName, email: application.email, password: tempPassword2, phone: application.phone, languages: application.languages || [], specialties: application.specialties || [], experience: application.experience || '', certifications: Array.isArray(application.certifications) ? application.certifications : (application.certifications ? [application.certifications] : []), dailyRate: 70, isActive: true, userId: userRecord._id });
      }
    }
    await application.save();
    res.status(200).json({ status: 'success', message: `Application ${status}`, data: application });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while updating application' });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await GuideApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ status: 'error', message: 'Application not found' });
    res.status(200).json({ status: 'success', data: application });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error while fetching application' });
  }
};
