import axiosInstance from './axiosConfig';

// Customer
export const createOrder = (data) => axiosInstance.post('/orders', data);
export const getMyOrders = (params) => axiosInstance.get('/orders/my-orders', { params });

// Staff & Admin
export const getAllOrders = (params) => axiosInstance.get('/orders', { params });
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);
export const getAssignedOrders = (params) => axiosInstance.get('/orders/assigned/staff', { params });

// Admin only
export const updateOrderStatus = (id, data) => axiosInstance.put(`/orders/${id}/status`, data);
export const assignStaff = (id, data) => axiosInstance.put(`/orders/${id}/assign-staff`, data);
export const deleteOrder = (id) => axiosInstance.delete(`/orders/${id}`);
export const processRefund = (id, data) => axiosInstance.post(`/orders/${id}/refund`, data);
export const assignToStaff = (id, data) => axiosInstance.post(`/orders/${id}/assign`, data);