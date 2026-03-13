import React, { useState, useEffect } from 'react';
import * as appointmentAPI from '../../api/appointmentAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaCheckCircle, FaPlay } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AssignedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    date: null,
    status: 'all',
  });

  useEffect(() => {
    fetchAppointments();
  }, [pagination.page, filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (filters.date) {
        params.date = filters.date.toISOString().split('T')[0];
      }
      if (filters.status !== 'all') {
        params.status = filters.status;
      }

      const response = await appointmentAPI.getAssignedAppointments(params);
      setAppointments(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      setUpdating(appointmentId);
      await appointmentAPI.startAppointment(appointmentId);
      toast.success('Appointment started');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to start appointment');
    } finally {
      setUpdating(null);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      setUpdating(appointmentId);
      await appointmentAPI.completeAppointment(appointmentId);
      toast.success('Appointment completed');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to complete appointment');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      confirmed: 'bg-success',
      in_progress: 'bg-info',
      completed: 'bg-success',
      cancelled: 'bg-error',
      no_show: 'bg-error',
    };

    return (
      <span className={`badge ${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading && appointments.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        My Assigned Appointments
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-primary">Filter by Date</label>
            <DatePicker
              selected={filters.date}
              onChange={(date) => setFilters({ ...filters, date })}
              isClearable
              placeholderText="Select date"
              className="input-primary w-full"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label className="label-primary">Filter by Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-primary"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-primary-brown mb-2">
            No Appointments Found
          </h3>
          <p className="text-text-dark">
            {filters.date || filters.status !== 'all' 
              ? 'No appointments match your filters' 
              : 'You have no assigned appointments'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-primary-brown">
                        Appointment #{appointment.appointmentNumber}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-text-dark">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(appointment.appointmentDate)}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t border-border pt-4 mb-4">
                  <h4 className="font-semibold text-primary-brown mb-2">Customer Details:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    <p className="text-sm flex items-center">
                      <FaUser className="mr-2 text-gray-400" size={12} />
                      {appointment.customer?.firstName} {appointment.customer?.lastName}
                    </p>
                    {appointment.customer?.phone && (
                      <p className="text-sm flex items-center">
                        <FaPhone className="mr-2 text-gray-400" size={12} />
                        {appointment.customer.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="border-t border-border pt-4 mb-4">
                  <h4 className="font-semibold text-primary-brown mb-2">Services:</h4>
                  <div className="space-y-2">
                    {appointment.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{service.serviceName}</span>
                        <span className="font-semibold text-accent-pink">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {appointment.status === 'confirmed' && (
                  <div className="border-t border-border pt-4">
                    <button
                      onClick={() => handleStartAppointment(appointment._id)}
                      disabled={updating === appointment._id}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      {updating === appointment._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <FaPlay className="mr-2" size={12} />
                          Start Appointment
                        </>
                      )}
                    </button>
                  </div>
                )}

                {appointment.status === 'in_progress' && (
                  <div className="border-t border-border pt-4">
                    <button
                      onClick={() => handleCompleteAppointment(appointment._id)}
                      disabled={updating === appointment._id}
                      className="btn-success w-full flex items-center justify-center"
                    >
                      {updating === appointment._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Complete Appointment
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AssignedAppointments;