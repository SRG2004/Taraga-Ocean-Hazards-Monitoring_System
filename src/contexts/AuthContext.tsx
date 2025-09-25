import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userInfo: any) => Promise<void>;
  updateProfile: (profileInfo: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Try to load user from local storage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials: any) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'citizen@example.com') {
          const userData = { email: credentials.email, role: 'citizen' };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else if (credentials.email === 'officer@example.com') {
          const userData = { email: credentials.email, role: 'officer' };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else if (credentials.email === 'analyst@example.com') {
          const userData = { email: credentials.email, role: 'analyst' };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userInfo: any) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const userData = { email: userInfo.email, role: 'citizen' }; // Default role
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve();
      }, 500);
    });
  };

  const updateProfile = async (profileInfo: any) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...profileInfo };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve();
      }, 500);
    });
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Simulate API call - in a real app, you'd validate the current password
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Password changed');
        resolve();
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
