import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as leaveAPI from '../../api/leaveAPI';
import { LEAVE_TYPES } from '../../utils/constants';
import { FaCalendarAlt, FaFileAlt, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  leaveType: yup.string().required('Please select leave type'),
  startDate: yup.date()
    .min(new Date(), 'Start date must be in the future')
    .required('Start date is required'),
  endDate: yup.date()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  reason: yup.string()
    .required('Please provide a reason for leave')
    .min(10, 'Reason must be at least 10 characters'),
});

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await leaveAPI.applyForLeave(data);
      toast.success('Leave application submitted successfully');
      navigate('/staff/leave');
    } catch (error) {
      console.error('Error applying for leave:', error);
      toast.error(error.response?.data?.error || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary-brown mb-6">
          Apply for Leave
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Leave Type */}
          <div>
            <label className="label-primary">Leave Type</label>
            <select
              {...register('leaveType')}
              className={`input-primary ${errors.leaveType ? 'input-error' : ''}`}
            >
              <option value="">Select leave type</option>
              {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.leaveType && (
              <p className="text-error text-sm mt-1">{errors.leaveType.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-primary">Start Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setValue('startDate', date)}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className={`input-primary pl-10 w-full ${errors.startDate ? 'input-error' : ''}`}
                  placeholderText="Select start date"
                />
              </div>
              {errors.startDate && (
                <p className="text-error text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="label-primary">End Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setValue('endDate', date)}
                  minDate={startDate}
                  dateFormat="yyyy-MM-dd"
                  className={`input-primary pl-10 w-full ${errors.endDate ? 'input-error' : ''}`}
                  placeholderText="Select end date"
                />
              </div>
              {errors.endDate && (
                <p className="text-error text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Days Count */}
          {startDate && endDate && (
            <div className="bg-secondary-beige p-4 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-primary-brown">Total Days:</span>
              <span className="text-2xl font-bold text-accent-pink">
                {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="label-primary">Reason for Leave</label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
              <textarea
                {...register('reason')}
                rows="5"
                className={`input-primary pl-10 ${errors.reason ? 'input-error' : ''}`}
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </div>
            {errors.reason && (
              <p className="text-error text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important Information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Leave requests are subject to manager approval</li>
                <li>Please submit at least 2 weeks in advance for annual leave</li>
                <li>Sick leave may require a doctor's certificate for absences longer than 2 days</li>
                <li>You will be notified via email once your request is reviewed</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/staff/leave')}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;