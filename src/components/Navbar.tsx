import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './Navbar.css';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'analyst' | 'official' | 'citizen';
  phone: string;
  location: {
    state: string;
    district: string;
    coastalArea: string;
  };
  permissions: string[];
}

interface AppContextType {
  user: User | null;
  logout: () => Promise<void>;
}

const Navbar: React.FC = () => {
  const { user, logout } = useApp() as AppContextType;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          🌊 Tarang
        </NavLink>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className="nav-links" end>
              Home
            </NavLink>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <NavLink to={`/${user.role}/dashboard`} className="nav-links">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-links-button" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/donations" className="nav-links">
                  Donate
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-links">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-links-button">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
