import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Checkout from '../components/shop/Checkout';
import { Navigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/checkout' }} />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/shop" />;
  }

  return (
    <div className="container-custom py-12">
      <Checkout />
    </div>
  );
};

export default CheckoutPage;