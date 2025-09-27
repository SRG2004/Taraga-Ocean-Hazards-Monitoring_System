import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SimpleLoginPage from './pages/SimpleLoginPage.jsx';
import { MinimalHazardMap } from './components/MinimalHazardMap.jsx';
import { CitizenDashboard } from './components/dashboards/CitizenDashboard.jsx';
import { OfficialDashboard } from './components/dashboards/OfficialDashboard.jsx';
import { AnalystDashboard } from './components/dashboards/AnalystDashboard.jsx';
import { AdminDashboard } from './components/dashboards/AdminDashboard.jsx';
import { ReportHazardForm } from './components/ReportHazardForm.jsx';
import { SettingsPage } from './components/SettingsPage.jsx';
import { DonationsInterface } from './components/DonationsInterface.jsx';
import { SocialMediaMonitoring } from './components/SocialMediaMonitoring.jsx';
import { Waves, LayoutDashboard, PlusCircle, Map, Heart, BarChart3, Rss, FileText, Siren, Users, Box, Settings } from 'lucide-react';
import './styles/globals.css';

// Modern futuristic dashboard component
const FuturisticDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = React.useState(`${user.role}-dashboard`);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Waves className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-foreground">Taranga Ocean Monitor</h1>
                <p className="text-sm text-muted-foreground">Advanced Hazard Detection System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                <p className={`text-xs text-muted-foreground uppercase tracking-wide`}>{user.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="btn-secondary px-4 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 md:w-72 lg:w-80 bg-white border-r border-border p-4 sm:p-6 flex-shrink-0">
          <div className="space-y-2">
            <NavButton 
              active={currentView === `${user.role}-dashboard`}
              onClick={() => setCurrentView(`${user.role}-dashboard`)}
              icon={<LayoutDashboard />}
              label="Dashboard"
            />
            
            {user.role === 'citizen' && (
              <>
                <NavButton onClick={() => setCurrentView('report-hazard')} icon={<PlusCircle />} label="Report Hazard" />
                <NavButton onClick={() => setCurrentView('hazard-map')} icon={<Map />} label="Hazard Map" />
                <NavButton onClick={() => setCurrentView('donations')} icon={<Heart />} label="Donate" />
              </>
            )}
            
            {user.role === 'analyst' && (
              <>
                <NavButton onClick={() => setCurrentView('analytics')} icon={<BarChart3 />} label="Analytics" />
                <NavButton onClick={() => setCurrentView('social-media')} icon={<Rss />} label="Social Media" />
                <NavButton onClick={() => setCurrentView('reports')} icon={<FileText />} label="Reports" />
              </>
            )}
            
            {user.role === 'official' && (
              <>
                <NavButton onClick={() => setCurrentView('emergency')} icon={<Siren />} label="Emergency Response" />
                <NavButton onClick={() => setCurrentView('volunteers')} icon={<Users />} label="Volunteers" />
                <NavButton onClick={() => setCurrentView('resources')} icon={<Box />} label="Resources" />
              </>
            )}
            
            {(user.role === 'admin' || user.role === 'Admin') && (
              <>
                <NavButton onClick={() => setCurrentView('system-admin')} icon={<Settings />} label="System Admin" />
                <NavButton onClick={() => setCurrentView('user-management')} icon={<Users />} label="Users" />
                <NavButton onClick={() => setCurrentView('analytics')} icon={<BarChart3 />} label="Analytics" />
              </>
            )}
            
            <NavButton onClick={() => setCurrentView('settings')} icon={<Settings />} label="Settings" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-muted/50 overflow-x-auto">
          <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-full">
              <DashboardContent currentView={currentView} user={user} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Navigation Button Component
const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
      active 
        ? 'bg-accent text-primary' 
        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
    }`}
  >
    <div className="h-5 w-5">{icon}</div>
    <span className="font-medium text-base truncate">{label}</span>
  </button>
);

// Dashboard Content Component
const DashboardContent = ({ currentView, user }) => {
  if (currentView === `${user.role}-dashboard`) {
    // Render role-specific dashboard components
    switch (user.role) {
      case 'citizen':
        return <CitizenDashboard user={user} />;
      case 'official':
        return <OfficialDashboard user={user} />;
      case 'analyst':
        return <AnalystDashboard user={user} />;
      case 'admin':
      case 'Admin':
        return <AdminDashboard user={user} />;
      default:
        return <CitizenDashboard user={user} />;
    }
  }

  // Specific views based on user role and currentView
  if (currentView === 'hazard-map') {
    return (
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-2xl font-medium text-foreground mb-2">Interactive Hazard Map</h2>
        <p className="text-muted-foreground mb-4">Real-time visualization of ocean hazards across India's coastline.</p>
        <MinimalHazardMap height="600px" />
      </div>
    );
  }

  if (currentView === 'report-hazard') {
    return <ReportHazardForm onClose={() => {}} onSubmit={(report) => console.log('Report submitted:', report)} />;
  }

  if (currentView === 'donations') {
    return <DonationsInterface user={user} />;
  }

  if (currentView === 'settings') {
    return <SettingsPage user={user} />;
  }

  if (currentView === 'social-media') {
    return <SocialMediaMonitoring user={user} />;
  }

  return (
    <div>
      <div className="bg-white border border-border rounded-lg p-6 text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-medium text-foreground mb-4">
          {currentView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h2>
        <p className="text-muted-foreground mb-6">This feature is being developed with advanced capabilities.</p>
        <div className="text-left max-w-md mx-auto">
          <h4 className="text-lg font-medium text-primary mb-3">Coming Soon:</h4>
          <ul className="space-y-2 text-foreground">
            {getFeatureList(currentView).map((feature, i) => (
              <li key={i} className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};


const getFeatureList = (view) => {
  const features = {
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
const App = () => {
  const [user, setUser] = React.useState(null);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-muted-foreground">Initializing Taranga System...</p>
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
              background: 'var(--background)',
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
