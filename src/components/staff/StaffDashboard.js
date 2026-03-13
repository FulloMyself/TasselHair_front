import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as dashboardAPI from '../../api/dashboardAPI';
import * as appointmentAPI from '../../api/appointmentAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaBan,
  FaChartLine
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, today, upcoming] = await Promise.all([
        dashboardAPI.getStaffDashboard(),
        appointmentAPI.getAssignedAppointments({ date: new Date().toISOString().split('T')[0] }),
        appointmentAPI.getAssignedAppointments({ status: 'confirmed' }),
      ]);
      
      setDashboardData(dashboard.data);
      setTodayAppointments(today.data);
      setUpcomingAppointments(upcoming.data.filter(apt => 
        new Date(apt.appointmentDate) > new Date()
      ).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      setUpdatingStatus(appointmentId);
      await appointmentAPI.startAppointment(appointmentId);
      toast.success('Appointment started');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to start appointment');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      setUpdatingStatus(appointmentId);
      await appointmentAPI.completeAppointment(appointmentId);
      toast.success('Appointment completed');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to complete appointment');
    } finally {
      setUpdatingStatus(null);
    }
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
          {user?.staffDetails?.position} • {user?.staffDetails?.employeeNumber}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Today's Appointments</p>
              <p className="text-3xl font-bold text-primary-brown">
                {todayAppointments.length}
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
              <p className="text-text-dark text-sm">Upcoming</p>
              <p className="text-3xl font-bold text-primary-brown">
                {upcomingAppointments.length}
              </p>
            </div>
            <div className="stats-icon bg-primary-brown bg-opacity-20">
              <FaClock className="text-primary-brown text-xl" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dark text-sm">Completed Services</p>
              <p className="text-3xl font-bold text-primary-brown">
                {dashboardData?.stats?.totalServicesCompleted || 0}
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
              <p className="text-text-dark text-sm">Pending Commission</p>
              <p className="text-3xl font-bold text-primary-brown">
                {formatCurrency(dashboardData?.stats?.pendingCommissions || 0)}
              </p>
            </div>
            <div className="stats-icon bg-warning bg-opacity-20">
              <FaMoneyBillWave className="text-warning text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-primary-brown mb-4">
            Today's Appointments
          </h2>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-text-dark">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment._id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-primary-brown">
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                      <p className="text-sm text-text-dark">
                        {appointment.customer?.firstName} {appointment.customer?.lastName}
                      </p>
                    </div>
                    <span className={`badge ${
                      appointment.status === 'confirmed' ? 'bg-success' :
                      appointment.status === 'in_progress' ? 'bg-warning' :
                      'bg-info'
                    } text-white`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    {appointment.services.map(s => s.serviceName).join(', ')}
                  </div>

                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => handleStartAppointment(appointment._id)}
                      disabled={updatingStatus === appointment._id}
                      className="btn-primary w-full text-sm"
                    >
                      {updatingStatus === appointment._id ? 'Starting...' : 'Start Appointment'}
                    </button>
                  )}

                  {appointment.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteAppointment(appointment._id)}
                      disabled={updatingStatus === appointment._id}
                      className="btn-success w-full text-sm"
                    >
                      {updatingStatus === appointment._id ? 'Completing...' : 'Complete Appointment'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-primary-brown mb-4">
            Upcoming Appointments
          </h2>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FaClock className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-text-dark">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-primary-brown">
                      {formatDate(appointment.appointmentDate)}
                    </p>
                    <span className="text-sm text-accent-pink">
                      {appointment.startTime}
                    </span>
                  </div>
                  <p className="text-sm text-text-dark">
                    {appointment.customer?.firstName} {appointment.customer?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {appointment.services.map(s => s.serviceName).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/staff/appointments"
            className="text-accent-pink hover:underline text-sm mt-4 inline-block"
          >
            View All Appointments →
          </Link>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-primary-brown mb-4">
          Leave Balance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dashboardData?.stats?.leaveBalance || {}).map(([type, days]) => (
            <div key={type} className="text-center p-3 bg-secondary-beige rounded-lg">
              <p className="text-sm text-text-dark capitalize">{type}</p>
              <p className="text-2xl font-bold text-primary-brown">{days}</p>
              <p className="text-xs text-gray-500">days remaining</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            to="/staff/leave"
            className="text-accent-pink hover:underline text-sm"
          >
            Apply for Leave →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/staff/availability"
          className="bg-accent-pink text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaClock className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Set Availability</span>
        </Link>
        <Link
          to="/staff/commissions"
          className="bg-primary-brown text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaChartLine className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">My Commissions</span>
        </Link>
        <Link
          to="/staff/leave"
          className="bg-accent-pink text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaBan className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">Request Leave</span>
        </Link>
        <Link
          to="/profile"
          className="bg-primary-brown text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
        >
          <FaUser className="mx-auto text-2xl mb-2" />
          <span className="text-sm font-semibold">My Profile</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default StaffDashboard;