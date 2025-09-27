import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Waves, ShieldAlert, BarChartBig, ShieldCheck, Users } from 'lucide-react';

const SimpleLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loginLoading, setLoginLoading] = useState(false);

  const demoAccounts = [
    { type: 'Admin', email: 'admin@oceanhazard.com', description: 'Full system access & management', icon: <ShieldAlert className="w-6 h-6 text-red-500" />, password: 'demo123' },
    { type: 'Data Analyst', email: 'analyst@oceanhazard.com', description: 'Analytics, reports & social media', icon: <BarChartBig className="w-6 h-6 text-blue-500" />, password: 'demo123' },
    { type: 'Official', email: 'official@oceanhazard.com', description: 'Emergency response & coordination', icon: <ShieldCheck className="w-6 h-6 text-green-500" />, password: 'demo123' },
    { type: 'Citizen', email: 'citizen@oceanhazard.com', description: 'Report hazards & receive alerts', icon: <Users className="w-6 h-6 text-orange-500" />, password: 'demo123' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }
    await performLogin({ email: formData.email, password: formData.password });
  };

  const handleDemoLogin = (account) => {
    setFormData({ email: account.email, password: account.password, rememberMe: false });
    performLogin(account, true);
  };

  const performLogin = async (credentials, isDemo = false) => {
    setLoginLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        toast.success(isDemo ? `Logged in as ${credentials.type}` : `Welcome ${data.user.fullName}!`);
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
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 border border-border rounded-lg shadow-sm overflow-hidden">
          
          {/* Left Side: Login Form */}
          <div className="p-8 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Waves className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-foreground">Taranga Platform</h1>
                <p className="text-muted-foreground">Ocean Hazard Monitoring System</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input
                  type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="e.g., citizen@oceanhazard.com"
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  type="password" id="password" name="password" value={formData.password} onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="rounded border-border" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
              </div>

              <button type="submit" disabled={loginLoading} className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {loginLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account? <a href="#" onClick={() => toast.info('Registration coming soon!')} className="text-primary hover:underline">Sign Up</a>
            </div>
          </div>

          {/* Right Side: Demo Accounts */}
          <div className="bg-muted/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-medium text-foreground">Quick Access Demo</h2>
              <p className="text-muted-foreground text-sm">Click any role to log in instantly</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demoAccounts.map((account) => (
                <div key={account.type} onClick={() => handleDemoLogin(account)} className="bg-background p-4 rounded-lg border border-border cursor-pointer hover:bg-accent/50 transition-colors group">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">{account.icon}</div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary">{account.type}</h3>
                      <p className="text-sm text-muted-foreground">{account.description}</p>
                    </div>
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
