import React, { useState, useEffect } from 'react';
import * as commissionAPI from '../../api/commissionAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FaMoneyBillWave, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MyCommissions = () => {
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [commissionsRes, earningsRes] = await Promise.all([
        commissionAPI.getMyCommissions({ page: pagination.page, limit: pagination.limit }),
        commissionAPI.getMyEarnings(),
      ]);
      
      setCommissions(commissionsRes.data);
      setPagination(commissionsRes.pagination);
      setEarnings(earningsRes.data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: earnings?.monthlyBreakdown?.map(item => 
      new Date(2024, item._id.month - 1).toLocaleString('default', { month: 'short' })
    ) || [],
    datasets: [
      {
        label: 'Commission Earned',
        data: earnings?.monthlyBreakdown?.map(item => item.total) || [],
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

  if (loading && commissions.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-brown mb-6">
        My Commissions
      </h1>

      {/* Earnings Summary */}
      {earnings && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark text-sm">Total Earned</p>
                <p className="text-2xl font-bold text-primary-brown">
                  {formatCurrency(earnings.summary?.totalEarned || 0)}
                </p>
              </div>
              <div className="stats-icon bg-accent-pink bg-opacity-20">
                <FaMoneyBillWave className="text-accent-pink text-xl" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark text-sm">Paid</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(earnings.summary?.paidAmount || 0)}
                </p>
              </div>
              <div className="stats-icon bg-success bg-opacity-20">
                <FaCheckCircle className="text-success text-xl" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark text-sm">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  {formatCurrency(earnings.summary?.pendingAmount || 0)}
                </p>
              </div>
              <div className="stats-icon bg-warning bg-opacity-20">
                <FaClock className="text-warning text-xl" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark text-sm">This Month</p>
                <p className="text-2xl font-bold text-accent-pink">
                  {formatCurrency(earnings.monthlyBreakdown?.[0]?.total || 0)}
                </p>
              </div>
              <div className="stats-icon bg-primary-brown bg-opacity-20">
                <FaChartLine className="text-primary-brown text-xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {earnings?.monthlyBreakdown?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-brown mb-4">
            Monthly Earnings
          </h2>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Commissions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Service Commission</th>
                <th>Product Commission</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr key={commission._id}>
                  <td className="font-medium">
                    {commission.period?.month}/{commission.period?.year}
                  </td>
                  <td>{formatCurrency(commission.totalServiceCommission || 0)}</td>
                  <td>{formatCurrency(commission.totalProductCommission || 0)}</td>
                  <td className="font-bold text-accent-pink">
                    {formatCurrency(commission.totalCommission)}
                  </td>
                  <td>
                    <span className={`badge ${
                      commission.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'
                    } text-white`}>
                      {commission.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {commission.paymentDate ? formatDate(commission.paymentDate) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {commissions.length === 0 && (
          <div className="text-center py-8">
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
    </div>
  );
};

export default MyCommissions;