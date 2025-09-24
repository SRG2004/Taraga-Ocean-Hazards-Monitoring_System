import React from 'react';
import SideNav from '../components/SideNav';
import './OfficerDashboard.css';

const OfficerDashboard = () => {
  return (
    <div className="officer-dashboard">
      <SideNav role="officer" />
      <div className="dashboard-content">
        <h2>Officer Dashboard</h2>
        <p>Welcome to your dashboard.</p>
      </div>
    </div>
  );
};

export default OfficerDashboard;
