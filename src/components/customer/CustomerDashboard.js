import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as dashboardAPI from '../../api/dashboardAPI';
import * as appointmentAPI from '../../api/appointmentAPI';
import * as orderAPI from '../../api/orderAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  FaCalendarAlt, 
  FaShoppingBag, 
  FaGift, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, appointments, orders] = await Promise.all([
        dashboardAPI.getCustomerDashboard(),
        appointmentAPI.getMyAppointments({ limit: 5 }),
        orderAPI.getMyOrders({ limit: 5 }),
      ]);
      
      setDashboardData(dashboard.data);
      setUpcomingAppointments(appointments.data);
      setRecentOrders(orders.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-success', icon: FaCheckCircle },
      pending: { color: 'bg-warning', icon: FaClock },
      cancelled: { color: 'bg-error', icon: FaTimesCircle },
      completed: { color: 'bg-info', icon: FaCheckCircle },
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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

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
          Here's what's happening with your beauty journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Total Appointments</p>
              <p className="text-3xl font-bold text-primary-brown">
                {dashboardData?.stats?.totalAppointments || 0}
              </p>
            </div>
            <div className="stats-icon bg-accent-pink bg-opacity-20">
              <FaCalendarAlt className="text-accent-pink text-xl" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-primary-brown">
                {dashboardData?.stats?.totalOrders || 0}
              </p>
            </div>
            <div className="stats-icon bg-primary-brown bg-opacity-20">
              <FaShoppingBag className="text-primary-brown text-xl" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Completed</p>
              <p className="text-3xl font-bold text-primary-brown">
                {dashboardData?.stats?.completedAppointments || 0}
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
              <p className="text-text-dark text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-primary-brown">
                {formatCurrency(dashboardData?.stats?.totalSpent || 0)}
              </p>
            </div>
            <div className="stats-icon bg-warning bg-opacity-20">
              <FaGift className="text-warning text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary-brown">
              Upcoming Appointments
            </h2>
            <Link to="/my-appointments" className="text-accent-pink hover:underline text-sm">
              View All
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-text-dark">No upcoming appointments</p>
              <Link to="/book" className="text-accent-pink hover:underline text-sm mt-2 inline-block">
                Book an appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-primary-brown">
                        {formatDate(appointment.appointmentDate)} at {appointment.startTime}
                      </p>
                      <p className="text-sm text-text-dark">
                        {appointment.services.map(s => s.serviceName).join(', ')}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Duration: {appointment.services.reduce((sum, s) => sum + s.duration, 0)} mins
                    </span>
                    <span className="font-semibold text-primary-brown">
                      {formatCurrency(appointment.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary-brown">
              Recent Orders
            </h2>
            <Link to="/my-orders" className="text-accent-pink hover:underline text-sm">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-text-dark">No orders yet</p>
              <Link to="/shop" className="text-accent-pink hover:underline text-sm mt-2 inline-block">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-primary-brown">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-text-dark">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {order.items.length} item(s)
                    </span>
                    <span className="font-semibold text-primary-brown">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/book"
          className="bg-accent-pink text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaCalendarAlt className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Book Appointment</span>
        </Link>
        <Link
          to="/shop"
          className="bg-primary-brown text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaShoppingBag className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Shop Products</span>
        </Link>
        <Link
          to="/gifts"
          className="bg-accent-pink text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaGift className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Buy Gift</span>
        </Link>
        <Link
          to="/profile"
          className="bg-primary-brown text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaShoppingBag className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Edit Profile</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;