import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

const SideNav = ({ role }) => {
  return (
    <div className="sidenav">
      <ul>
        {role === 'officer' && (
          <>
            <li><NavLink to="/official/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/official/reports">Reports</NavLink></li>
            <li><NavLink to="/official/users">Users</NavLink></li>
          </>
        )}
        {role === 'citizen' && (
          <>
            <li><NavLink to="/citizen/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/citizen/report">Report Hazard</NavLink></li>
          </>
        )}
        {/* Add more roles and links as needed */}
      </ul>
    </div>
  );
};

export default SideNav;
