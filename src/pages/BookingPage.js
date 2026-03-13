import React from 'react';
import { useAuth } from '../hooks/useAuth';
import BookAppointment from '../components/customer/BookAppointment';
import { Navigate } from 'react-router-dom';

const BookingPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/book' }} />;
  }

  if (user?.role !== 'customer') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container-custom py-12">
      <BookAppointment />
    </div>
  );
};

export default BookingPage;