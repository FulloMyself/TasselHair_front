import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import * as orderAPI from '../../api/orderAPI';
import { formatCurrency } from '../../utils/formatters';
import { FaTruck, FaStore, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  deliveryOption: yup.string().oneOf(['collect', 'delivery']).required('Please select delivery option'),
  shippingAddress: yup.object().when('deliveryOption', {
    is: 'delivery',
    then: yup.object({
      recipientName: yup.string().required('Recipient name is required'),
      street: yup.string().required('Street address is required'),
      suburb: yup.string().required('Suburb is required'),
      city: yup.string().required('City is required'),
      province: yup.string().required('Province is required'),
      postalCode: yup.string().required('Postal code is required'),
      phone: yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    }),
  }),
  notes: yup.string().optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, deliveryFee, total, voucher, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      deliveryOption: 'collect',
      shippingAddress: {
        recipientName: user ? `${user.firstName} ${user.lastName}` : '',
        phone: user?.phone || '',
      },
    },
  });

  const deliveryOption = watch('deliveryOption');

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const orderData = {
        orderType: 'product',
        items: cartItems.map(item => ({
          itemType: 'product',
          itemId: item._id,
          quantity: item.quantity,
          variant: item.selectedVariant,
        })),
        deliveryOption: data.deliveryOption,
        shippingAddress: data.deliveryOption === 'delivery' ? data.shippingAddress : null,
        voucherCode: voucher?.code,
        notes: data.notes,
      };

      const response = await orderAPI.createOrder(orderData);

      toast.success('Order created successfully!');

      // Clear cart
      clearCart();

      // Handle payment
      if (response.data.paymentData) {
        // Redirect to PayFast
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.paymentData.url;
        
        Object.entries(response.data.paymentData.data).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      } else {
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/shop');
    return null;
  }

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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Delivery Option */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-primary-brown mb-4">
                Delivery Option
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-accent-pink transition">
                  <input
                    type="radio"
                    {...register('deliveryOption')}
                    value="collect"
                    className="mr-3"
                  />
                  <FaStore className="text-2xl text-primary-brown mr-3" />
                  <div>
                    <p className="font-semibold">Collect in Store</p>
                    <p className="text-sm text-gray-500">Free • 55 True North Road, Mulbarton</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-accent-pink transition">
                  <input
                    type="radio"
                    {...register('deliveryOption')}
                    value="delivery"
                    className="mr-3"
                  />
                  <FaTruck className="text-2xl text-primary-brown mr-3" />
                  <div>
                    <p className="font-semibold">Home Delivery</p>
                    <p className="text-sm text-gray-500">{formatCurrency(deliveryFee)} • 2-3 business days</p>
                  </div>
                </label>
              </div>
              {errors.deliveryOption && (
                <p className="text-error text-sm mt-2">{errors.deliveryOption.message}</p>
              )}
            </div>

            {/* Delivery Address */}
            {deliveryOption === 'delivery' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-primary-brown mb-4">
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="label-primary">Recipient Name</label>
                    <input
                      type="text"
                      {...register('shippingAddress.recipientName')}
                      className={`input-primary ${errors.shippingAddress?.recipientName ? 'input-error' : ''}`}
                    />
                    {errors.shippingAddress?.recipientName && (
                      <p className="text-error text-sm mt-1">{errors.shippingAddress.recipientName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label-primary">Street Address</label>
                    <input
                      type="text"
                      {...register('shippingAddress.street')}
                      className={`input-primary ${errors.shippingAddress?.street ? 'input-error' : ''}`}
                    />
                    {errors.shippingAddress?.street && (
                      <p className="text-error text-sm mt-1">{errors.shippingAddress.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label-primary">Suburb</label>
                    <input
                      type="text"
                      {...register('shippingAddress.suburb')}
                      className={`input-primary ${errors.shippingAddress?.suburb ? 'input-error' : ''}`}
                    />
                    {errors.shippingAddress?.suburb && (
                      <p className="text-error text-sm mt-1">{errors.shippingAddress.suburb.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-primary">City</label>
                      <input
                        type="text"
                        {...register('shippingAddress.city')}
                        className={`input-primary ${errors.shippingAddress?.city ? 'input-error' : ''}`}
                      />
                      {errors.shippingAddress?.city && (
                        <p className="text-error text-sm mt-1">{errors.shippingAddress.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="label-primary">Postal Code</label>
                      <input
                        type="text"
                        {...register('shippingAddress.postalCode')}
                        className={`input-primary ${errors.shippingAddress?.postalCode ? 'input-error' : ''}`}
                      />
                      {errors.shippingAddress?.postalCode && (
                        <p className="text-error text-sm mt-1">{errors.shippingAddress.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label-primary">Province</label>
                    <select
                      {...register('shippingAddress.province')}
                      className={`input-primary ${errors.shippingAddress?.province ? 'input-error' : ''}`}
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                    {errors.shippingAddress?.province && (
                      <p className="text-error text-sm mt-1">{errors.shippingAddress.province.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label-primary">Phone Number</label>
                    <input
                      type="tel"
                      {...register('shippingAddress.phone')}
                      className={`input-primary ${errors.shippingAddress?.phone ? 'input-error' : ''}`}
                    />
                    {errors.shippingAddress?.phone && (
                      <p className="text-error text-sm mt-1">{errors.shippingAddress.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-primary-brown mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                {...register('notes')}
                rows="3"
                className="input-primary"
                placeholder="Any special instructions for your order..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FaLock className="mr-2" />
                  Place Order & Pay
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-primary-brown mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex space-x-3">
                  <img
                    src={item.images?.[0] || '/images/product-placeholder.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary-brown">
                      {formatCurrency((item.salePrice || item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-dark">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {voucher && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount</span>
                  <span>-{formatCurrency(subtotal - (total - deliveryFee))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-dark">Delivery</span>
                <span className="font-semibold">
                  {deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-primary-brown text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 flex items-center">
              <FaLock className="mr-1" />
              Secure payment powered by PayFast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;