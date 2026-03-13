import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as appointmentAPI from '../../api/appointmentAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, [pagination.page, filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await appointmentAPI.getMyAppointments(params);
      setAppointments(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      await appointmentAPI.cancelAppointment(selectedAppointment._id, cancelReason);
      toast.success('Appointment cancelled successfully');
      setCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">My Appointments</h1>
        <Link to="/book" className="btn-primary">
          Book New Appointment
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition ${
              filter === status
                ? 'bg-accent-pink text-white'
                : 'bg-white text-text-dark hover:bg-secondary-beige'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-primary-brown mb-2">
            No Appointments Found
          </h3>
          <p className="text-text-dark mb-4">
            You haven't booked any appointments yet.
          </p>
          <Link to="/book" className="btn-primary inline-block">
            Book Your First Appointment
          </Link>
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
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-pink">
                      {formatCurrency(appointment.totalAmount)}
                    </p>
                    {appointment.depositPaid ? (
                      <p className="text-sm text-success">Deposit paid</p>
                    ) : (
                      <p className="text-sm text-warning">
                        Deposit: {formatCurrency(appointment.depositAmount)} due
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
                        <span className="font-semibold">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff Assignment */}
                {appointment.services.some(s => s.assignedStaff) && (
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-primary-brown mb-2">Assigned Staff:</h4>
                    <div className="space-y-1">
                      {appointment.services.map((service, index) => (
                        service.assignedStaff && (
                          <p key={index} className="text-sm flex items-center">
                            <FaUser className="mr-2 text-gray-400" size={12} />
                            {service.serviceName}: {service.assignedStaff.firstName} {service.assignedStaff.lastName}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                  <div className="border-t border-border pt-4 flex justify-end space-x-2">
                    {!appointment.depositPaid && (
                      <button
                        onClick={() => {/* Handle payment */}}
                        className="btn-primary text-sm"
                      >
                        Pay Deposit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setCancelModal(true);
                      }}
                      className="btn-outline text-sm"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                ) : null}
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

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal}
        onClose={() => {
          setCancelModal(false);
          setSelectedAppointment(null);
          setCancelReason('');
        }}
        title="Cancel Appointment"
      >
        <div className="space-y-4">
          <p className="text-text-dark">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please tell us why you're cancelling..."
            className="input-primary"
            rows="3"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleCancelAppointment}
              disabled={cancelling}
              className="btn-primary flex-1"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
            <button
              onClick={() => {
                setCancelModal(false);
                setSelectedAppointment(null);
                setCancelReason('');
              }}
              className="btn-outline flex-1"
            >
              Keep Appointment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyAppointments;