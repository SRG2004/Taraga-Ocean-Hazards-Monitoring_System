import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
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
              {user.role === 'citizen' && (
                <li className="nav-item">
                  <NavLink to="/citizen" className="nav-links">
                    Dashboard
                  </NavLink>
                </li>
              )}
              {user.role === 'official' && (
                <li className="nav-item">
                  <NavLink to="/official" className="nav-links">
                    Dashboard
                  </NavLink>
                </li>
              )}
              {user.role === 'analyst' && (
                <li className="nav-item">
                  <NavLink to="/analyst" className="nav-links">
                    Dashboard
                  </NavLink>
                </li>
              )}
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
