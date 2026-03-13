import axiosInstance from './axiosConfig';

export const login = (data) => axiosInstance.post('/auth/login', data);
export const register = (data) => axiosInstance.post('/auth/register', data);
export const logout = () => axiosInstance.post('/auth/logout');
export const refreshToken = (refreshToken) => axiosInstance.post('/auth/refresh-token', { refreshToken });
export const getProfile = () => axiosInstance.get('/users/profile');
export const updateProfile = (data) => axiosInstance.put('/users/profile', data);
export const changePassword = (data) => axiosInstance.post('/auth/change-password', data);
export const forgotPassword = (email) => axiosInstance.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => axiosInstance.put(`/auth/reset-password/${token}`, { password });
export const verifyEmail = (token) => axiosInstance.get(`/auth/verify-email/${token}`);