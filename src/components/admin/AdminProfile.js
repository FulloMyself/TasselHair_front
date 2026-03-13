import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import * as userAPI from '../../api/userAPI';
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-pink to-primary-brown px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-4xl text-primary-brown" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-white opacity-90 capitalize">Administrator</p>
              <p className="text-white opacity-75 text-sm">Admin ID: {user?._id?.slice(-6)}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary-brown">
              Admin Profile
            </h2>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-secondary text-sm"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="label-primary">First Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  {...register('firstName')}
                  disabled={!isEditing}
                  className={`input-primary pl-10 ${errors.firstName ? 'input-error' : ''}`}
                />
              </div>
              {errors.firstName && (
                <p className="text-error text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="label-primary">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                disabled={!isEditing}
                className={`input-primary ${errors.lastName ? 'input-error' : ''}`}
              />
              {errors.lastName && (
                <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label-primary">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...register('email')}
                  disabled={!isEditing}
                  className={`input-primary pl-10 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="label-primary">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  {...register('phone')}
                  disabled={!isEditing}
                  className={`input-primary pl-10 ${errors.phone ? 'input-error' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-error text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Admin Details */}
          <div className="mt-6 p-4 bg-secondary-beige rounded-lg">
            <h3 className="font-semibold text-primary-brown mb-3">Admin Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-dark">Admin Level</p>
                <p className="font-semibold capitalize">{user?.adminDetails?.adminLevel || 'Administrator'}</p>
              </div>
              <div>
                <p className="text-sm text-text-dark">Member Since</p>
                <p className="font-semibold">{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-text-dark">Last Login</p>
                <p className="font-semibold">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;