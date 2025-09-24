import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import SideNav from './components/SideNav'; // Import SideNav
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import SocialMediaMonitoring from './pages/SocialMediaMonitoring';
import DonationManagement from './pages/DonationManagement';
import Donation from './pages/Donation'; // Import Donation
import VolunteerRegistration from './pages/VolunteerRegistration';
import UserRegistration from './pages/UserRegistration';
import LoginPage from './pages/LoginPage';
import MapViewPage from './pages/MapViewPage';
import Settings from './pages/Settings';
import './App.css';

const AppRoutes = () => {
  const { user } = useApp();

  return (
    <div className="app-container">
      {user && <SideNav role={user.role} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <LoginPage />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/citizen/dashboard" element={user?.role === 'citizen' ? <CitizenDashboard /> : <Navigate to="/login" />} />
          <Route path="/analyst/dashboard" element={user?.role === 'analyst' ? <AnalyticsDashboard /> : <Navigate to="/login" />} />
          <Route path="/official/dashboard" element={user?.role === 'official' ? <OfficerDashboard /> : <Navigate to="/login" />} />
          <Route path="/social-media" element={<SocialMediaMonitoring />} />
          <Route path="/donations" element={<Donation />} />
          <Route path="/donation-management" element={<DonationManagement />} />
          <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
          <Route path="/map" element={<MapViewPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Navbar />
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
