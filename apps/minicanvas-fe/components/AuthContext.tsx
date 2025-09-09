'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { HTTP_BACKEND } from '../app/config';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await fetch(`${HTTP_BACKEND}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setToken(storedToken);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${HTTP_BACKEND}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        await checkAuth(); // This will set the user data
      } else {
        throw new Error(data.message || 'Invalid email or password');
      }
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${HTTP_BACKEND}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        await checkAuth(); // This will set the user data
      } else {
        throw new Error(data.message || 'Unable to create account');
      }
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}