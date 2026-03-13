import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import * as userAPI from '../../api/userAPI';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  dateOfBirth: yup.date().nullable(),
  gender: yup.string().oneOf(['male', 'female', 'other', 'prefer-not-to-say']),
  address: yup.object({
    street: yup.string(),
    suburb: yup.string(),
    city: yup.string(),
    province: yup.string(),
    postalCode: yup.string(),
  }),
});

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || 'prefer-not-to-say',
      address: {
        street: user?.address?.street || '',
        suburb: user?.address?.suburb || '',
        city: user?.address?.city || '',
        province: user?.address?.province || '',
        postalCode: user?.address?.postalCode || '',
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
  ];

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
              <FaUser className="text-4xl text-primary-brown" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-white opacity-90 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary-brown">
              Personal Information
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
                  value={user?.email}
                  disabled
                  className="input-primary pl-10 bg-gray-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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

            {/* Date of Birth */}
            <div>
              <label className="label-primary">Date of Birth</label>
              <div className="relative">
                <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  disabled={!isEditing}
                  className="input-primary pl-10"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="label-primary">Gender</label>
              <select
                {...register('gender')}
                disabled={!isEditing}
                className="input-primary"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">
              Address Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label-primary">Street Address</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('address.street')}
                    disabled={!isEditing}
                    className="input-primary pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label-primary">Suburb</label>
                <input
                  type="text"
                  {...register('address.suburb')}
                  disabled={!isEditing}
                  className="input-primary"
                />
              </div>

              <div>
                <label className="label-primary">City</label>
                <input
                  type="text"
                  {...register('address.city')}
                  disabled={!isEditing}
                  className="input-primary"
                />
              </div>

              <div>
                <label className="label-primary">Province</label>
                <select
                  {...register('address.province')}
                  disabled={!isEditing}
                  className="input-primary"
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-primary">Postal Code</label>
                <input
                  type="text"
                  {...register('address.postalCode')}
                  disabled={!isEditing}
                  className="input-primary"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;