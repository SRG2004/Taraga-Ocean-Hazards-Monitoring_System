import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonationList.css';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  campaignId: string;
  createdAt: string;
  donor: {
    name: string;
    anonymous: boolean;
  };
}

const DonationList: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('/api/donations');
        setDonations(response.data.donations || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div className="list-loading">Loading donations...</div>;
  }

  if (error) {
    return <div className="list-error">Error: {error}</div>;
  }

  return (
    <div className="donation-list-container">
      <h2>Recent Donations</h2>
      <table className="donation-table">
        <thead>
          <tr>
            <th>Donor</th>
            <th>Amount</th>
            <th>Campaign</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.donor.anonymous ? 'Anonymous' : donation.donor.name}</td>
              <td>{donation.amount} {donation.currency}</td>
              <td>{donation.campaignId}</td>
              <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationList;