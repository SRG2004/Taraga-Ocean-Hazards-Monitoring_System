import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppContext, AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import SocialMediaMonitoring from './pages/SocialMediaMonitoring';
import DonationManagement from './pages/DonationManagement';
import VolunteerRegistration from './pages/VolunteerRegistration';
import UserRegistration from './pages/UserRegistration';
import LoginPage from './pages/LoginPage';
import MapViewPage from './pages/MapViewPage';
import Settings from './pages/Settings';
import './App.css';

const AppRoutes = () => {
  const { user } = useContext(AppContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <LoginPage />} />
      <Route path="/register" element={<UserRegistration />} />
      <Route path="/citizen" element={user?.role === 'citizen' ? <CitizenDashboard /> : <Navigate to="/login" />} />
      <Route path="/analyst" element={user?.role === 'analyst' ? <AnalyticsDashboard /> : <Navigate to="/login" />} />
      <Route path="/official" element={user?.role === 'official' ? <OfficerDashboard /> : <Navigate to="/login" />} />
      <Route path="/social-media" element={<SocialMediaMonitoring />} />
      <Route path="/donations" element={<DonationManagement />} />
      <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
      <Route path="/map" element={<MapViewPage />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
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
        </div>
      </Router>
    </AppProvider>
  );
}
