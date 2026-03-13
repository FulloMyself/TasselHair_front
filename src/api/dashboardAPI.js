import axiosInstance from './axiosConfig';

// Customer
export const getCustomerDashboard = () => axiosInstance.get('/dashboard/customer');

// Staff
export const getStaffDashboard = () => axiosInstance.get('/dashboard/staff');

// Admin
export const getAdminDashboard = () => axiosInstance.get('/dashboard/admin');
export const getAdminOverview = () => axiosInstance.get('/dashboard/admin/overview');

// Overviews
export const getStaffOverview = () => axiosInstance.get('/dashboard/staff/overview');
export const getCustomerOverview = () => axiosInstance.get('/dashboard/customer/overview');