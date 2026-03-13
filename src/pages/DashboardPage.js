import React from 'react';
import { useAuth } from '../hooks/useAuth';
import CustomerDashboard from '../components/customer/CustomerDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Render dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
};

export default DashboardPage;