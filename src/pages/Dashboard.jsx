import React from 'react';
import Navbar from '../components/Navbar';
import OfficerDashboard from './OfficerDashboard';
import CitizenDashboard from './CitizenDashboard';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext

const Dashboard = () => {
  const { user } = useAuth(); // Assuming useAuth returns user info including role

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        {user.role === 'officer' ? <OfficerDashboard /> : <CitizenDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
