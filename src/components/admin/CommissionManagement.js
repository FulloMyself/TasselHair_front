import React, { useState, useEffect } from 'react';
import * as commissionAPI from '../../api/commissionAPI';
import * as userAPI from '../../api/userAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaClock,
  FaUserTie,
  FaChartLine,
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaFileInvoice
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    staffId: 'all',
    status: 'all',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState(null);

  useEffect(() => {
    fetchCommissions();
    fetchStaff();
    fetchMonthlyReport();
  }, [pagination.page, filters]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      if (filters.staffId === 'all') delete params.staffId;
      if (filters.status === 'all') delete params.status;
      
      const response = await commissionAPI.getAllCommissions(params);
      setCommissions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast.error('Failed to load commissions');
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

  const fetchMonthlyReport = async () => {
    try {
      const response = await commissionAPI.getMonthlyReport({
        month: filters.month,
        year: filters.year,
      });
      setMonthlyReport(response.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!paymentReference.trim()) {
      toast.error('Please enter a payment reference');
      return;
    }

    try {
      setActionLoading(true);
      await commissionAPI.markAsPaid(selectedCommission._id, {
        paymentReference,
        notes: `Paid on ${new Date().toLocaleDateString()}`,
      });
      toast.success('Commission marked as paid');
      setModalOpen(false);
      fetchCommissions();
      fetchMonthlyReport();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark as paid');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCalculateCommissions = async () => {
    try {
      setActionLoading(true);
      await commissionAPI.calculateCommissions({
        month: filters.month,
        year: filters.year,
      });
      toast.success('Commissions calculated successfully');
      fetchCommissions();
      fetchMonthlyReport();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to calculate commissions');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      paid: 'bg-success',
      cancelled: 'bg-error',
    };

    return (
      <span className={`badge ${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Chart data
  const chartData = {
    labels: monthlyReport?.totalByStaff?.map(item => {
      const staff = staff.find(s => s._id === item._id);
      return staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown';
    }) || [],
    datasets: [
      {
        label: 'Commission Amount',
        data: monthlyReport?.totalByStaff?.map(item => item.total) || [],
        backgroundColor: 'rgba(232, 180, 200, 0.5)',
        borderColor: '#E8B4C8',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (loading && commissions.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        Commission Management
      </h1>

      {/* Month/Year Selection */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-primary-brown" />
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
              className="input-primary w-40"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
              className="input-primary w-24"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCalculateCommissions}
            disabled={actionLoading}
            className="btn-secondary"
          >
            {actionLoading ? <LoadingSpinner size="sm" /> : 'Calculate Commissions'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {monthlyReport?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {monthlyReport.summary.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-text-dark capitalize">{item._id}</p>
              <p className="text-2xl font-bold text-primary-brown">
                {formatCurrency(item.total)}
              </p>
              <p className="text-xs text-gray-500">{item.count} commission(s)</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {monthlyReport?.totalByStaff?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-primary-brown mb-4">
            Commission Distribution - {months[filters.month - 1]} {filters.year}
          </h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
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
          <div className="grid md:grid-cols-2 gap-4">
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
              <label className="label-primary">Payment Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-primary"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Commissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Period</th>
                <th>Services</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr key={commission._id}>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary-beige rounded-full flex items-center justify-center">
                        <FaUserTie size={14} className="text-primary-brown" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-brown">
                          {commission.staffMember?.firstName} {commission.staffMember?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{commission.staffMember?.staffDetails?.position}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {months[commission.period?.month - 1]} {commission.period?.year}
                  </td>
                  <td className="font-semibold text-accent-pink">
                    {formatCurrency(commission.totalServiceCommission)}
                  </td>
                  <td className="font-semibold text-accent-pink">
                    {formatCurrency(commission.totalProductCommission)}
                  </td>
                  <td className="font-bold text-primary-brown">
                    {formatCurrency(commission.totalCommission)}
                  </td>
                  <td>{getStatusBadge(commission.paymentStatus)}</td>
                  <td>
                    {commission.paymentStatus === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedCommission(commission);
                          setPaymentReference('');
                          setModalOpen(true);
                        }}
                        className="p-2 text-success hover:bg-success hover:bg-opacity-10 rounded-lg transition"
                        title="Mark as Paid"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // TODO: Generate invoice/report
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition ml-1"
                      title="View Details"
                    >
                      <FaFileInvoice />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {commissions.length === 0 && (
          <div className="text-center py-12">
            <FaMoneyBillWave className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-text-dark">No commission records found</p>
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

      {/* Mark as Paid Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Mark Commission as Paid"
      >
        {selectedCommission && (
          <div className="space-y-4">
            <div className="bg-secondary-beige p-4 rounded-lg">
              <p className="font-medium text-primary-brown">
                {selectedCommission.staffMember?.firstName} {selectedCommission.staffMember?.lastName}
              </p>
              <p className="text-sm text-text-dark">
                {months[selectedCommission.period?.month - 1]} {selectedCommission.period?.year}
              </p>
              <p className="text-xl font-bold text-accent-pink mt-2">
                {formatCurrency(selectedCommission.totalCommission)}
              </p>
            </div>

            <div>
              <label className="label-primary">Payment Reference</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="input-primary"
                placeholder="e.g., EFT reference, receipt number"
                required
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Marking as paid will update the staff member's commission record and cannot be undone.
              </p>
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
                onClick={handleMarkAsPaid}
                disabled={actionLoading}
                className="btn-success"
              >
                {actionLoading ? <LoadingSpinner size="sm" /> : 'Confirm Payment'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommissionManagement;