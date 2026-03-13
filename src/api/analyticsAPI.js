import axiosInstance from './axiosConfig';

// Sales analytics
export const getRevenueAnalytics = (params) => axiosInstance.get('/analytics/sales/revenue', { params });
export const getProductSalesAnalytics = (params) => axiosInstance.get('/analytics/sales/products', { params });
export const getServiceSalesAnalytics = (params) => axiosInstance.get('/analytics/sales/services', { params });
export const getGiftPackageAnalytics = (params) => axiosInstance.get('/analytics/sales/gift-packages', { params });

// Customer analytics
export const getNewCustomersAnalytics = (params) => axiosInstance.get('/analytics/customers/new', { params });
export const getCustomerRetentionAnalytics = () => axiosInstance.get('/analytics/customers/retention');
export const getTopCustomers = (params) => axiosInstance.get('/analytics/customers/top', { params });

// Staff analytics
export const getStaffPerformanceAnalytics = (params) => axiosInstance.get('/analytics/staff/performance', { params });
export const getCommissionAnalytics = (params) => axiosInstance.get('/analytics/staff/commissions', { params });

// Appointment analytics
export const getAppointmentAnalytics = (params) => axiosInstance.get('/analytics/appointments', { params });
export const getPopularServices = (params) => axiosInstance.get('/analytics/appointments/popular-services', { params });
export const getCancellationRate = (params) => axiosInstance.get('/analytics/appointments/cancellation-rate', { params });

// Financial analytics
export const getFinancialSummary = (params) => axiosInstance.get('/analytics/financial/summary', { params });
export const getPaymentMethodAnalytics = (params) => axiosInstance.get('/analytics/financial/payment-methods', { params });

// Inventory analytics
export const getInventoryTurnover = (params) => axiosInstance.get('/analytics/inventory/turnover', { params });
export const getLowStockAnalytics = () => axiosInstance.get('/analytics/inventory/low-stock');

// Export reports
export const exportSalesReport = (data) => axiosInstance.post('/analytics/export/sales', data, {
  responseType: 'blob',
});
export const exportCustomersReport = (data) => axiosInstance.post('/analytics/export/customers', data, {
  responseType: 'blob',
});
export const exportFinancialReport = (data) => axiosInstance.post('/analytics/export/financial', data, {
  responseType: 'blob',
});