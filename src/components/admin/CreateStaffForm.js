import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as userAPI from '../../api/userAPI';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaBriefcase, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

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
  position: yup.string().required('Position is required'),
  department: yup.string().required('Department is required'),
  hireDate: yup.date().required('Hire date is required'),
  commissionRates: yup.object({
    services: yup.number().min(0).max(100).default(20),
    products: yup.number().min(0).max(100).default(10),
  }),
  specialties: yup.array().of(yup.string()),
  bio: yup.string().optional(),
});

const CreateStaffForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      department: 'beauty',
      commissionRates: {
        services: 20,
        products: 10,
      },
      specialties: [],
    },
  });

  const specialties = watch('specialties');

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setValue('specialties', [...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index) => {
    const updated = specialties.filter((_, i) => i !== index);
    setValue('specialties', updated);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await userAPI.createStaff(data);
      toast.success('Staff account created successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error(error.response?.data?.error || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary-brown mb-6">
          Create Staff Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="label-primary">First Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  {...register('firstName')}
                  className={`input-primary pl-10 ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="Enter first name"
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
                className={`input-primary ${errors.lastName ? 'input-error' : ''}`}
                placeholder="Enter last name"
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
                  className={`input-primary pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter email address"
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
                  className={`input-primary pl-10 ${errors.phone ? 'input-error' : ''}`}
                  placeholder="10 digit phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-error text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label-primary">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  {...register('password')}
                  className={`input-primary pl-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create password"
                />
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="label-primary">Position</label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  {...register('position')}
                  className={`input-primary pl-10 ${errors.position ? 'input-error' : ''}`}
                  placeholder="e.g. Senior Stylist"
                />
              </div>
              {errors.position && (
                <p className="text-error text-sm mt-1">{errors.position.message}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="label-primary">Department</label>
              <select
                {...register('department')}
                className={`input-primary ${errors.department ? 'input-error' : ''}`}
              >
                <option value="hair">Hair</option>
                <option value="beauty">Beauty</option>
                <option value="both">Both</option>
              </select>
              {errors.department && (
                <p className="text-error text-sm mt-1">{errors.department.message}</p>
              )}
            </div>

            {/* Hire Date */}
            <div>
              <label className="label-primary">Hire Date</label>
              <input
                type="date"
                {...register('hireDate')}
                className={`input-primary ${errors.hireDate ? 'input-error' : ''}`}
              />
              {errors.hireDate && (
                <p className="text-error text-sm mt-1">{errors.hireDate.message}</p>
              )}
            </div>
          </div>

          {/* Commission Rates */}
          <div className="bg-secondary-beige p-4 rounded-lg">
            <h3 className="font-semibold text-primary-brown mb-3">Commission Rates</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-primary">Services (%)</label>
                <input
                  type="number"
                  {...register('commissionRates.services')}
                  min="0"
                  max="100"
                  className="input-primary"
                />
              </div>
              <div>
                <label className="label-primary">Products (%)</label>
                <input
                  type="number"
                  {...register('commissionRates.products')}
                  min="0"
                  max="100"
                  className="input-primary"
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="label-primary">Specialties</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {specialties?.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-secondary-beige rounded-full text-sm"
                >
                  <FaStar className="mr-1 text-accent-pink" size={12} />
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="ml-2 text-error hover:text-opacity-80"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="input-primary flex-1"
                placeholder="Add a specialty (e.g. Color Specialist)"
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
          </div>

          {/* Bio */}
          <div>
            <label className="label-primary">Bio (Optional)</label>
            <textarea
              {...register('bio')}
              rows="4"
              className="input-primary"
              placeholder="Tell us about the staff member..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Staff Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffForm;