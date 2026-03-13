import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as leaveAPI from '../../api/leaveAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/formatters';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LeaveRequests = () => {
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaveRequests();
  }, [pagination.page, filter]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filter !== 'all') {
        params.status = filter;
      }
      
      const response = await leaveAPI.getMyLeave(params);
      setLeaveRequests(response.data.applications);
      setLeaveBalance(response.data.balance);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning', icon: FaClock },
      approved: { color: 'bg-success', icon: FaCheckCircle },
      rejected: { color: 'bg-error', icon: FaTimesCircle },
      cancelled: { color: 'bg-gray-500', icon: FaTimesCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`badge ${config.color} text-white`}>
        <Icon className="mr-1" size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && leaveRequests.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-brown">
          My Leave Requests
        </h1>
        <Link to="/staff/leave/apply" className="btn-primary flex items-center">
          <FaPlus className="mr-2" size={14} />
          Apply for Leave
        </Link>
      </div>

      {/* Leave Balance */}
      {leaveBalance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(leaveBalance).map(([type, days]) => (
            <div key={type} className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-text-dark capitalize">{type}</p>
              <p className="text-3xl font-bold text-primary-brown">{days}</p>
              <p className="text-xs text-gray-500">days remaining</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((status) => (
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

      {leaveRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-primary-brown mb-2">
            No Leave Requests Found
          </h3>
          <p className="text-text-dark mb-4">
            You haven't submitted any leave requests yet.
          </p>
          <Link to="/staff/leave/apply" className="btn-primary inline-block">
            Apply for Leave
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Application #</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="font-medium">{request.applicationNumber}</td>
                      <td className="capitalize">{request.leaveType}</td>
                      <td>{formatDate(request.startDate)}</td>
                      <td>{formatDate(request.endDate)}</td>
                      <td className="text-center font-semibold">{request.numberOfDays}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td className="max-w-xs truncate">{request.reason}</td>
                      <td>{formatDate(request.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaveRequests.length === 0 && (
              <div className="text-center py-8">
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
        </>
      )}
    </div>
  );
};

export default LeaveRequests;