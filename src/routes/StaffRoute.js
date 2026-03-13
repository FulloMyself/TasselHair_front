import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StaffRoute = () => {
  const { isAuthenticated, isStaff, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated && isStaff ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default StaffRoute;