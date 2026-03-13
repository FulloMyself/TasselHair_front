import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaShoppingCart, FaHome } from 'react-icons/fa';

const PaymentCancel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <FaTimesCircle className="text-6xl text-error mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-primary-brown mb-2">
          Payment Cancelled
        </h1>

        <p className="text-text-dark mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="space-y-3">
          <Link
            to="/checkout"
            className="btn-primary w-full flex items-center justify-center"
          >
            <FaShoppingCart className="mr-2" />
            Try Again
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

export default PaymentCancel;