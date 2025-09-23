
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Tarang
        </Link>
        <ul className="nav-menu">
          {user ? (
            <>
              {user.role === 'citizen' && (
                <>
                  <li className="nav-item">
                    <Link to="/citizen-dashboard" className="nav-links">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/report" className="nav-links">
                      Report Hazard
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'officer' && (
                <>
                  <li className="nav-item">
                    <Link to="/officer-dashboard" className="nav-links">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/analytics" className="nav-links">
                      Analytics
                    </Link>
                  </li>
                   <li className="nav-item">
                    <Link to="/donations" className="nav-links">
                      Donations
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <button className="nav-links-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
