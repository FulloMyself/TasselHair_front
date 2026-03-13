import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../hooks/useAuth';
import * as serviceAPI from '../../api/serviceAPI';
import * as appointmentAPI from '../../api/appointmentAPI';
import { FaPlus, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

const schema = yup.object({
  services: yup.array().of(
    yup.object({
      serviceId: yup.string().required('Please select a service'),
    })
  ).min(1, 'At least one service is required'),
  appointmentDate: yup.date()
    .min(new Date(), 'Appointment date must be in the future')
    .required('Appointment date is required'),
  startTime: yup.string().required('Please select a time slot'),
  customerNotes: yup.string().optional(),
});

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      services: [{ serviceId: '' }],
      customerNotes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  const watchServices = watch('services');
  const watchDate = watch('appointmentDate');

  // Fetch available services
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch available time slots when date or services change
  useEffect(() => {
    if (watchDate && selectedServices.length > 0) {
      fetchAvailableSlots();
    }
  }, [watchDate, selectedServices]);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAllServices({ isActive: true });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setFetchingSlots(true);
      const serviceIds = selectedServices.map(s => s.serviceId).join(',');
      const response = await appointmentAPI.getAvailableSlots({
        date: watchDate.toISOString().split('T')[0],
        serviceIds,
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setFetchingSlots(false);
    }
  };

  // Update selected services when form changes
  useEffect(() => {
    const validServices = watchServices?.filter(s => s.serviceId) || [];
    setSelectedServices(validServices);
  }, [watchServices]);

  const calculateTotal = () => {
    return selectedServices.reduce((total, item) => {
      const service = services.find(s => s._id === item.serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const calculateDuration = () => {
    return selectedServices.reduce((total, item) => {
      const service = services.find(s => s._id === item.serviceId);
      return total + (service?.duration || 0);
    }, 0);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const appointmentData = {
        services: data.services.map(s => s.serviceId),
        appointmentDate: data.appointmentDate.toISOString().split('T')[0],
        startTime: data.startTime,
        customerNotes: data.customerNotes,
      };

      const response = await appointmentAPI.createAppointment(appointmentData);
      
      toast.success('Appointment created successfully!');
      
      // Redirect to payment
      if (response.data.paymentData) {
        // Handle PayFast redirect
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
        navigate('/my-appointments');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error.response?.data?.error || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-primary-brown mb-6">
          Book Your Appointment
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Services Selection */}
          <div>
            <label className="label-primary">Select Services</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <select
                  {...register(`services.${index}.serviceId`)}
                  className="input-primary flex-1"
                >
                  <option value="">Choose a service</option>
                  {services.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.name} - {formatCurrency(service.price)} ({service.duration} mins)
                    </option>
                  ))}
                </select>
                
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-3 text-error hover:bg-error hover:text-white rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => append({ serviceId: '' })}
              className="mt-2 text-accent-pink hover:text-opacity-80 transition flex items-center"
            >
              <FaPlus className="mr-1" /> Add Another Service
            </button>
            
            {errors.services && (
              <p className="text-error text-sm mt-1">{errors.services.message}</p>
            )}
          </div>

          {/* Service Summary */}
          {selectedServices.length > 0 && (
            <div className="bg-secondary-beige p-4 rounded-lg">
              <h3 className="font-semibold text-primary-brown mb-2">Service Summary</h3>
              <div className="space-y-2">
                {selectedServices.map((item, index) => {
                  const service = services.find(s => s._id === item.serviceId);
                  return service ? (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span>{formatCurrency(service.price)} ({service.duration} mins)</span>
                    </div>
                  ) : null;
                })}
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Duration:</span>
                    <span>{calculateDuration()} minutes</span>
                  </div>
                  <div className="mt-2 p-2 bg-accent-pink bg-opacity-10 rounded">
                    <p className="text-sm text-accent-pink">
                      <strong>Deposit required:</strong> 50% ({formatCurrency(calculateTotal() * 0.5)}) to confirm booking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="label-primary">Select Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <DatePicker
                selected={watchDate}
                onChange={(date) => setValue('appointmentDate', date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="input-primary pl-10 w-full"
                placeholderText="Choose appointment date"
              />
            </div>
            {errors.appointmentDate && (
              <p className="text-error text-sm mt-1">{errors.appointmentDate.message}</p>
            )}
          </div>

          {/* Time Slots */}
          {watchDate && (
            <div>
              <label className="label-primary">Select Time</label>
              {fetchingSlots ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setValue('startTime', slot)}
                      className={`p-2 border rounded-lg flex items-center justify-center transition ${
                        watch('startTime') === slot
                          ? 'bg-accent-pink text-white border-accent-pink'
                          : 'hover:border-accent-pink'
                      }`}
                    >
                      <FaClock className="mr-1" size={12} />
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No available slots for this date
                </p>
              )}
              {errors.startTime && (
                <p className="text-error text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="label-primary">Additional Notes (Optional)</label>
            <textarea
              {...register('customerNotes')}
              rows="3"
              className="input-primary"
              placeholder="Any special requests or information for your appointment..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || selectedServices.length === 0 || !watch('startTime')}
            className="btn-primary w-full"
          >
            {loading ? 'Creating Appointment...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;