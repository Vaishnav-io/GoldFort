// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user exists but is not verified
    if (user && !user.isVerified && location.pathname !== '/verify-otp') {
      // Redirect to verification page
      navigate('/verify-otp');
    }
    
    setLoading(false);
  }, [user, navigate, location]);
  
  // Context value to be provided
  const contextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isVerified: user?.isVerified || false,
    loading,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;