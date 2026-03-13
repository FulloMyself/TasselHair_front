import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { isValidPhone } from '../../utils/validators';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .test('phone', 'Phone number must be 10 digits', isValidPhone)
    .required('Phone number is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  terms: yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-primary">First Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              {...register('firstName')}
              className={`input-primary pl-10 ${errors.firstName ? 'input-error' : ''}`}
              placeholder="John"
              disabled={loading}
            />
          </div>
          {errors.firstName && (
            <p className="text-error text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="label-primary">Last Name</label>
          <input
            type="text"
            {...register('lastName')}
            className={`input-primary ${errors.lastName ? 'input-error' : ''}`}
            placeholder="Doe"
            disabled={loading}
          />
          {errors.lastName && (
            <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label-primary">Email Address</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            {...register('email')}
            className={`input-primary pl-10 ${errors.email ? 'input-error' : ''}`}
            placeholder="john.doe@example.com"
            disabled={loading}
          />
        </div>
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="label-primary">Phone Number</label>
        <div className="relative">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            {...register('phone')}
            className={`input-primary pl-10 ${errors.phone ? 'input-error' : ''}`}
            placeholder="0712345678"
            disabled={loading}
          />
        </div>
        {errors.phone && (
          <p className="text-error text-sm mt-1">{errors.phone.message}</p>
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
            placeholder="Create a password"
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
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number
        </p>
      </div>

      <div>
        <label className="label-primary">Confirm Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`input-primary pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirm your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-brown"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('terms')}
            className="mt-1 form-checkbox h-4 w-4 text-accent-pink rounded"
            disabled={loading}
          />
          <span className="text-sm text-text-dark">
            I agree to the{' '}
            <Link to="/terms" className="text-accent-pink hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-accent-pink hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p className="text-error text-sm mt-1">{errors.terms.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
      </button>

      <p className="text-center text-text-dark">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-pink hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;