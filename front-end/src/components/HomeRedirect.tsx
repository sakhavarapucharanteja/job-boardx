// src/components/HomeRedirect.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null; // or spinner
  if (!user)   return <Navigate to="/login" replace />;
  return user.role === 'job_seeker'
    ? <Navigate to="/jobs" replace />
    : <Navigate to="/employer/jobs" replace />;
}
