import axiosInstance from './axiosConfig';

// Public
export const getAvailableSlots = (params) => axiosInstance.get('/appointments/available', { params });

// Customer
export const createAppointment = (data) => axiosInstance.post('/appointments', data);
export const getMyAppointments = (params) => axiosInstance.get('/appointments/my-appointments', { params });
export const cancelAppointment = (id, reason) => 
  axiosInstance.put(`/appointments/${id}/cancel`, { reason });

// Staff & Admin
export const getAllAppointments = (params) => axiosInstance.get('/appointments', { params });
export const getAppointmentById = (id) => axiosInstance.get(`/appointments/${id}`);
export const getAssignedAppointments = () => axiosInstance.get('/appointments/staff/assigned');
export const startAppointment = (id) => axiosInstance.put(`/appointments/${id}/start`);
export const completeAppointment = (id, notes) => 
  axiosInstance.put(`/appointments/${id}/complete`, { notes });

// Admin only
export const assignStaff = (id, data) => axiosInstance.put(`/appointments/${id}/assign`, data);
export const updateAppointmentStatus = (id, data) => 
  axiosInstance.put(`/appointments/${id}/status`, data);
export const deleteAppointment = (id) => axiosInstance.delete(`/appointments/${id}`);