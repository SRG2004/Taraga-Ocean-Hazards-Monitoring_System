import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DonationForm.css';

interface DonationFormProps {
  onDonationSuccess: (donation: any) => void;
}

interface FormData {
  amount: string;
  donorName: string;
  donorEmail: string;
  anonymous: boolean;
}

const DonationForm: React.FC<DonationFormProps> = ({ onDonationSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    donorName: '',
    donorEmail: '',
    anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/api/donations/process', formData);
      toast.success('Donation processed successfully!');
      if (onDonationSuccess) {
        onDonationSuccess(response.data.donation);
      }
      // Reset form
      setFormData({
        amount: '',
        donorName: '',
        donorEmail: '',
        anonymous: false,
      });
    } catch (error: any) {
      console.error('Failed to process donation:', error);
      toast.error(error.response?.data?.error || 'Failed to process donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="donation-form-container">
      <h2 className="form-title">Make a Donation</h2>
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="amount">Amount (INR)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="donorName">Your Name</label>
          <input
            type="text"
            id="donorName"
            name="donorName"
            value={formData.donorName}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required={!formData.anonymous}
          />
        </div>

        <div className="form-group">
          <label htmlFor="donorEmail">Your Email</label>
          <input
            type="email"
            id="donorEmail"
            name="donorEmail"
            value={formData.donorEmail}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required={!formData.anonymous}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
            />
            Donate anonymously
          </label>
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'Processing...' : 'Donate Now'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;