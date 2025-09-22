import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import './UserRegistration.css';

const UserRegistration = () => {
  const navigate = useNavigate();
  const { register } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'citizen', // Default role
    location: {
      state: '',
      district: '',
      coastalArea: ''
    },
    preferences: {
      alerts: true,
      newsletter: true,
      smsNotifications: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const indianStates = [
    'Andhra Pradesh', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 
    'Odisha', 'Tamil Nadu', 'West Bengal', 'Goa', 'Puducherry'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'A valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.state) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        ...formData,
        userId: `user_${Date.now()}`,
        registrationDate: new Date().toISOString(),
      });
      toast.success('Account created successfully!');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <h1>🌊 Create Your Citizen Account</h1>
          <p>Join the Tarang network to report ocean hazards and receive safety alerts.</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <section className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </section>

          {/* Security */}
          <section className="form-section">
            <h3>Security</h3>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </section>

          {/* Location Information */}
          <section className="form-section">
            <h3>Location Information</h3>
            <div className="form-group">
              <label htmlFor="state">State/Union Territory *</label>
              <select id="state" name="location.state" value={formData.location.state} onChange={handleInputChange} required>
                <option value="">Select your state</option>
                {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="district">District</label>
              <input type="text" id="district" name="location.district" value={formData.location.district} onChange={handleInputChange} />
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
