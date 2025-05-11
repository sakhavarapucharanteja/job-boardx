// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, User } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: User['role'][];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;  // or spinner
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // unauthorized role
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
