import React, { useState, useEffect } from 'react';
import * as leaveAPI from '../../api/leaveAPI';
import * as userAPI from '../../api/userAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Modal from '../common/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from '../../utils/formatters';
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaUserTie,
  FaFileAlt,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: 'pending',
    staffId: 'all',
    fromDate: null,
    toDate: null,
    search: '',
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchLeaveRequests();
    fetchStaff();
    fetchAnalytics();
  }, [pagination.page, filters]);

  const fetchLeaveRequests = async () => {
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
      
      const response = await leaveAPI.getAllLeave(params);
      setLeaveRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
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

  const fetchAnalytics = async () => {
    try {
      const response = await leaveAPI.getLeaveAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching leave analytics:', error);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await leaveAPI.approveLeave(selectedRequest._id, reviewNotes);
      toast.success('Leave request approved');
      setModalOpen(false);
      fetchLeaveRequests();
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve leave');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await leaveAPI.rejectLeave(selectedRequest._id, reviewNotes);
      toast.success('Leave request rejected');
      setModalOpen(false);
      fetchLeaveRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject leave');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-error',
      cancelled: 'bg-gray-500',
    };

    return (
      <span className={`badge ${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getLeaveTypeLabel = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading && leaveRequests.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        Leave Management
      </h1>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-text-dark">Total Applications</p>
            <p className="text-2xl font-bold text-primary-brown">
              {analytics.summary?.totalApplications || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-text-dark">Pending</p>
            <p className="text-2xl font-bold text-warning">
              {analytics.summary?.pendingApplications || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-text-dark">Approved</p>
            <p className="text-2xl font-bold text-success">
              {analytics.summary?.approvedApplications || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-text-dark">Total Days</p>
            <p className="text-2xl font-bold text-accent-pink">
              {analytics.summary?.totalDaysApproved || 0}
            </p>
          </div>
        </div>
      )}

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
                placeholder="Search by staff..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="label-primary">Staff Member</label>
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

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Application #</th>
                <th>Staff Member</th>
                <th>Leave Type</th>
                <th>Period</th>
                <th>Days</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request._id}>
                  <td className="font-mono text-sm font-medium">
                    {request.applicationNumber}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary-beige rounded-full flex items-center justify-center">
                        <FaUserTie size={14} className="text-primary-brown" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-brown">
                          {request.staffMember?.firstName} {request.staffMember?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{request.staffMember?.staffDetails?.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="capitalize">{getLeaveTypeLabel(request.leaveType)}</td>
                  <td>
                    <div className="text-sm">
                      <p>{formatDate(request.startDate)}</p>
                      <p className="text-xs text-gray-500">to {formatDate(request.endDate)}</p>
                    </div>
                  </td>
                  <td className="text-center font-semibold">{request.numberOfDays}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <div className="text-sm">
                      <p>{formatDate(request.createdAt)}</p>
                    </div>
                  </td>
                  <td>
                    {request.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setModalType('approve');
                            setModalOpen(true);
                          }}
                          className="p-2 text-success hover:bg-success hover:bg-opacity-10 rounded-lg transition"
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setModalType('reject');
                            setModalOpen(true);
                          }}
                          className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition"
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setModalType('view');
                          setModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <FaFileAlt />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaveRequests.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No leave requests found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-border">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
            />
          </div>
        )}
      </div>

      {/* Approve/Reject Modal */}
      <Modal
        isOpen={modalOpen && (modalType === 'approve' || modalType === 'reject')}
        onClose={() => setModalOpen(false)}
        title={modalType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
      >
        <div className="space-y-4">
          {selectedRequest && (
            <>
              <div className="bg-secondary-beige p-4 rounded-lg">
                <p className="font-medium text-primary-brown">
                  {selectedRequest.staffMember?.firstName} {selectedRequest.staffMember?.lastName}
                </p>
                <p className="text-sm text-text-dark">
                  {getLeaveTypeLabel(selectedRequest.leaveType)} • {selectedRequest.numberOfDays} days
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                </p>
              </div>

              <div>
                <label className="label-primary">Reason for Leave</label>
                <p className="text-text-dark bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
              </div>

              <div>
                <label className="label-primary">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows="3"
                  className="input-primary"
                  placeholder={modalType === 'approve' ? 'Add approval notes (optional)' : 'Please provide a reason for rejection'}
                />
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
                  onClick={modalType === 'approve' ? handleApprove : handleReject}
                  disabled={actionLoading}
                  className={modalType === 'approve' ? 'btn-success' : 'btn-error'}
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : (modalType === 'approve' ? 'Approve' : 'Reject')}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={modalOpen && modalType === 'view'}
        onClose={() => setModalOpen(false)}
        title="Leave Request Details"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Application #</p>
                <p className="font-medium">{selectedRequest.applicationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{getStatusBadge(selectedRequest.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <p className="capitalize">{getLeaveTypeLabel(selectedRequest.leaveType)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Days</p>
                <p className="font-semibold">{selectedRequest.numberOfDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p>{formatDate(selectedRequest.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p>{formatDate(selectedRequest.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p>{formatDate(selectedRequest.createdAt)}</p>
              </div>
              {selectedRequest.reviewedBy && (
                <div>
                  <p className="text-sm text-gray-500">Reviewed By</p>
                  <p>{selectedRequest.reviewedBy?.firstName} {selectedRequest.reviewedBy?.lastName}</p>
                </div>
              )}
              {selectedRequest.reviewDate && (
                <div>
                  <p className="text-sm text-gray-500">Review Date</p>
                  <p>{formatDate(selectedRequest.reviewDate)}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Reason for Leave</p>
              <p className="bg-secondary-beige p-3 rounded-lg">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.reviewNotes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Review Notes</p>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedRequest.reviewNotes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveManagement;