import axiosInstance from './axiosConfig';

// Public
export const getAllGiftPackages = (params) => axiosInstance.get('/gifts', { params });
export const getGiftPackageById = (id) => axiosInstance.get(`/gifts/${id}`);
export const getGiftPackagesByOccasion = (occasion) => 
  axiosInstance.get(`/gifts/occasion/${occasion}`);

// Admin only
export const createGiftPackage = (data) => axiosInstance.post('/gifts', data);
export const updateGiftPackage = (id, data) => axiosInstance.put(`/gifts/${id}`, data);
export const deleteGiftPackage = (id) => axiosInstance.delete(`/gifts/${id}`);
export const uploadGiftImages = (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  return axiosInstance.post(`/gifts/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteGiftImage = (id, imageId) => 
  axiosInstance.delete(`/gifts/${id}/images/${imageId}`);
export const toggleGiftStatus = (id) => axiosInstance.put(`/gifts/${id}/toggle-status`);