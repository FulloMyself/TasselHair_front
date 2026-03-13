import axiosInstance from './axiosConfig';

// Public routes
export const getAllProducts = (params) => axiosInstance.get('/products', { params });
export const getFeaturedProducts = () => axiosInstance.get('/products/featured');
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);
export const getProductBySku = (sku) => axiosInstance.get(`/products/sku/${sku}`);

// Admin only
export const createProduct = (data) => axiosInstance.post('/products', data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
export const uploadProductImages = (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  return axiosInstance.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteProductImage = (id, imageId) => 
  axiosInstance.delete(`/products/${id}/images/${imageId}`);
export const updateStock = (id, data) => axiosInstance.put(`/products/${id}/stock`, data);
export const toggleProductStatus = (id) => axiosInstance.put(`/products/${id}/toggle-status`);
export const getLowStockProducts = () => axiosInstance.get('/products/analytics/low-stock');
export const getBestSellers = () => axiosInstance.get('/products/analytics/best-sellers');