
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Login component with real functionality
const LoginApp: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [currentView, setCurrentView] = React.useState<string>('login');

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentView(`${userData.role}-dashboard`);
      } catch (error) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Redirect to role-specific dashboard
        setCurrentView(`${data.user.role}-dashboard`);
        alert(`Welcome ${data.user.fullName}!`);
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.error || 'Invalid credentials'}`);
      }
    } catch (error) {
      alert('Login failed: Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    setCurrentView('login');
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  // Render different views based on currentView
  if (currentView !== 'login' && user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 0 20px 0', borderBottom: '2px solid #e2e8f0' }}>
          <h1>🌊 Taranga Ocean Hazard Monitor</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Welcome, {user.fullName}</span>
            <button 
              onClick={handleLogout}
              style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            >
              Logout
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Navigation Sidebar */}
          <div style={{ width: '240px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#1e293b' }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h3>
            
            {/* Common Navigation */}
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => handleNavigation(`${user.role}-dashboard`)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '8px', 
                  backgroundColor: currentView === `${user.role}-dashboard` ? '#3b82f6' : '#f1f5f9',
                  color: currentView === `${user.role}-dashboard` ? 'white' : '#64748b',
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🏠 Dashboard Home
              </button>
              
              {/* Role-specific navigation */}
              {user.role === 'citizen' && (
                <>
                  <button onClick={() => handleNavigation('report-hazard')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'report-hazard' ? '#3b82f6' : '#f1f5f9', color: currentView === 'report-hazard' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    📝 Report Hazard
                  </button>
                  <button onClick={() => handleNavigation('hazard-map')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'hazard-map' ? '#3b82f6' : '#f1f5f9', color: currentView === 'hazard-map' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    🗺️ Hazard Map
                  </button>
                  <button onClick={() => handleNavigation('donations')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'donations' ? '#3b82f6' : '#f1f5f9', color: currentView === 'donations' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    💰 Donate
                  </button>
                </>
              )}
              
              {user.role === 'analyst' && (
                <>
                  <button onClick={() => handleNavigation('analytics')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'analytics' ? '#3b82f6' : '#f1f5f9', color: currentView === 'analytics' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    📊 Analytics
                  </button>
                  <button onClick={() => handleNavigation('social-media')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'social-media' ? '#3b82f6' : '#f1f5f9', color: currentView === 'social-media' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    📱 Social Media
                  </button>
                </>
              )}
              
              {user.role === 'official' && (
                <>
                  <button onClick={() => handleNavigation('emergency')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'emergency' ? '#3b82f6' : '#f1f5f9', color: currentView === 'emergency' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    🚨 Emergency Response
                  </button>
                  <button onClick={() => handleNavigation('volunteers')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'volunteers' ? '#3b82f6' : '#f1f5f9', color: currentView === 'volunteers' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    👥 Volunteers
                  </button>
                  <button onClick={() => handleNavigation('donation-management')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'donation-management' ? '#3b82f6' : '#f1f5f9', color: currentView === 'donation-management' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    💰 Manage Donations
                  </button>
                </>
              )}
              
              {(user.role === 'admin' || user.role === 'Admin') && (
                <>
                  <button onClick={() => handleNavigation('system-admin')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'system-admin' ? '#3b82f6' : '#f1f5f9', color: currentView === 'system-admin' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    ⚙️ System Admin
                  </button>
                  <button onClick={() => handleNavigation('user-management')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'user-management' ? '#3b82f6' : '#f1f5f9', color: currentView === 'user-management' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                    👤 Users
                  </button>
                </>
              )}
              
              <button onClick={() => handleNavigation('settings')} style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: currentView === 'settings' ? '#3b82f6' : '#f1f5f9', color: currentView === 'settings' ? 'white' : '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}>
                ⚙️ Settings
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {currentView === `${user.role}-dashboard` && (
              <div>
                <h2>Welcome to your {user.role} dashboard!</h2>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>Use the navigation on the left to access different features.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3>🌊 Ocean Hazard Monitoring</h3>
                    <p>Real-time monitoring and reporting platform for India's coastal regions.</p>
                  </div>
                  <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3>📊 Current Status</h3>
                    <p>System is operational. {user.role === 'citizen' ? 'Ready to receive reports.' : user.role === 'analyst' ? 'Analytics running.' : user.role === 'official' ? 'Emergency systems active.' : 'All systems monitored.'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {currentView !== `${user.role}-dashboard` && (
              <div>
                <h2>{currentView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                  This feature is being developed. The full functionality will be available soon.
                </p>
                <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3>🚧 Under Development</h3>
                  <p>This {currentView.replace('-', ' ')} feature is being built with the following capabilities:</p>
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {currentView === 'report-hazard' && (
                      <>
                        <li>Real-time hazard reporting with GPS location</li>
                        <li>Photo and video upload capability</li>
                        <li>Automated alert distribution</li>
                      </>
                    )}
                    {currentView === 'hazard-map' && (
                      <>
                        <li>Interactive map with hazard markers</li>
                        <li>Real-time updates and filtering</li>
                        <li>Historical data visualization</li>
                      </>
                    )}
                    {currentView === 'analytics' && (
                      <>
                        <li>Comprehensive data analysis dashboard</li>
                        <li>Trend analysis and predictions</li>
                        <li>Custom report generation</li>
                      </>
                    )}
                    {(currentView === 'social-media' || currentView === 'social_media') && (
                      <>
                        <li>Social media sentiment analysis</li>
                        <li>Real-time monitoring of platforms</li>
                        <li>Automated alert detection</li>
                      </>
                    )}
                    {currentView === 'donations' && (
                      <>
                        <li>Secure payment processing</li>
                        <li>Campaign management</li>
                        <li>Donor recognition system</li>
                      </>
                    )}
                    {currentView === 'volunteers' && (
                      <>
                        <li>Volunteer registration and management</li>
                        <li>Task assignment and tracking</li>
                        <li>Communication tools</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🌊 Taranga Ocean Hazard Monitor</h1>
      <p>Ocean Hazard Monitoring and Reporting Platform for India's Coastal Regions</p>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', maxWidth: '500px' }}>
        <h2>Welcome to the Login Page</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label><br />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '8px', width: '300px', marginTop: '5px' }} 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label><br />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '8px', width: '300px', marginTop: '5px' }} 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: isLoading ? '#ccc' : '#1976d2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Demo Accounts (Click to Use):</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => handleDemoLogin('admin@oceanhazard.com')} style={{ padding: '8px', textAlign: 'left', backgroundColor: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '4px', cursor: 'pointer' }}>
              👨‍💼 Admin: admin@oceanhazard.com
            </button>
            <button onClick={() => handleDemoLogin('analyst@oceanhazard.com')} style={{ padding: '8px', textAlign: 'left', backgroundColor: '#f3e5f5', border: '1px solid #ba68c8', borderRadius: '4px', cursor: 'pointer' }}>
              📊 Analyst: analyst@oceanhazard.com
            </button>
            <button onClick={() => handleDemoLogin('official@oceanhazard.com')} style={{ padding: '8px', textAlign: 'left', backgroundColor: '#e8f5e8', border: '1px solid #81c784', borderRadius: '4px', cursor: 'pointer' }}>
              🛡️ Official: official@oceanhazard.com
            </button>
            <button onClick={() => handleDemoLogin('citizen@oceanhazard.com')} style={{ padding: '8px', textAlign: 'left', backgroundColor: '#e1f5fe', border: '1px solid #4fc3f7', borderRadius: '4px', cursor: 'pointer' }}>
              👥 Citizen: citizen@oceanhazard.com
            </button>
          </div>
          <p style={{ marginTop: '10px', fontStyle: 'italic' }}><strong>Password for all: demo123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/*" element={<LoginApp />} />
      </Routes>
    </Router>
  );
}
