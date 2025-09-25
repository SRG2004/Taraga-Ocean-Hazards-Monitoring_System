  import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import './Donation.css';

const Donation: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { processDonation } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    try {
      await processDonation({ amount: parseFloat(amount), name, email });
      toast.success('Thank you for your generous donation!');
      setAmount('');
      setName('');
      setEmail('');
    } catch (error: any) {
      toast.error(`Donation failed: ${error.message}`);
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <header className="donation-header">
          <h1>Make a Donation</h1>
          <p>Your support helps us respond to emergencies effectively.</p>
        </header>

        <form onSubmit={handleSubmit} className="donation-form">
          <div className="form-group">
            <label htmlFor="amount">Amount (USD)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="(Optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="(Optional) for a receipt"
            />
          </div>
          <button type="submit" className="btn-donate">Donate Now</button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
