import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/my-orders';
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const orderId = searchParams.get('order_id');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <FaCheckCircle className="text-6xl text-success mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-primary-brown mb-2">
          Payment Successful!
        </h1>

        <p className="text-text-dark mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderId && (
          <p className="text-sm bg-secondary-beige p-3 rounded-lg mb-6">
            Order Number: <span className="font-semibold">{orderId}</span>
          </p>
        )}

        <p className="text-sm text-gray-500 mb-6">
          You will receive an email confirmation shortly.
          Redirecting to your orders in {countdown} seconds...
        </p>

        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="btn-primary w-full flex items-center justify-center"
          >
            <FaShoppingBag className="mr-2" />
            View My Orders
          </Link>

          <Link
            to="/"
            className="btn-outline w-full flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;