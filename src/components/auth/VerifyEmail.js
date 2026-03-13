import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as authAPI from '../../api/authAPI';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const VerifyEmail = () => {
  const { token } = useParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authAPI.verifyEmail(token);
        setSuccess(true);
        toast.success('Email verified successfully!');
      } catch (error) {
        setError(error.response?.data?.error || 'Verification failed');
        toast.error('Email verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (verifying) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-text-dark">Verifying your email...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="bg-success bg-opacity-10 text-success p-6 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
          <p className="mb-6">Your email has been successfully verified.</p>
          <Link to="/login" className="btn-primary inline-block">
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="bg-error bg-opacity-10 text-error p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
        <p className="mb-6">{error || 'Unable to verify your email'}</p>
        <Link to="/" className="btn-primary inline-block">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;