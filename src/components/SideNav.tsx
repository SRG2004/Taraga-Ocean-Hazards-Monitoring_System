import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

interface SideNavProps {
  role: string;
}

const SideNav: React.FC<SideNavProps> = ({ role }) => {
  const getNavLinks = () => {
    switch (role) {
      case 'citizen':
        return [
          { path: '/citizen/dashboard', label: 'Dashboard' },
          { path: '/map', label: 'Hazard Map' },
          { path: '/donations', label: 'Donate' },
          { path: '/volunteer-registration', label: 'Volunteer' },
        ];
      case 'officer':
        return [
          { path: '/official/dashboard', label: 'Dashboard' },
          { path: '/map', label: 'Live Map' },
          { path: '/donation-management', label: 'Donations' },
          { path: '/social-media', label: 'Social Media' },
        ];
      case 'analyst':
        return [
          { path: '/analyst/dashboard', label: 'Analytics' },
          { path: '/map', label: 'Hazard Analysis' },
          { path: '/social-media', label: 'Monitoring' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="side-nav">
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideNav;
