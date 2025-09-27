import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SimpleLoginPage from './pages/SimpleLoginPage';
import './styles/globals.css';

// Modern futuristic dashboard component
const FuturisticDashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = React.useState(`${user.role}-dashboard`);

  return (
    <div className="min-h-screen relative">
      {/* Animated particles background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Taranga Ocean Monitor</h1>
                <p className="text-sm text-slate-400">Advanced Hazard Detection System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.fullName}</p>
                <p className="text-xs text-cyan-400 uppercase tracking-wide">{user.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="btn-glass px-4 py-2 text-sm font-medium hover:bg-red-500/20 hover:border-red-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 glass border-r border-white/10 p-6">
          <div className="space-y-2">
            <NavButton 
              active={currentView === `${user.role}-dashboard`}
              onClick={() => setCurrentView(`${user.role}-dashboard`)}
              icon="🏠"
              label="Dashboard"
            />
            
            {user.role === 'citizen' && (
              <>
                <NavButton onClick={() => setCurrentView('report-hazard')} icon="📝" label="Report Hazard" />
                <NavButton onClick={() => setCurrentView('hazard-map')} icon="🗺️" label="Hazard Map" />
                <NavButton onClick={() => setCurrentView('donations')} icon="💰" label="Donate" />
              </>
            )}
            
            {user.role === 'analyst' && (
              <>
                <NavButton onClick={() => setCurrentView('analytics')} icon="📊" label="Analytics" />
                <NavButton onClick={() => setCurrentView('social-media')} icon="📱" label="Social Media" />
                <NavButton onClick={() => setCurrentView('reports')} icon="📋" label="Reports" />
              </>
            )}
            
            {user.role === 'official' && (
              <>
                <NavButton onClick={() => setCurrentView('emergency')} icon="🚨" label="Emergency Response" />
                <NavButton onClick={() => setCurrentView('volunteers')} icon="👥" label="Volunteers" />
                <NavButton onClick={() => setCurrentView('resources')} icon="📦" label="Resources" />
              </>
            )}
            
            {(user.role === 'admin' || user.role === 'Admin') && (
              <>
                <NavButton onClick={() => setCurrentView('system-admin')} icon="⚙️" label="System Admin" />
                <NavButton onClick={() => setCurrentView('user-management')} icon="👤" label="Users" />
                <NavButton onClick={() => setCurrentView('analytics')} icon="📊" label="Analytics" />
              </>
            )}
            
            <NavButton onClick={() => setCurrentView('settings')} icon="⚙️" label="Settings" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <DashboardContent currentView={currentView} user={user} />
          </div>
        </main>
      </div>
    </div>
  );
};

// Navigation Button Component
const NavButton: React.FC<{ active?: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300' 
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

// Dashboard Content Component
const DashboardContent: React.FC<{ currentView: string; user: any }> = ({ currentView, user }) => {
  if (currentView === `${user.role}-dashboard`) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.fullName}!</h2>
          <p className="text-slate-400">Your {user.role} dashboard is ready for action.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Active Alerts" 
            value="12" 
            icon="🚨" 
            trend="+2 from yesterday"
            color="text-red-400"
          />
          <StatCard 
            title="Reports Today" 
            value="47" 
            icon="📊" 
            trend="+15% from last week"
            color="text-cyan-400"
          />
          <StatCard 
            title="System Status" 
            value="Operational" 
            icon="✅" 
            trend="All systems green"
            color="text-green-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { time: '2 min ago', event: 'New hazard report submitted', type: 'info' },
                { time: '15 min ago', event: 'Alert sent to coastal regions', type: 'warning' },
                { time: '1 hour ago', event: 'System backup completed', type: 'success' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'info' ? 'bg-blue-400' : 
                    item.type === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white text-sm">{item.event}</p>
                    <p className="text-slate-400 text-xs">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {user.role === 'citizen' && (
                <>
                  <ActionButton icon="📝" label="Report Hazard" />
                  <ActionButton icon="🗺️" label="View Map" />
                  <ActionButton icon="💰" label="Donate" />
                  <ActionButton icon="👥" label="Volunteer" />
                </>
              )}
              {user.role === 'analyst' && (
                <>
                  <ActionButton icon="📊" label="Generate Report" />
                  <ActionButton icon="📱" label="Monitor Social" />
                  <ActionButton icon="🔍" label="Analyze Data" />
                  <ActionButton icon="📈" label="View Trends" />
                </>
              )}
              {user.role === 'official' && (
                <>
                  <ActionButton icon="🚨" label="Create Alert" />
                  <ActionButton icon="📞" label="Contact Teams" />
                  <ActionButton icon="📦" label="Deploy Resources" />
                  <ActionButton icon="📋" label="Review Reports" />
                </>
              )}
              {(user.role === 'admin' || user.role === 'Admin') && (
                <>
                  <ActionButton icon="⚙️" label="System Config" />
                  <ActionButton icon="👤" label="Manage Users" />
                  <ActionButton icon="🛡️" label="Security" />
                  <ActionButton icon="📊" label="Analytics" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="glass-card text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {currentView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h2>
        <p className="text-slate-400 mb-6">This feature is being developed with advanced capabilities.</p>
        <div className="text-left max-w-md mx-auto">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Coming Soon:</h4>
          <ul className="space-y-2 text-slate-300">
            {getFeatureList(currentView).map((feature, i) => (
              <li key={i} className="flex items-center space-x-2">
                <span className="text-cyan-400">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Utility components
const StatCard: React.FC<{ title: string; value: string; icon: string; trend: string; color: string }> = ({ title, value, icon, trend, color }) => (
  <div className="glass-card card-hover">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-300 font-medium">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
    <p className="text-slate-400 text-sm">{trend}</p>
  </div>
);

const ActionButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="btn-glass p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform">
    <span className="text-2xl">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const getFeatureList = (view: string) => {
  const features: Record<string, string[]> = {
    'report-hazard': ['Real-time GPS location', 'Photo/video uploads', 'AI-powered categorization'],
    'hazard-map': ['Interactive 3D visualization', 'Real-time updates', 'Predictive modeling'],
    'analytics': ['Advanced data visualization', 'Machine learning insights', 'Custom reports'],
    'social-media': ['Sentiment analysis', 'Real-time monitoring', 'Automated alerts'],
    'emergency': ['Automated response protocols', 'Resource optimization', 'Team coordination'],
    'volunteers': ['Skill-based matching', 'Real-time tracking', 'Performance analytics'],
  };
  return features[view] || ['Enhanced functionality', 'Real-time updates', 'Advanced analytics'];
};

// Main App Component
const App: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-slate-400">Initializing Taranga System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--background-card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <FuturisticDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <SimpleLoginPage />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;