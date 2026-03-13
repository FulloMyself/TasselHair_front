import axiosInstance from './axiosConfig';

// Get all commissions (admin)
export const getAllCommissions = (params) => axiosInstance.get('/commissions', { params });

// Get commission by ID
export const getCommissionById = (id) => axiosInstance.get(`/commissions/${id}`);

// Get my commissions (staff)
export const getMyCommissions = (params) => axiosInstance.get('/commissions/my-commissions', { params });

// Get my earnings (staff)
export const getMyEarnings = () => axiosInstance.get('/commissions/my-earnings');

// Calculate commissions for period (admin)
export const calculateCommissions = (data) => axiosInstance.post('/commissions/calculate', data);

// Mark commission as paid (admin)
export const markAsPaid = (id, data) => axiosInstance.put(`/commissions/${id}/pay`, data);

// Get monthly report (admin)
export const getMonthlyReport = (params) => axiosInstance.get('/commissions/reports/monthly', { params });

// Get staff report (admin)
export const getStaffReport = (staffId, params) => 
  axiosInstance.get(`/commissions/reports/staff/${staffId}`, { params });