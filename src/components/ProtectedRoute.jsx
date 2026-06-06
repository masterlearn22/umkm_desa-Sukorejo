import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific permission is required, check if user has it
  if (requiredPermission && user?.permissions) {
    if (!user.permissions[requiredPermission]) {
      // Redirect to home if user doesn't have required permission
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
