import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ email });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(`Password change failed: ${error.message}`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-page">
      <h1>Account Settings</h1>

      <div className="settings-container">
        {/* Profile Information */}
        <div className="settings-card">
          <h2>Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <p className="role-display">{user.role}</p>
            </div>
            <button type="submit" className="btn-update">Update Profile</button>
          </form>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-update">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
