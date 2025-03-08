'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  updateProfile: (user: User) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const checkTokenExpiration = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('トークンの検証中にエラーが発生しました:', error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      if (checkTokenExpiration(storedToken)) {
        setToken(storedToken);
        setUsername(storedUsername);
      }
    }
  }, []);

  const login = (newToken: string, newUsername: string) => {
    if (checkTokenExpiration(newToken)) {
      setToken(newToken);
      setUsername(newUsername);
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', newUsername);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  const isAuthenticated = () => {
    return !!token && checkTokenExpiration(token);
  };

  const updateProfile = (user: User) => {
    setUsername(user.username);
    localStorage.setItem('username', user.username);
  };

  const getToken = () => {
    if (token && checkTokenExpiration(token)) {
      return token;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      username, 
      login, 
      logout, 
      isAuthenticated, 
      updateProfile,
      getToken 
    }}>
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