import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import './DonationManagement.css';

const DonationManagement: React.FC = () => {
  const { donations, loadDonations } = useApp();

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="donation-management-page">
      <header className="page-header">
        <h1>Donation Management</h1>
        <p>Track and manage incoming donations.</p>
      </header>

      <div className="summary-container">
        <div className="summary-card">
          <h2>Total Donations</h2>
          <p className="total-amount">${totalDonations.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h2>Total Donors</h2>
          <p className="total-donors">{donations.length}</p>
        </div>
      </div>

      <div className="donations-list">
        <h2>Recent Donations</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.date}</td>
                <td>{donation.name}</td>
                <td>${donation.amount.toLocaleString()}</td>
                <td>{donation.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationManagement;
