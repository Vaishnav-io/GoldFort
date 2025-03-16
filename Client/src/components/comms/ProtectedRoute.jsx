// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, isAuthenticated, isAdmin, isVerified } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If not verified, redirect to verification page
  if (!isVerified) {
    return <Navigate to="/verify-otp" replace />;
  }
  
  // If admin route but user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If all checks pass, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;