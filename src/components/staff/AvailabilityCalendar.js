import React, { useState, useEffect } from 'react';
import * as userAPI from '../../api/userAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const defaultHours = {
  start: '09:00',
  end: '17:00',
};

const AvailabilityCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const staffAvailability = response.data.staffDetails?.availability || {};
      
      // Initialize with defaults if not set
      const initialized = {};
      daysOfWeek.forEach(day => {
        initialized[day] = staffAvailability[day] || {
          available: day !== 'sunday',
          start: defaultHours.start,
          end: defaultHours.end,
        };
      });
      
      setAvailability(initialized);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day]?.available,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userAPI.updateAvailability({ availability });
      toast.success('Availability updated successfully');
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchAvailability();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary-brown mb-6">
          Set Your Availability
        </h1>

        <div className="space-y-4 mb-8">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className={`border rounded-lg p-4 transition ${
                availability[day]?.available
                  ? 'border-accent-pink bg-accent-pink bg-opacity-5'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleDay(day)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                      availability[day]?.available
                        ? 'bg-accent-pink text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {availability[day]?.available ? <FaCheck /> : <FaTimes />}
                  </button>
                  <h3 className="text-lg font-semibold capitalize text-primary-brown">
                    {day}
                  </h3>
                </div>

                {availability[day]?.available && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-2" />
                      <input
                        type="time"
                        value={availability[day]?.start || defaultHours.start}
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        className="border border-border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={availability[day]?.end || defaultHours.end}
                      onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      className="border border-border rounded px-2 py-1 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary-beige p-4 rounded-lg mb-8">
          <h3 className="font-semibold text-primary-brown mb-2">Business Hours</h3>
          <p className="text-sm text-text-dark">
            Our standard business hours are Monday - Saturday: 9:00 AM - 5:00 PM.
            Your availability will be used to schedule appointments within these hours.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="btn-outline"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? <LoadingSpinner size="sm" /> : 'Save Availability'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;