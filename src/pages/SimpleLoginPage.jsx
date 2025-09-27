import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../components/CreateReportForm.css';

const SimpleLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loginLoading, setLoginLoading] = useState(false);

  const demoAccounts = [
    {
      type: 'Admin',
      email: 'admin@oceanhazard.com',
      description: 'Full system access & management',
      icon: '👨‍💼',
      password: 'demo123'
    },
    {
      type: 'Data Analyst',
      email: 'analyst@oceanhazard.com',
      description: 'Analytics, reports & social media monitoring',
      icon: '📊',
      password: 'demo123'
    },
    {
      type: 'Official',
      email: 'official@oceanhazard.com',
      description: 'Emergency response & coordination',
      icon: '🛡️',
      password: 'demo123'
    },
    {
      type: 'Citizen',
      email: 'citizen@oceanhazard.com',
      description: 'Report hazards & receive alerts',
      icon: '👥',
      password: 'demo123'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoginLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        toast.success(`Welcome ${data.user.fullName}!`);
        // Trigger a page reload to update the app state
        window.location.href = '/';
      } else {
        const error = await response.json();
        toast.error(`Login failed: ${error.error || 'Invalid credentials'}`);
      }
    } catch (error) {
      toast.error('Login failed: Network error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDemoLogin = async (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: false
    });
    
    // Automatically login with demo account
    setLoginLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: account.password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        toast.success(`Logged in as ${account.type}`);
        // Trigger a page reload to update the app state
        window.location.href = '/';
      } else {
        const error = await response.json();
        toast.error(`Login failed: ${error.error || 'Invalid credentials'}`);
      }
    } catch (error) {
      toast.error('Login failed: Network error');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Taranga Ocean Monitor</h1>
            <p className="login-subtitle">Advanced Hazard Detection & Response System</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="signin-button"
              disabled={loginLoading}
            >
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>Don't have an account?</span>
          </div>

          <div className="account-options">
            <button 
              className="create-account-button"
              onClick={() => toast.info('Registration coming soon!')}
            >
              Create General Account
            </button>
            <button 
              className="volunteer-register-button"
              onClick={() => toast.info('Volunteer registration coming soon!')}
            >
              Register as Volunteer
            </button>
          </div>

          <div className="demo-section">
            <h3 className="demo-title">Demo Accounts</h3>
            <p className="demo-subtitle">Click any account below to instantly login and explore the system</p>
            <div className="demo-accounts">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index} 
                  className="demo-account"
                  onClick={() => handleDemoLogin(account)}
                >
                  <div className="demo-icon">{account.icon}</div>
                  <div className="demo-info">
                    <div className="demo-type">{account.type}</div>
                    <div className="demo-email">{account.email}</div>
                    <div className="demo-description">{account.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginPage;
