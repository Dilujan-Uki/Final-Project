import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideApplicationPage.css';

const GuideApplicationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    experience: '',
    certifications: '',
    languages: [],
    specialties: [],
    availableFrom: '',
    motivation: '',
    whyJoin: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const languageOptions = [
    { value: 'English', level: 'Native/Fluent' },
    { value: 'Sinhala', level: 'Native' },
    { value: 'Tamil', level: 'Native/Fluent' },
    { value: 'French', level: 'Conversational' },
    { value: 'German', level: 'Conversational' },
    { value: 'Japanese', level: 'Conversational' },
    { value: 'Chinese', level: 'Basic' },
    { value: 'Russian', level: 'Basic' },
    { value: 'Italian', level: 'Basic' },
    { value: 'Spanish', level: 'Basic' }
  ];

  const specialtyOptions = [
    { name: 'Cultural Heritage', icon: '🏛️', description: 'Ancient cities, temples, UNESCO sites' },
    { name: 'Wildlife', icon: '🦁', description: 'Safaris, bird watching, national parks' },
    { name: 'Adventure', icon: '🏔️', description: 'Hiking, camping, rock climbing' },
    { name: 'Beach Tours', icon: '🏖️', description: 'Coastal areas, water sports, relaxation' },
    { name: 'Tea Plantations', icon: '🍃', description: 'Tea estates, factory tours, tasting' },
    { name: 'Culinary Tours', icon: '🍛', description: 'Food experiences, cooking classes' },
    { name: 'Photography', icon: '📸', description: 'Scenic spots, golden hour tours' },
    { name: 'History', icon: '📜', description: 'Historical sites, museums, storytelling' },
    { name: 'Bird Watching', icon: '🦜', description: 'Endemic birds, nature walks' },
    { name: 'Cultural Events', icon: '🎭', description: 'Festivals, dance, traditions' }
  ];

  const experienceLevels = [
    { value: '0-1', label: 'Less than 1 year (Entry Level)' },
    { value: '1-3', label: '1-3 years (Intermediate)' },
    { value: '3-5', label: '3-5 years (Experienced)' },
    { value: '5-10', label: '5-10 years (Very Experienced)' },
    { value: '10+', label: '10+ years (Expert)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const validateStep = () => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.age || !formData.gender) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.age < 18 || formData.age > 70) {
        setError('Age must be between 18 and 70');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.experience || !formData.certifications) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.languages.length === 0) {
        setError('Please select at least one language');
        return false;
      }
      if (formData.specialties.length === 0) {
        setError('Please select at least one specialty');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/guide-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Application failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="application-success">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✨</div>
            <h2>Application Submitted!</h2>
            <p>Thank you for applying to become a tour guide with Island Quest.</p>
            <p className="success-message">We will review your application and contact you within 3-5 business days.</p>
            <div className="success-details">
              <p>📧 Check your email for confirmation</p>
              <p>📞 Our team will call you for an interview</p>
            </div>
            <button onClick={() => navigate('/')} className="btn-primary">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-application-page">
      <div className="container">
        <div className="application-header">
          <h1 className="page-title">Join Our Team as a Tour Guide</h1>
          <p className="page-subtitle">
            Share your knowledge and passion for Sri Lanka with travelers from around the world
          </p>
        </div>

        {/* Progress Steps */}
        <div className="application-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-info">
              <span className="step-label">Personal Info</span>
              <span className="step-status">{currentStep > 1 ? '✓ Completed' : currentStep === 1 ? 'In Progress' : 'Pending'}</span>
            </div>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-info">
              <span className="step-label">Professional Details</span>
              <span className="step-status">{currentStep > 2 ? '✓ Completed' : currentStep === 2 ? 'In Progress' : 'Pending'}</span>
            </div>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-info">
              <span className="step-label">Review & Submit</span>
              <span className="step-status">{currentStep === 3 ? 'In Progress' : 'Pending'}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <div className="application-form-container">
          <form onSubmit={handleSubmit} className="application-form">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="form-step fade-in">
                <div className="step-header">
                  <h2 className="step-title">Personal Information</h2>
                  <p className="step-description">Tell us about yourself</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">
                      Age <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="70"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Gender <span className="required">*</span>
                  </label>
                  <div className="gender-options">
                    <label className={`gender-option ${formData.gender === 'male' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                      />
                      <span className="gender-icon">👨</span>
                      <span>Male</span>
                    </label>
                    <label className={`gender-option ${formData.gender === 'female' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                      />
                      <span className="gender-icon">👩</span>
                      <span>Female</span>
                    </label>
                    <label className={`gender-option ${formData.gender === 'other' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                      />
                      <span className="gender-icon">🧑</span>
                      <span>Other</span>
                    </label>
                  </div>
                </div>

                <div className="form-navigation">
                  <button type="button" className="btn-primary next-btn" onClick={nextStep}>
                    Next Step
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <div className="form-step fade-in">
                <div className="step-header">
                  <h2 className="step-title">Professional Information</h2>
                  <p className="step-description">Tell us about your experience and expertise</p>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">
                    Experience Level <span className="required">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="certifications">
                    Certifications & Licenses <span className="required">*</span>
                  </label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="List your relevant certifications (e.g., Government Licensed Guide, First Aid, etc.)"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Languages Spoken <span className="required">*</span>
                    <span className="hint">(Select all that apply)</span>
                  </label>
                  <div className="languages-grid">
                    {languageOptions.map(lang => (
                      <label key={lang.value} className={`language-chip ${formData.languages.includes(lang.value) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          value={lang.value}
                          checked={formData.languages.includes(lang.value)}
                          onChange={(e) => handleCheckboxChange(e, 'languages')}
                        />
                        <span className="language-name">{lang.value}</span>
                        <span className="language-level">{lang.level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Specialties <span className="required">*</span>
                    <span className="hint">(Select your areas of expertise)</span>
                  </label>
                  <div className="specialties-grid">
                    {specialtyOptions.map(spec => (
                      <label key={spec.name} className={`specialty-card ${formData.specialties.includes(spec.name) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          value={spec.name}
                          checked={formData.specialties.includes(spec.name)}
                          onChange={(e) => handleCheckboxChange(e, 'specialties')}
                        />
                        <div className="specialty-content">
                          <span className="specialty-icon">{spec.icon}</span>
                          <div className="specialty-info">
                            <span className="specialty-name">{spec.name}</span>
                            <span className="specialty-description">{spec.description}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="availableFrom">Available From</label>
                  <input
                    type="date"
                    id="availableFrom"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-navigation">
                  <button type="button" className="btn-outline prev-btn" onClick={prevStep}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Previous
                  </button>
                  <button type="button" className="btn-primary next-btn" onClick={nextStep}>
                    Next Step
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="form-step fade-in">
                <div className="step-header">
                  <h2 className="step-title">Review Your Application</h2>
                  <p className="step-description">Please verify your information before submitting</p>
                </div>

                <div className="review-section">
                  <div className="review-card">
                    <h3 className="review-card-title">
                      <span>📋 Personal Information</span>
                      <button type="button" className="edit-btn" onClick={() => setCurrentStep(1)}>Edit</button>
                    </h3>
                    <div className="review-grid">
                      <div className="review-item">
                        <span className="review-label">Full Name</span>
                        <span className="review-value">{formData.fullName}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Email</span>
                        <span className="review-value">{formData.email}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Phone</span>
                        <span className="review-value">{formData.phone}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Age</span>
                        <span className="review-value">{formData.age}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Gender</span>
                        <span className="review-value">{formData.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-card">
                    <h3 className="review-card-title">
                      <span>🎯 Professional Details</span>
                      <button type="button" className="edit-btn" onClick={() => setCurrentStep(2)}>Edit</button>
                    </h3>
                    
                    <div className="review-item">
                      <span className="review-label">Experience Level</span>
                      <span className="review-value">{formData.experience}</span>
                    </div>

                    <div className="review-item">
                      <span className="review-label">Certifications</span>
                      <span className="review-value">{formData.certifications}</span>
                    </div>

                    <div className="review-item">
                      <span className="review-label">Languages</span>
                      <div className="review-tags">
                        {formData.languages.map(lang => (
                          <span key={lang} className="tag">{lang}</span>
                        ))}
                      </div>
                    </div>

                    <div className="review-item">
                      <span className="review-label">Specialties</span>
                      <div className="review-tags">
                        {formData.specialties.map(spec => (
                          <span key={spec} className="tag">{spec}</span>
                        ))}
                      </div>
                    </div>

                    {formData.availableFrom && (
                      <div className="review-item">
                        <span className="review-label">Available From</span>
                        <span className="review-value">
                          {new Date(formData.availableFrom).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="terms-agreement">
                    <label className="checkbox">
                      <input type="checkbox" required />
                      <span>I confirm that all information provided is accurate and complete</span>
                    </label>
                    <label className="checkbox">
                      <input type="checkbox" required />
                      <span>I agree to be contacted by Island Quest regarding my application</span>
                    </label>
                  </div>
                </div>

                <div className="form-navigation">
                  <button type="button" className="btn-outline prev-btn" onClick={prevStep}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Previous
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner-small"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <span className="submit-icon">✨</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuideApplicationPage;