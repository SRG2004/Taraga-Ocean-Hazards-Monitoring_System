import React, { useState, useEffect } from 'react';
import { hazardReportService } from '../services/hazardReportService';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import './CreateReportForm.css';

const CreateReportForm = ({ onClose, onSuccess, initialLocation = null }) => {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    severity: 'medium',
    coordinates: initialLocation || null,
    locationAddress: '',
    mediaFiles: []
  });

  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setFormData(prev => ({ ...prev, coordinates: initialLocation }));
      fetchAddressForCoords(initialLocation);
    }
  }, [initialLocation]);

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami' },
    { value: 'high_waves', label: 'High Waves' },
    { value: 'storm', label: 'Storm/Cyclone' },
    { value: 'flood', label: 'Coastal Flood' },
    { value: 'erosion', label: 'Coastal Erosion' },
    { value: 'oil_spill', label: 'Oil Spill' },
    { value: 'debris', label: 'Marine Debris' },
    { value: 'pollution', label: 'Water Pollution' },
    { value: 'wildlife', label: 'Marine Wildlife Distress' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low Risk', color: '#10b981' },
    { value: 'medium', label: 'Medium Risk', color: '#f59e0b' },
    { value: 'high', label: 'High Risk', color: '#ef4444' },
    { value: 'critical', label: 'Critical/Emergency', color: '#7c2d12' }
  ];

  const fetchAddressForCoords = async (coords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData(prev => ({ ...prev, locationAddress: data.display_name }));
      }
    } catch (error) {
      console.warn('Could not get address for coords:', error);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setFormData(prev => ({ ...prev, coordinates: coords }));
          await fetchAddressForCoords(coords);
          setLocationLoading(false);
          toast.success('Location captured!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please select it on the map or enter details manually.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, mediaFiles: files }));
  };

  const extractLocationDetails = async (coords) => {
    if (!coords) return { state: '', district: '' };
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await response.json();
      return {
          state: data.address?.state || '',
          district: data.address?.state_district || ''
      };
    } catch (error) {
      console.error('Error getting location details from coords:', error);
      return { state: '', district: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coordinates || typeof formData.coordinates.lat === 'undefined' || typeof formData.coordinates.lng === 'undefined') {
      toast.error('Location is missing. Please use "Use Current Location" or click on the map to set a location.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please provide a description of the hazard.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Submitting your report...');

    try {
      const locationDetails = await extractLocationDetails(formData.coordinates);

      const reportData = {
        ...formData,
        userId: user?.uid || 'anonymous',
        reporterName: user?.displayName || 'Anonymous User',
        reporterEmail: user?.email || '',
        location: {
          latitude: formData.coordinates.lat,
          longitude: formData.coordinates.lng,
          address: formData.locationAddress,
          state: locationDetails.state,
          district: locationDetails.district
        }
      };

      const result = await hazardReportService.submitReport(reportData);
      
      if (result.success) {
        toast.success('Report submitted successfully!', { id: toastId });
        onSuccess && onSuccess(result.data);
        onClose && onClose();
      } else {
        throw new Error('Submission failed for an unknown reason.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(`Submission failed: ${error.message}. Please try again.`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-report-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Report Ocean Hazard</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="title">Report Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief title for the hazard"
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Hazard Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                {hazardTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="severity">Severity Level *</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of what you observed..."
                rows={4}
                required
                maxLength={1000}
              />
              <small>{formData.description.length}/1000 characters</small>
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>
            <div className="location-controls">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="location-button"
              >
                {locationLoading ? '📍 Getting Location...' : '📍 Use Current Location'}
              </button>
              {formData.coordinates && (
                <div className="coordinates-display">
                  <p>📍 Lat: {formData.coordinates.lat.toFixed(6)}, Lng: {formData.coordinates.lng.toFixed(6)}</p>
                  {formData.locationAddress && (
                    <p className="address">📍 {formData.locationAddress}</p>
                  )}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="locationAddress">Location Details</label>
              <input
                type="text"
                id="locationAddress"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleInputChange}
                placeholder="Describe the exact location (beach name, landmark, etc.)"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Photos/Videos (Optional)</h3>
            <div className="form-group">
              <label htmlFor="mediaFiles">Upload Images/Videos</label>
              <input
                type="file"
                id="mediaFiles"
                multiple
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <small>Supported formats: JPG, PNG, MP4, MOV (Max 5 files, 10MB each)</small>
              {formData.mediaFiles.length > 0 && (
                <div className="file-preview">
                  {Array.from(formData.mediaFiles).map((file, index) => (
                    <div key={index} className="file-item">
                      📷 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !formData.coordinates}
              className="submit-button"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportForm;
