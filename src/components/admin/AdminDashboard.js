import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as dashboardAPI from '../../api/dashboardAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaUsers, 
  FaUserTie, 
  FaBoxes, 
  FaClipboardList,
  FaCalendarAlt,
  FaShoppingBag,
  FaGift,
  FaChartLine,
  FaExclamationTriangle,
  FaEye
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const stats = dashboardData?.stats || {};

  // Chart data for revenue
  const revenueChartData = {
    labels: ['Today', 'This Week', 'This Month', 'This Year'],
    datasets: [
      {
        label: 'Revenue',
        data: [
          stats.revenue?.today || 0,
          stats.revenue?.week || 0,
          stats.revenue?.month || 0,
          stats.revenue?.year || 0,
        ],
        backgroundColor: 'rgba(232, 180, 200, 0.5)',
        borderColor: '#E8B4C8',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for user distribution
  const userChartData = {
    labels: ['Customers', 'Staff', 'Total'],
    datasets: [
      {
        data: [
          stats.totalCustomers || 0,
          stats.totalStaff || 0,
          (stats.totalCustomers || 0) + (stats.totalStaff || 0),
        ],
        backgroundColor: ['#E8B4C8', '#6B5D52', '#4A4139'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-accent-pink to-primary-brown text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="opacity-90">
          Here's what's happening at Tassel Beauty & Wellness today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-primary-brown">
                {stats.totalCustomers || 0}
              </p>
            </div>
            <div className="stats-icon bg-accent-pink bg-opacity-20">
              <FaUsers className="text-accent-pink text-xl" />
            </div>
          </div>
          <Link to="/admin/users?role=customer" className="text-sm text-accent-pink hover:underline mt-2 inline-block">
            View all customers →
          </Link>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Total Staff</p>
              <p className="text-3xl font-bold text-primary-brown">
                {stats.totalStaff || 0}
              </p>
            </div>
            <div className="stats-icon bg-primary-brown bg-opacity-20">
              <FaUserTie className="text-primary-brown text-xl" />
            </div>
          </div>
          <Link to="/admin/users?role=staff" className="text-sm text-accent-pink hover:underline mt-2 inline-block">
            Manage staff →
          </Link>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Products</p>
              <p className="text-3xl font-bold text-primary-brown">
                {stats.totalProducts || 0}
              </p>
            </div>
            <div className="stats-icon bg-success bg-opacity-20">
              <FaBoxes className="text-success text-xl" />
            </div>
          </div>
          <Link to="/admin/products" className="text-sm text-accent-pink hover:underline mt-2 inline-block">
            Manage inventory →
          </Link>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Services</p>
              <p className="text-3xl font-bold text-primary-brown">
                {stats.totalServices || 0}
              </p>
            </div>
            <div className="stats-icon bg-warning bg-opacity-20">
              <FaClipboardList className="text-warning text-xl" />
            </div>
          </div>
          <Link to="/admin/services" className="text-sm text-accent-pink hover:underline mt-2 inline-block">
            Manage services →
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-primary-brown mb-4">
            Revenue Overview
          </h2>
          <div className="h-64">
            <Bar data={revenueChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => formatCurrency(context.raw),
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => formatCurrency(value),
                  },
                },
              },
            }} />
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-primary-brown mb-4">
            User Distribution
          </h2>
          <div className="h-64 flex items-center justify-center">
            <Pie data={userChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw}`,
                  },
                },
              },
            }} />
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-accent-pink" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-2xl font-bold text-primary-brown">{stats.todayAppointments || 0}</p>
          <p className="text-sm text-text-dark">Appointments</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <FaShoppingBag className="text-accent-pink" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-primary-brown">{stats.pendingOrders || 0}</p>
          <p className="text-sm text-text-dark">Orders</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <FaGift className="text-accent-pink" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-primary-brown">{stats.pendingLeaves || 0}</p>
          <p className="text-sm text-text-dark">Leave Requests</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <FaExclamationTriangle className="text-warning" />
            <span className="text-xs text-gray-500">Alert</span>
          </div>
          <p className="text-2xl font-bold text-primary-brown">{stats.lowStockProducts || 0}</p>
          <p className="text-sm text-text-dark">Low Stock Items</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary-brown">
              Recent Appointments
            </h2>
            <Link to="/admin/appointments" className="text-accent-pink hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentAppointments?.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <div>
                  <p className="font-medium text-primary-brown">
                    {appointment.customer?.firstName} {appointment.customer?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(appointment.appointmentDate)} at {appointment.startTime}
                  </p>
                </div>
                <span className={`badge ${
                  appointment.status === 'confirmed' ? 'bg-success' :
                  appointment.status === 'pending' ? 'bg-warning' :
                  appointment.status === 'cancelled' ? 'bg-error' : 'bg-info'
                } text-white text-xs`}>
                  {appointment.status}
                </span>
              </div>
            ))}
            {(!dashboardData?.recentAppointments || dashboardData.recentAppointments.length === 0) && (
              <p className="text-center text-gray-500 py-4">No recent appointments</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary-brown">
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-accent-pink hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <div>
                  <p className="font-medium text-primary-brown">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.customer?.firstName} {order.customer?.lastName} • {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <span className={`badge ${
                  order.orderStatus === 'delivered' ? 'bg-success' :
                  order.orderStatus === 'pending' ? 'bg-warning' :
                  order.orderStatus === 'cancelled' ? 'bg-error' : 'bg-info'
                } text-white text-xs`}>
                  {order.orderStatus}
                </span>
              </div>
            ))}
            {(!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0) && (
              <p className="text-center text-gray-500 py-4">No recent orders</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/users/create-staff"
          className="bg-accent-pink text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaUserTie className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Add Staff</span>
        </Link>
        <Link
          to="/admin/products/new"
          className="bg-primary-brown text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaBoxes className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Add Product</span>
        </Link>
        <Link
          to="/admin/services/new"
          className="bg-accent-pink text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaClipboardList className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Add Service</span>
        </Link>
        <Link
          to="/admin/reports"
          className="bg-primary-brown text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaChartLine className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">View Reports</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;