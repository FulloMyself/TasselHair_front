import axiosInstance from './axiosConfig';

// Public routes
export const getAllServices = (params) => axiosInstance.get('/services', { params });
export const getServiceById = (id) => axiosInstance.get(`/services/${id}`);
export const getServicesByCategory = (category, params) => 
  axiosInstance.get(`/services/category/${category}`, { params });

// Admin only
export const createService = (data) => axiosInstance.post('/services', data);
export const updateService = (id, data) => axiosInstance.put(`/services/${id}`, data);
export const deleteService = (id) => axiosInstance.delete(`/services/${id}`);
export const uploadServiceImages = (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  return axiosInstance.post(`/services/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteServiceImage = (id, imageId) => 
  axiosInstance.delete(`/services/${id}/images/${imageId}`);
export const toggleServiceStatus = (id) => axiosInstance.put(`/services/${id}/toggle-status`);