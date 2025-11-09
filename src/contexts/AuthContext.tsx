/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../lib/auth-api';
import type { User, LoginResponse } from '../lib/auth-api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const ACCESS_TOKEN_KEY = 'aira_access_token';
const REFRESH_TOKEN_KEY = 'aira_refresh_token';
const USER_KEY = 'aira_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedAccessToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          // Verify token is still valid by fetching current user
          const { data, error } = await authAPI.getCurrentUser(storedAccessToken);

          if (error || !data) {
            // Token expired, try to refresh
            if (storedRefreshToken) {
              const refreshed = await refreshAccessToken();
              if (!refreshed) {
                // Refresh failed, clear auth
                clearAuth();
              }
            } else {
              clearAuth();
            }
          } else {
            // Update user with latest data
            setUser(data);
            localStorage.setItem(USER_KEY, JSON.stringify(data));
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          clearAuth();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const saveAuth = (loginResponse: LoginResponse) => {
    setUser(loginResponse.user);
    setAccessToken(loginResponse.access_token);
    setRefreshToken(loginResponse.refresh_token);

    localStorage.setItem(ACCESS_TOKEN_KEY, loginResponse.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginResponse.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.user));
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authAPI.login({ email, password });

      if (error || !data) {
        return { success: false, error: error || 'Login failed' };
      }

      saveAuth(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const signup = async (signupData: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
  }) => {
    try {
      const { data, error } = await authAPI.signup({
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
        full_name: signupData.fullName,
      });

      if (error || !data) {
        return { success: false, error: error || 'Signup failed' };
      }

      // Don't auto-login, user needs to verify email first
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken && accessToken) {
        await authAPI.logout(refreshToken, accessToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const { data, error } = await authAPI.refreshToken(refreshToken);

      if (error || !data) {
        clearAuth();
        return false;
      }

      setAccessToken(data.access_token);
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuth();
      return false;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    signup,
    logout,
    refreshAccessToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
