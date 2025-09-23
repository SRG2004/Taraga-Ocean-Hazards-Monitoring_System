import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationManagement.css';

const DonationManagement = () => {
  const navigate = useNavigate();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    type: 'Monetary',
    amount: '500',
    description: 'Emergency relief donation of ₹500',
    anonymous: false,
    receipt: true
  });

  const quickAmounts = ['₹500', '₹1000', '₹2000', '₹5000'];

  const materialDonations = [
    {
      id: 'relief-supplies',
      title: 'Relief Supplies',
      description: 'Food, water, medicines',
      icon: '🏥',
      color: '#ec4899'
    },
    {
      id: 'equipment',
      title: 'Equipment',
      description: 'Rescue gear, communication devices',
      icon: '⚡',
      color: '#3b82f6'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Transportation, technical support',
      icon: '🔧',
      color: '#8b5cf6'
    }
  ];

  const handleDonationSubmit = () => {
    console.log('Donation submitted:', donationForm);
    setShowDonationModal(false);
    // In a real app, this would submit to your backend
  };

  return (
    <div className="donation-management">
      {/* Header */}
      <header className="donation-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">💝 Make a Donation</h1>
            <p className="page-subtitle">Support emergency response through your generosity</p>
          </div>
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={() => navigate('/')}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </header>

      <main className="donation-main">
        {/* Quick Donation */}
        <section className="quick-donation-section">
          <div className="donation-grid">
            <div className="monetary-donations">
              <h3 className="section-title">🔥 Quick Monetary Donation</h3>
              <div className="amount-buttons">
                {quickAmounts.map((amount) => (
                  <button key={amount} className="amount-button">
                    {amount}
                  </button>
                ))}
                <button className="custom-amount-button" onClick={() => setShowDonationModal(true)}>Custom Amount</button>
              </div>
            </div>

            <div className="material-donations">
              <h3 className="section-title">📦 Donate Supplies or Services</h3>
              <div className="material-grid">
                {materialDonations.map((item) => (
                  <div key={item.id} className="material-card" onClick={() => setShowDonationModal(true)}>
                    <div 
                      className="material-icon"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div className="material-info">
                      <h4 className="material-title">{item.title}</h4>
                      <p className="material-description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="modal-overlay" onClick={() => setShowDonationModal(false)}>
          <div className="donation-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💝 Make a Donation</h3>
              <button 
                className="close-button"
                onClick={() => setShowDonationModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Donation Type</label>
                <select 
                  value={donationForm.type}
                  onChange={(e) => setDonationForm({...donationForm, type: e.target.value})}
                >
                  <option>Monetary</option>
                  <option>Supplies</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="text"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                  placeholder="500"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                  placeholder="Emergency relief donation of ₹500"
                  rows="3"
                />
              </div>
              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={donationForm.anonymous}
                    onChange={(e) => setDonationForm({...donationForm, anonymous: e.target.checked})}
                  />
                  Make this donation anonymous
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={donationForm.receipt}
                    onChange={(e) => setDonationForm({...donationForm, receipt: e.target.checked})}
                  />
                  Request tax receipt
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowDonationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="donate-now-button"
                onClick={handleDonationSubmit}
              >
                💝 Donate Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;
