import axiosInstance from './axiosConfig';

// Public
export const validateVoucher = (data) => axiosInstance.post('/vouchers/validate', data);

// Customer
export const purchaseGiftVoucher = (data) => axiosInstance.post('/vouchers/purchase-gift', data);
export const getMyGiftVouchers = () => axiosInstance.get('/vouchers/my-gift-vouchers');

// Admin only
export const createVoucher = (data) => axiosInstance.post('/vouchers', data);
export const getAllVouchers = (params) => axiosInstance.get('/vouchers', { params });
export const getVoucherById = (id) => axiosInstance.get(`/vouchers/${id}`);
export const updateVoucher = (id, data) => axiosInstance.put(`/vouchers/${id}`, data);
export const deleteVoucher = (id) => axiosInstance.delete(`/vouchers/${id}`);
export const getVoucherAnalytics = () => axiosInstance.get('/vouchers/analytics/usage');