import React, { useState, useEffect } from 'react';
import * as appointmentAPI from '../../api/appointmentAPI';
import * as userAPI from '../../api/userAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaUserTie,
  FaFilter
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: 'all',
    fromDate: null,
    toDate: null,
    staffId: 'all',
    search: '',
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [assignData, setAssignData] = useState({
    staffId: '',
    serviceIndex: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchStaff();
  }, [pagination.page, filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.status === 'all') delete params.status;
      if (filters.staffId === 'all') delete params.staffId;
      if (filters.fromDate) params.fromDate = filters.fromDate.toISOString().split('T')[0];
      if (filters.toDate) params.toDate = filters.toDate.toISOString().split('T')[0];
      
      const response = await appointmentAPI.getAllAppointments(params);
      setAppointments(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await userAPI.getAllUsers({ role: 'staff', isActive: true });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleAssignStaff = async () => {
    if (!assignData.staffId) {
      toast.error('Please select a staff member');
      return;
    }

    try {
      setActionLoading(true);
      await appointmentAPI.assignStaff(selectedAppointment._id, {
        staffId: assignData.staffId,
        serviceIndex: assignData.serviceIndex,
      });
      toast.success('Staff assigned successfully');
      setModalOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign staff');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setActionLoading(true);
      await appointmentAPI.updateAppointmentStatus(selectedAppointment._id, { status });
      toast.success(`Appointment marked as ${status}`);
      setModalOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setActionLoading(false);
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        Appointment Management
      </h1>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-accent-pink mb-4 hover:underline"
      >
        <FaFilter className="mr-2" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="label-primary">Search</label>
              <SearchBar
                onSearch={(term) => setFilters({ ...filters, search: term })}
                placeholder="Search by customer..."
                delay={500}
              />
            </div>
            <div>
              <label className="label-primary">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
            <div>
              <label className="label-primary">Staff</label>
              <select
                value={filters.staffId}
                onChange={(e) => setFilters({ ...filters, staffId: e.target.value })}
                className="input-primary"
              >
                <option value="all">All Staff</option>
                {staff.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-primary">From Date</label>
              <DatePicker
                selected={filters.fromDate}
                onChange={(date) => setFilters({ ...filters, fromDate: date })}
                className="input-primary w-full"
                placeholderText="Start date"
                dateFormat="yyyy-MM-dd"
                isClearable
              />
            </div>
            <div>
              <label className="label-primary">To Date</label>
              <DatePicker
                selected={filters.toDate}
                onChange={(date) => setFilters({ ...filters, toDate: date })}
                className="input-primary w-full"
                placeholderText="End date"
                dateFormat="yyyy-MM-dd"
                minDate={filters.fromDate}
                isClearable
              />
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
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

            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-secondary-beige p-3 rounded-lg">
                <h4 className="font-semibold text-primary-brown mb-2">Customer Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-gray-500" size={12} />
                    {appointment.customer?.firstName} {appointment.customer?.lastName}
                  </p>
                  {appointment.customer?.email && (
                    <p className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-500" size={12} />
                      {appointment.customer.email}
                    </p>
                  )}
                  {appointment.customer?.phone && (
                    <p className="flex items-center">
                      <FaPhone className="mr-2 text-gray-500" size={12} />
                      {appointment.customer.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="bg-secondary-beige p-3 rounded-lg">
                <h4 className="font-semibold text-primary-brown mb-2">Services</h4>
                <div className="space-y-1">
                  {appointment.services.map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{service.serviceName}</span>
                      <span className="font-semibold">{formatCurrency(service.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Staff Assignment */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary-brown mb-2">Assigned Staff</h4>
                  {appointment.services.some(s => s.assignedStaff) ? (
                    <div className="space-y-1">
                      {appointment.services.map((service, index) => (
                        service.assignedStaff && (
                          <p key={index} className="text-sm flex items-center">
                            <FaUserTie className="mr-2 text-gray-500" size={12} />
                            {service.serviceName}: {service.assignedStaff.firstName} {service.assignedStaff.lastName}
                          </p>
                        )
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No staff assigned yet</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setAssignData({ staffId: '', serviceIndex: null });
                    setModalType('assign');
                    setModalOpen(true);
                  }}
                  className="btn-secondary text-sm"
                >
                  Assign Staff
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border pt-4 mt-4 flex justify-end space-x-2">
              {appointment.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    handleUpdateStatus('confirmed');
                  }}
                  className="btn-success text-sm"
                >
                  Confirm
                </button>
              )}
              {appointment.status === 'confirmed' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    handleUpdateStatus('in_progress');
                  }}
                  className="btn-primary text-sm"
                >
                  <FaPlay className="mr-1" size={10} />
                  Start
                </button>
              )}
              {appointment.status === 'in_progress' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    handleUpdateStatus('completed');
                  }}
                  className="btn-success text-sm"
                >
                  <FaCheckCircle className="mr-1" size={10} />
                  Complete
                </button>
              )}
              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    handleUpdateStatus('cancelled');
                  }}
                  className="btn-outline text-sm text-error"
                >
                  <FaTimesCircle className="mr-1" size={10} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-text-dark">No appointments found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        </div>
      )}

      {/* Assign Staff Modal */}
      <Modal
        isOpen={modalOpen && modalType === 'assign'}
        onClose={() => setModalOpen(false)}
        title="Assign Staff"
      >
        <div className="space-y-4">
          <div>
            <label className="label-primary">Select Service (Optional)</label>
            <select
              value={assignData.serviceIndex || ''}
              onChange={(e) => setAssignData({ 
                ...assignData, 
                serviceIndex: e.target.value ? parseInt(e.target.value) : null 
              })}
              className="input-primary"
            >
              <option value="">Assign to all services</option>
              {selectedAppointment?.services.map((service, index) => (
                <option key={index} value={index}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-primary">Select Staff Member</label>
            <select
              value={assignData.staffId}
              onChange={(e) => setAssignData({ ...assignData, staffId: e.target.value })}
              className="input-primary"
              required
            >
              <option value="">Choose staff</option>
              {staff.map(s => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName} - {s.staffDetails?.position}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignStaff}
              disabled={actionLoading}
              className="btn-primary"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Assign Staff'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentManagement;