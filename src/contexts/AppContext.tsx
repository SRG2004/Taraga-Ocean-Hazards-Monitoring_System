import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

interface AppContextType {
  user: any;
  reports: any[];
  donations: any[];
  volunteers: any[];
  loadReports: () => void;
  loadDonations: () => void;
  loadVolunteers: () => void;
  processDonation: (donation: any) => Promise<void>;
  registerVolunteer: (volunteer: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const AppProviderInternal: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  const loadReports = () => {
    // Simulate API call
    const mockReports = [
      { id: 1, hazardType: 'Flood', location: { latitude: 34.05, longitude: -118.24 }, description: 'Street flooding in downtown LA' },
      { id: 2, hazardType: 'Wildfire', location: { latitude: 34.15, longitude: -118.44 }, description: 'Brush fire near the hills' },
    ];
    setReports(mockReports);
  };

  const loadDonations = () => {
    // Simulate API call
    const mockDonations = [
      { id: 1, amount: 100, name: 'Jane Doe', email: 'jane@example.com', date: '2023-10-27' },
      { id: 2, amount: 50, name: 'John Smith', email: 'john@example.com', date: '2023-10-26' },
    ];
    setDonations(mockDonations);
  };

  const loadVolunteers = () => {
    // Simulate API call
    const mockVolunteers = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', skills: 'First Aid, CPR' },
      { id: 2, name: 'Bob Williams', email: 'bob@example.com', skills: 'Logistics' },
    ];
    setVolunteers(mockVolunteers);
  };

  const processDonation = async (donation: any) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setDonations([...donations, { ...donation, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
        resolve();
      }, 500);
    });
  };

  const registerVolunteer = async (volunteer: any) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setVolunteers([...volunteers, { ...volunteer, id: Date.now() }]);
        resolve();
      }, 500);
    });
  };

  useEffect(() => {
    if (user) {
      // Load data based on user role
      loadReports();
      if (user.role === 'officer') {
        loadDonations();
        loadVolunteers();
      }
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, reports, donations, volunteers, loadReports, loadDonations, loadVolunteers, processDonation, registerVolunteer }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <AuthProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </AuthProvider>
);
