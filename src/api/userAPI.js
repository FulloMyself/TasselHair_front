import axiosInstance from './axiosConfig';

// Profile
export const getProfile = () => axiosInstance.get('/users/profile');
export const updateProfile = (data) => axiosInstance.put('/users/profile', data);
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return axiosInstance.post('/users/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Dashboard
export const getDashboard = () => axiosInstance.get('/users/dashboard');

// Admin only
export const getAllUsers = (params) => axiosInstance.get('/users', { params });
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const createStaff = (data) => axiosInstance.post('/users/staff', data);
export const createAdmin = (data) => axiosInstance.post('/users/admin', data);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
export const toggleUserStatus = (id) => axiosInstance.put(`/users/${id}/toggle-status`);
export const resetUserPassword = (id, data) => axiosInstance.put(`/users/${id}/reset-password`, data);

// Staff specific
export const getAssignedAppointments = () => axiosInstance.get('/users/staff/assigned-appointments');
export const updateAvailability = (data) => axiosInstance.put('/users/staff/availability', data);