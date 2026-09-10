import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kalasetu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('kalasetu_token') || '');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState('buyer'); // 'buyer' or 'artisan'

  useEffect(() => {
    if (token) {
      localStorage.setItem('kalasetu_token', token);
      api.getProfile(token)
        .then(res => {
          if (res.success && res.user) {
            setUser(prev => ({ ...prev, ...res.user }));
            localStorage.setItem('kalasetu_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    } else {
      localStorage.removeItem('kalasetu_token');
      localStorage.removeItem('kalasetu_user');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token) {
      setToken(res.token);
      setAuthModalOpen(false);
      return res;
    }
    throw new Error('No token returned');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      // Auto-login with the new user credentials
      await login(userData.email, userData.password);
    }
    return res;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('kalasetu_token');
    localStorage.removeItem('kalasetu_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        authModalOpen,
        setAuthModalOpen,
        authRole,
        setAuthRole,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
