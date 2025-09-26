
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SideNav from './components/SideNav';
import CitizenDashboard from './components/CitizenDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import SocialMediaMonitoring from './pages/SocialMediaMonitoring';
import DonationManagement from './pages/DonationManagement';
import Donation from './pages/Donation';
import VolunteerRegistration from './pages/VolunteerRegistration';
import UserRegistration from './pages/UserRegistration';
import LoginPage from './pages/LoginPage';
import MapViewPage from './pages/MapViewPage';
import Settings from './pages/Settings';
import './App.css';

const ProtectedRoute: React.FC<{ role: string; children: React.ReactElement }> = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};


const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && user && <SideNav role={user.role} />}
      <main className="main-content">
        <Navbar />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <LoginPage />} />
          <Route path="/register" element={<UserRegistration />} />

          {/* Citizen Routes */}
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

          {/* Analyst Routes */}
          <Route 
            path="/analyst/dashboard"
            element={<ProtectedRoute role="analyst"><AnalyticsDashboard /></ProtectedRoute>}
          />

          {/* Official Routes */}
          <Route 
            path="/official/dashboard"
            element={<ProtectedRoute role="official"><OfficerDashboard /></ProtectedRoute>}
          />

          {/* General Routes */}
          <Route path="/social-media" element={<SocialMediaMonitoring />} />
          <Route path="/donations" element={<Donation />} />
          <Route path="/donation-management" element={<DonationManagement />} />
          <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
          <Route path="/map" element={<MapViewPage />} />
          <Route path="/settings" element={<Settings />} />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/citizen/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
