import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import * as userAPI from '../../api/userAPI';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaBriefcase, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  staffDetails: yup.object({
    bio: yup.string().optional(),
    specialties: yup.array().of(yup.string()),
  }),
});

const StaffProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      staffDetails: {
        bio: user?.staffDetails?.bio || '',
        specialties: user?.staffDetails?.specialties || [],
      },
    },
  });

  const specialties = watch('staffDetails.specialties');

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setValue('staffDetails.specialties', [...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index) => {
    const updated = specialties.filter((_, i) => i !== index);
    setValue('staffDetails.specialties', updated);
  };

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
              <FaUser className="text-4xl text-primary-brown" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-white opacity-90">{user?.staffDetails?.position}</p>
              <p className="text-white opacity-75 text-sm">Employee #{user?.staffDetails?.employeeNumber}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary-brown">
              Staff Profile
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

            {/* Department */}
            <div>
              <label className="label-primary">Department</label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={user?.staffDetails?.department || 'N/A'}
                  disabled
                  className="input-primary pl-10 bg-gray-100"
                />
              </div>
            </div>

            {/* Hire Date */}
            <div>
              <label className="label-primary">Hire Date</label>
              <input
                type="text"
                value={user?.staffDetails?.hireDate ? new Date(user.staffDetails.hireDate).toLocaleDateString() : 'N/A'}
                disabled
                className="input-primary bg-gray-100"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="label-primary">Bio</label>
            <textarea
              {...register('staffDetails.bio')}
              disabled={!isEditing}
              rows="4"
              className="input-primary"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Specialties */}
          <div className="mt-6">
            <label className="label-primary">Specialties</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {specialties?.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-secondary-beige rounded-full text-sm"
                >
                  <FaStar className="mr-1 text-accent-pink" size={12} />
                  {specialty}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="ml-2 text-error hover:text-opacity-80"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="input-primary flex-1"
                  placeholder="Add a specialty"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Commission Rates */}
          <div className="mt-6 p-4 bg-secondary-beige rounded-lg">
            <h3 className="font-semibold text-primary-brown mb-3">Commission Rates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-dark">Services</p>
                <p className="text-xl font-bold text-accent-pink">
                  {user?.staffDetails?.commissionRates?.services || 20}%
                </p>
              </div>
              <div>
                <p className="text-sm text-text-dark">Products</p>
                <p className="text-xl font-bold text-accent-pink">
                  {user?.staffDetails?.commissionRates?.products || 10}%
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffProfile;