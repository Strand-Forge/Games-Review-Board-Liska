'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from './api';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing auth token on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await userAPI.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await userAPI.login(credentials);
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const data = await userAPI.register(userData);
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}