import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEnvelope } from 'react-icons/fa';
import * as authAPI from '../../api/authAPI';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authAPI.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="bg-success bg-opacity-10 text-success p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Check Your Email</h3>
          <p className="text-sm">
            We've sent a password reset link to your email address. 
            Please check your inbox and follow the instructions.
          </p>
        </div>
        <Link to="/login" className="text-accent-pink hover:underline">
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary-brown">Forgot Password?</h2>
        <p className="text-text-dark text-sm">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div>
        <label className="label-primary">Email</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            {...register('email')}
            className={`input-primary pl-10 ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className="text-center text-text-dark">
        Remember your password?{' '}
        <Link to="/login" className="text-accent-pink hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default ForgotPassword;