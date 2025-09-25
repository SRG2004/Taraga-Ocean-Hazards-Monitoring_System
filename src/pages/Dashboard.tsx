import React from 'react';
import Navbar from '../components/Navbar';
import OfficerDashboard from './OfficerDashboard';
import CitizenDashboard from '../components/CitizenDashboard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Initially, user might be null until authentication status is checked.
  if (!user) {
    // Optionally, you can return a loading spinner or some placeholder.
    return <div>Loading user information...</div>;
  }

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
