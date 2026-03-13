import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Components
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import VerifyEmail from '../components/auth/VerifyEmail';

// Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ServicesPage from '../pages/ServicesPage';
import ShopPage from '../pages/ShopPage';
import GiftsPage from '../pages/GiftsPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import BookingPage from '../pages/BookingPage';
import CheckoutPage from '../pages/CheckoutPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import NotFoundPage from '../pages/NotFoundPage';

// Customer Pages
import MyAppointments from '../components/customer/MyAppointments';
import MyOrders from '../components/customer/MyOrders';
import MyVouchers from '../components/customer/MyVouchers';
import Wishlist from '../components/customer/Wishlist';

// Staff Pages
import StaffDashboard from '../components/staff/StaffDashboard';
import StaffProfile from '../components/staff/StaffProfile';
import AssignedAppointments from '../components/staff/AssignedAppointments';
import MyCommissions from '../components/staff/MyCommissions';
import LeaveRequests from '../components/staff/LeaveRequests';
import ApplyLeave from '../components/staff/ApplyLeave';
import AvailabilityCalendar from '../components/staff/AvailabilityCalendar';

// Admin Pages
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProfile from '../components/admin/AdminProfile';
import UserManagement from '../components/admin/UserManagement';
import CreateStaffForm from '../components/admin/CreateStaffForm';
import ServiceManagement from '../components/admin/ServiceManagement';
import ProductManagement from '../components/admin/ProductManagement';
import AppointmentManagement from '../components/admin/AppointmentManagement';
import OrderManagement from '../components/admin/OrderManagement';
import GiftPackageManagement from '../components/admin/GiftPackageManagement';
import VoucherManagement from '../components/admin/VoucherManagement';
import LeaveManagement from '../components/admin/LeaveManagement';
import CommissionManagement from '../components/admin/CommissionManagement';
import ReportsAndAnalytics from '../components/admin/ReportsAndAnalytics';
import InventoryManagement from '../components/admin/InventoryManagement';

// Route Guards
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/gifts" element={<GiftsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-vouchers" element={<MyVouchers />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/profile" element={<StaffProfile />} />
          <Route path="/staff/appointments" element={<AssignedAppointments />} />
          <Route path="/staff/commissions" element={<MyCommissions />} />
          <Route path="/staff/leave" element={<LeaveRequests />} />
          <Route path="/staff/leave/apply" element={<ApplyLeave />} />
          <Route path="/staff/availability" element={<AvailabilityCalendar />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<AdminProfile />} />
          
          {/* User Management */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/create-staff" element={<CreateStaffForm />} />
          
          {/* Service Management */}
          <Route path="/admin/services" element={<ServiceManagement />} />
          
          {/* Product Management */}
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/products/new" element={<ProductManagement />} />
          
          {/* Appointment Management */}
          <Route path="/admin/appointments" element={<AppointmentManagement />} />
          
          {/* Order Management */}
          <Route path="/admin/orders" element={<OrderManagement />} />
          
          {/* Gift Package Management */}
          <Route path="/admin/gifts" element={<GiftPackageManagement />} />
          
          {/* Voucher Management */}
          <Route path="/admin/vouchers" element={<VoucherManagement />} />
          
          {/* Leave Management */}
          <Route path="/admin/leave" element={<LeaveManagement />} />
          
          {/* Commission Management */}
          <Route path="/admin/commissions" element={<CommissionManagement />} />
          
          {/* Reports & Analytics */}
          <Route path="/admin/reports" element={<ReportsAndAnalytics />} />
          
          {/* Inventory Management */}
          <Route path="/admin/inventory" element={<InventoryManagement />} />
        </Route>
      </Route>

      {/* Catch all - 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;