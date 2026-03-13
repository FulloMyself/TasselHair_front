import axiosInstance from './axiosConfig';

// Staff
export const applyForLeave = (data) => axiosInstance.post('/leave/apply', data);
export const getMyLeave = (params) => axiosInstance.get('/leave/my-leave', { params });
export const cancelLeaveApplication = (id) => axiosInstance.put(`/leave/${id}/cancel`);

// Admin
export const getAllLeave = (params) => axiosInstance.get('/leave', { params });
export const getLeaveById = (id) => axiosInstance.get(`/leave/${id}`);
export const approveLeave = (id, notes) => axiosInstance.put(`/leave/${id}/approve`, { notes });
export const rejectLeave = (id, notes) => axiosInstance.put(`/leave/${id}/reject`, { notes });
export const getLeaveAnalytics = () => axiosInstance.get('/leave/analytics/summary');