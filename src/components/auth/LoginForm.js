import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demos = {
      customer: { email: 'customer@demo.com', password: 'password123' },
      staff: { email: 'staff@demo.com', password: 'password123' },
      admin: { email: 'admin@demo.com', password: 'password123' },
    };
    const demo = demos[role];
    if (demo) {
      login(demo.email, demo.password);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="label-primary">Email Address</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            {...register('email')}
            className={`input-primary pl-10 ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="label-primary">Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`input-primary pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
            placeholder="Enter your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-brown"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link to="/forgot-password" className="text-sm text-accent-pink hover:underline">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
      </button>

      {/* Demo Login Buttons */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-text-dark">Demo Login</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleDemoLogin('customer')}
          className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-secondary-beige transition"
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => handleDemoLogin('staff')}
          className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-secondary-beige transition"
        >
          Staff
        </button>
        <button
          type="button"
          onClick={() => handleDemoLogin('admin')}
          className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-secondary-beige transition"
        >
          Admin
        </button>
      </div>

      <p className="text-center text-text-dark">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent-pink hover:underline font-medium">
          Create Account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;