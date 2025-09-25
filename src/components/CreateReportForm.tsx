import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CreateReportForm.css';

interface CreateReportFormProps {
  onReportSubmitted: (report: any) => void;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onReportSubmitted }) => {
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    media: [] as File[],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, media: Array.from(e.target.files as FileList) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const reportData = new FormData();
    reportData.append('type', formData.type);
    reportData.append('severity', formData.severity);
    reportData.append('title', formData.title);
    reportData.append('description', formData.description);
    reportData.append('coordinates', JSON.stringify({ lat: formData.latitude, lng: formData.longitude }));

    for (let i = 0; i < formData.media.length; i++) {
      reportData.append('media', formData.media[i]);
    }

    try {
      const response = await axios.post('/api/hazards/report', reportData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Hazard report submitted successfully!');
      if (onReportSubmitted) {
        onReportSubmitted(response.data.report);
      }
      // Reset form
      setFormData({
        type: '',
        severity: '',
        title: '',
        description: '',
        latitude: '',
        longitude: '',
        media: [],
      });
    } catch (error: any) {
      console.error('Failed to submit hazard report:', error);
      toast.error(error.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-report-form-container">
      <h2 className="form-title">Report a New Hazard</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Tsunami Warning"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Hazard Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
              <option value="">Select Type</option>
              <option value="tsunami">Tsunami</option>
              <option value="storm_surge">Storm Surge</option>
              <option value="high_tide">High Tide</option>
              <option value="rip_current">Rip Current</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="severity">Severity Level</label>
            <select id="severity" name="severity" value={formData.severity} onChange={handleInputChange} required>
              <option value="">Select Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief description of the hazard."
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 13.0499"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g., 80.2824"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="media">Attach Media (Images/Videos)</label>
          <input type="file" id="media" name="media" onChange={handleFileChange} multiple />
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default CreateReportForm;