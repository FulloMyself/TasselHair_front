import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import * as voucherAPI from '../../api/voucherAPI';
import { formatCurrency } from '../../utils/formatters';
import { FaGift, FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  value: yup.number()
    .min(50, 'Minimum gift value is R50')
    .max(5000, 'Maximum gift value is R5000')
    .required('Please enter a gift value'),
  recipientName: yup.string().required('Recipient name is required'),
  recipientEmail: yup.string().email('Invalid email').required('Recipient email is required'),
  recipientPhone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Recipient phone is required'),
  personalMessage: yup.string().max(500, 'Message must be less than 500 characters'),
  deliveryDate: yup.date().min(new Date(), 'Delivery date must be in the future'),
});

const PurchaseGift = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      value: 500,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const watchValue = watch('value');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await voucherAPI.purchaseGiftVoucher(data);
      toast.success('Gift voucher purchased successfully!');
      navigate('/my-vouchers');
    } catch (error) {
      console.error('Error purchasing gift:', error);
      toast.error(error.response?.data?.error || 'Failed to purchase gift voucher');
    } finally {
      setLoading(false);
    }
  };

  const presetValues = [100, 250, 500, 1000];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <FaGift className="text-3xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary-brown">Purchase Gift Voucher</h1>
          <p className="text-text-dark">Give the gift of beauty and wellness</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  step >= i
                    ? 'bg-accent-pink text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i}
              </div>
              <p className={`text-sm ${step >= i ? 'text-primary-brown' : 'text-gray-400'}`}>
                {i === 1 ? 'Choose Amount' : 'Recipient Details'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 ? (
            /* Step 1: Choose Amount */
            <div className="space-y-6">
              <div>
                <label className="label-primary">Select Amount</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {presetValues.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => register('value').onChange({ target: { value } })}
                      className={`p-3 border rounded-lg text-center transition ${
                        watchValue === value
                          ? 'border-accent-pink bg-accent-pink text-white'
                          : 'border-border hover:border-accent-pink'
                      }`}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  {...register('value')}
                  className={`input-primary ${errors.value ? 'input-error' : ''}`}
                  placeholder="Or enter custom amount"
                />
                {errors.value && (
                  <p className="text-error text-sm mt-1">{errors.value.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Recipient Details */
            <div className="space-y-6">
              <div className="bg-secondary-beige p-4 rounded-lg mb-4">
                <p className="text-center">
                  <span className="font-semibold">Gift Amount:</span>{' '}
                  <span className="text-accent-pink font-bold text-xl">
                    {formatCurrency(watchValue)}
                  </span>
                </p>
              </div>

              <div>
                <label className="label-primary">Recipient Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('recipientName')}
                    className={`input-primary pl-10 ${errors.recipientName ? 'input-error' : ''}`}
                    placeholder="Enter recipient's full name"
                  />
                </div>
                {errors.recipientName && (
                  <p className="text-error text-sm mt-1">{errors.recipientName.message}</p>
                )}
              </div>

              <div>
                <label className="label-primary">Recipient Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register('recipientEmail')}
                    className={`input-primary pl-10 ${errors.recipientEmail ? 'input-error' : ''}`}
                    placeholder="Enter recipient's email"
                  />
                </div>
                {errors.recipientEmail && (
                  <p className="text-error text-sm mt-1">{errors.recipientEmail.message}</p>
                )}
              </div>

              <div>
                <label className="label-primary">Recipient Phone</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register('recipientPhone')}
                    className={`input-primary pl-10 ${errors.recipientPhone ? 'input-error' : ''}`}
                    placeholder="Enter recipient's phone"
                  />
                </div>
                {errors.recipientPhone && (
                  <p className="text-error text-sm mt-1">{errors.recipientPhone.message}</p>
                )}
              </div>

              <div>
                <label className="label-primary">Personal Message (Optional)</label>
                <div className="relative">
                  <FaComment className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    {...register('personalMessage')}
                    rows="4"
                    className={`input-primary pl-10 ${errors.personalMessage ? 'input-error' : ''}`}
                    placeholder="Write a personal message..."
                  />
                </div>
                {errors.personalMessage && (
                  <p className="text-error text-sm mt-1">{errors.personalMessage.message}</p>
                )}
              </div>

              <div>
                <label className="label-primary">Delivery Date</label>
                <input
                  type="date"
                  {...register('deliveryDate')}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input-primary ${errors.deliveryDate ? 'input-error' : ''}`}
                />
                {errors.deliveryDate && (
                  <p className="text-error text-sm mt-1">{errors.deliveryDate.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Purchase Gift Voucher'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PurchaseGift;