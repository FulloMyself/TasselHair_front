import React from 'react';
import { useAuth } from '../hooks/useAuth';
import CustomerProfile from '../components/customer/CustomerProfile';
import StaffProfile from '../components/staff/StaffProfile';
import AdminProfile from '../components/admin/AdminProfile';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Render profile based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminProfile />;
    case 'staff':
      return <StaffProfile />;
    case 'customer':
    default:
      return <CustomerProfile />;
  }
};

export default ProfilePage;