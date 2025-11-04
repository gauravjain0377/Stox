import React, { createContext, useContext, useState, useEffect } from 'react';
import { FRONTEND_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Dashboard AuthContext: Checking for auth data...');
    
    // Check for auth data in URL parameters first (from frontend login)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUser = urlParams.get('user');
    const urlIsLoggedIn = urlParams.get('isLoggedIn');
    
    console.log('🔍 URL Parameters:', {
      hasToken: !!urlToken,
      hasUser: !!urlUser,
      isLoggedIn: urlIsLoggedIn,
      fullUrl: window.location.href
    });
    
    if (urlToken && urlUser && urlIsLoggedIn === 'true') {
      try {
        const userData = JSON.parse(urlUser);
        console.log('🔄 Setting auth data from URL parameters...');
        setToken(urlToken);
        setUser(userData);
        localStorage.setItem('token', urlToken);
        localStorage.setItem('user', urlUser);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Clean up URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        console.log('✅ Auth data loaded from URL parameters:', {
          user: userData,
          hasToken: !!urlToken
        });
        
        // Force a re-render to ensure state is updated
        setTimeout(() => {
          console.log('🔄 Auth state after URL processing:', { user: !!user, token: !!token });
        }, 50);
      } catch (error) {
        console.error('❌ Error parsing URL auth data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      }
    } else {
      // Check for existing auth in localStorage
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      console.log('🔍 LocalStorage check:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        isLoggedIn: isLoggedIn
      });
      
      if (storedToken && storedUser && isLoggedIn === 'true') {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          console.log('✅ Auth data loaded from localStorage');
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
        }
      } else {
        console.log('❌ No auth data found in URL or localStorage');
      }
    }
    
    // Set loading to false immediately after processing auth data
    // This prevents the black screen flash
    setLoading(false);
    console.log('🏁 AuthContext loading complete, user state:', { user: !!user, token: !!token });
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Allow updating and persisting minimal auth user fields after profile edit
  const updateAuthUser = (partialUser) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...partialUser };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    // Redirect to frontend home page using environment variable
    // Use replace instead of href for faster redirect
    window.location.replace(FRONTEND_URL || 'http://localhost:5173/');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    setUser,
    updateAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 