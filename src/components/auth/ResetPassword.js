import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaLock } from 'react-icons/fa';
import * as authAPI from '../../api/authAPI';
import { toast } from 'react-toastify';

const schema = yup.object({
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authAPI.resetPassword(token, data.password);
      setResetComplete(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <div className="text-center">
        <div className="bg-success bg-opacity-10 text-success p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Password Reset Complete!</h3>
          <p className="text-sm">
            Your password has been successfully reset. You'll be redirected to login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary-brown">Reset Password</h2>
        <p className="text-text-dark text-sm">Enter your new password below</p>
      </div>

      <div>
        <label className="label-primary">New Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            {...register('password')}
            className={`input-primary pl-10 ${errors.password ? 'input-error' : ''}`}
            placeholder="Enter new password"
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
          placeholder="Confirm new password"
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
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPassword;