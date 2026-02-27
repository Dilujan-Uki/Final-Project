// src/controller/guideApplicationController.js
const GuideApplication = require('../model/GuideApplication');
const User = require('../model/User');

// @desc    Submit guide application
// @route   POST /api/guide-applications
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      experience,
      certifications,
      languages,
      specialties,
      availableFrom
    } = req.body;

    // Check if email already applied
    const existing = await GuideApplication.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already submitted an application'
      });
    }

    const application = await GuideApplication.create({
      fullName,
      email,
      phone,
      age,
      gender,
      experience,
      certifications,
      languages: languages || [],
      specialties: specialties || [],
      availableFrom,
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully. We will contact you soon.',
      data: {
        id: application._id,
        name: application.fullName,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting application'
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/guide-applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await GuideApplication.find().sort({ appliedAt: -1 });

    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      interview: applications.filter(a => a.status === 'interview').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    res.status(200).json({
      status: 'success',
      count: applications.length,
      stats,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching applications'
    });
  }
};

// @desc    Update application status (Admin only)
// @route   PATCH /api/guide-applications/:id
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const application = await GuideApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    application.status = status;
    
    if (status === 'rejected' && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    if (status === 'accepted') {
      // Create user account for the guide
      const userExists = await User.findOne({ email: application.email });
      
      if (!userExists) {
        // Generate a random password (guide will reset on first login)
        const tempPassword = Math.random().toString(36).slice(-8);
        
        await User.create({
          name: application.fullName,
          email: application.email,
          password: tempPassword,
          phone: application.phone,
          role: 'guide'
        });

        // In production, send email with temporary password
        console.log(`🔑 Guide account created for ${application.email} with password: ${tempPassword}`);
      }
    }

    await application.save();

    res.status(200).json({
      status: 'success',
      message: `Application ${status}`,
      data: application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating application'
    });
  }
};

// @desc    Get single application (Admin only)
// @route   GET /api/guide-applications/:id
// @access  Private/Admin
const getApplicationById = async (req, res) => {
  try {
    const application = await GuideApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching application'
    });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById
};