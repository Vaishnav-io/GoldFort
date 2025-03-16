import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize authentication state
    setLoading(false);
  }, [user]);
  
  // Context value to be provided
  const contextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
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