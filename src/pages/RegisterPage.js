import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
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
              placeholder="First name"
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
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
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

      <div>
        <label className="label-primary">Phone Number</label>
        <div className="relative">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            {...register('phone')}
            className={`input-primary pl-10 ${errors.phone ? 'input-error' : ''}`}
            placeholder="10 digit phone number"
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
            type="password"
            {...register('password')}
            className={`input-primary pl-10 ${errors.password ? 'input-error' : ''}`}
            placeholder="Create a password"
          />
        </div>
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="label-primary">Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword')}
          className={`input-primary ${errors.confirmPassword ? 'input-error' : ''}`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>

      <p className="text-center text-text-dark">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-pink hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;