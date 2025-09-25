import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import './VolunteerManagement.css';

const VolunteerManagement: React.FC = () => {
  const { volunteers, loadVolunteers } = useApp();

  useEffect(() => {
    loadVolunteers();
  }, [loadVolunteers]);

  return (
    <div className="volunteer-management-page">
      <header className="page-header">
        <h1>Volunteer Management</h1>
        <p>Coordinate and manage registered volunteers.</p>
      </header>

      <div className="volunteers-list">
        <h2>Registered Volunteers ({volunteers.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.skills}</td>
                <td>
                  <button className="btn-contact">Contact</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerManagement;
