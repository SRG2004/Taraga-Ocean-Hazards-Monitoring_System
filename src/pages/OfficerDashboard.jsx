import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationManagement.css';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('management');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    type: 'Monetary',
    amount: '500',
    description: 'Emergency relief donation of ₹500',
    anonymous: false,
    receipt: true
  });

  const stats = [
    { title: 'Total Raised (This Month)', value: '₹50,000.00', color: '#10b981' },
    { title: 'Total Donations', value: '2', color: '#3b82f6' },
    { title: 'Unique Donors', value: '2', color: '#f59e0b' },
    { title: 'Open Requests', value: '0', color: '#8b5cf6' }
  ];

  const recentDonations = [
    {
      id: 1,
      donor: 'Rajesh Kumar',
      type: 'monetary',
      amount: '₹50,000.00',
      purpose: 'Emergency relief fund for cyclone victims',
      date: '8 Sept 2025, 02:04 pm',
      status: 'CONFIRMED'
    },
    {
      id: 2,
      donor: 'Priya Sharma',
      type: 'supplies',
      amount: 'SUPPLIES',
      purpose: 'Relief supplies for flood affected areas',
      date: '3 Sept 2025, 02:04 pm',
      status: 'ALLOCATED'
    }
  ];

  const activeRequests = [
    {
      id: 1,
      title: 'Urgent supplies needed for evacuation center at Marina Beach',
      location: 'Chennai Marina Beach Relief Center',
      deadline: '5 Sept 2025, 02:04 pm',
      status: 'CRITICAL',
      items: [
        { name: 'Life Jackets', needed: '50/200 pieces' },
        { name: 'Emergency Food Packets', needed: '300/1000 packets' }
      ]
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
            <h1 className="page-title">Officer Dashboard</h1>
            <p className="page-subtitle">Manage donations and resource allocation</p>
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

      {/* Navigation Tabs */}
      <nav className="donation-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            📊 Management
            <span className="tab-subtitle">Track donations</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📋 Requests
            <span className="tab-subtitle">Resource needs</span>
          </button>
        </div>
      </nav>

      <main className="donation-main">
        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-title">{stat.title}</div>
              </div>
            ))}
          </div>
        </section>

        {activeTab === 'management' && (
          <section className="management-tab">
            <div className="recent-donations">
              <h3 className="section-title">🎉 Recent Donations</h3>
              <div className="donations-list">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="donation-item">
                    <div className="donation-content">
                      <div className="donor-name">{donation.donor}</div>
                      <div className="donation-purpose">{donation.purpose}</div>
                      <div className="donation-date">{donation.date}</div>
                    </div>
                    <div className="donation-amount">
                      {donation.amount}
                    </div>
                    <div className={`donation-status ${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'requests' && (
          <section className="requests-tab">
            <h2 className="tab-title">📋 Active Resource Requests</h2>
            {activeRequests.length > 0 ? (
              <div className="requests-list">
                {activeRequests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <div className={`request-status ${request.status.toLowerCase()}`}>
                        {request.status}
                      </div>
                      <div className="request-deadline">
                        Deadline: {request.deadline}
                      </div>
                    </div>
                    <h3 className="request-title">{request.title}</h3>
                    <div className="request-location">📍 {request.location}</div>
                    <div className="items-needed">
                      <h4>Items Needed:</h4>
                      <ul className="items-list">
                        {request.items.map((item, index) => (
                          <li key={index} className="item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-progress">{item.needed}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="request-actions">
                      <button className="donate-to-request-button">💝 Donate</button>
                      <button className="contact-button">📞 Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No active requests</h3>
                <p>There are currently no resource requests that need donations.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default OfficerDashboard;
