import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/lib/gameSystem';
import { getCurrentUser, setCurrentUser, updateCurrentUser } from '@/lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: UserProfile) => {
    setCurrentUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    const updated = updateCurrentUser(updates);
    if (updated) {
      setUser(updated);
    }
  };

  const refreshUser = () => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
