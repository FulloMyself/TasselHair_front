// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
};

// Appointment statuses
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  READY: 'ready',
  DISPATCHED: 'dispatched',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Leave types (SA Labour Law compliant)
export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  FAMILY_RESPONSIBILITY: 'family_responsibility',
  MATERNITY: 'maternity',
  STUDY: 'study',
  UNPAID: 'unpaid',
};

// Service categories
export const SERVICE_CATEGORIES = {
  HAIR_WASH: 'hair_wash',
  BRAIDS: 'braids',
  CORNROWS: 'cornrows',
  PLAITS: 'plaits',
  BENNY_BETTY: 'benny_betty',
  MASSAGE: 'massage',
  FACIAL: 'facial',
  WAX: 'wax',
  NAIL: 'nail',
  MICRONEEDLING: 'microneedling',
  CHEMICAL_PEEL: 'chemical_peel',
  BODY_CONTOURING: 'body_contouring',
  ADD_ON_TREATMENTS: 'add_on_treatments',
  EVENT: 'event',
};

// Product categories
export const PRODUCT_CATEGORIES = {
  SKINCARE: 'skincare',
  HAIRCARE: 'haircare',
  BODYCARE: 'bodycare',
  WELLNESS: 'wellness',
  ACCESSORIES: 'accessories',
  GIFTS: 'gifts',
};

// Business hours
export const BUSINESS_HOURS = {
  MONDAY: { open: '09:00', close: '17:00', isOpen: true },
  TUESDAY: { open: '09:00', close: '17:00', isOpen: true },
  WEDNESDAY: { open: '09:00', close: '17:00', isOpen: true },
  THURSDAY: { open: '09:00', close: '17:00', isOpen: true },
  FRIDAY: { open: '09:00', close: '17:00', isOpen: true },
  SATURDAY: { open: '09:00', close: '17:00', isOpen: true },
  SUNDAY: { open: null, close: null, isOpen: false },
};

// SA provinces
export const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

// Payment methods
export const PAYMENT_METHODS = {
  PAYFAST: 'payfast',
  CASH: 'cash',
  CARD: 'card',
};

// Voucher types
export const VOUCHER_TYPES = {
  MONETARY: 'monetary',
  PERCENTAGE: 'percentage',
  GIFT: 'gift',
};

// Commission status
export const COMMISSION_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
};

// Default pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    PROFILE: '/users/profile',
    DASHBOARD: '/users/dashboard',
    ALL: '/users',
    STAFF: '/users/staff',
    ADMIN: '/users/admin',
  },
  SERVICES: {
    ALL: '/services',
    CATEGORY: '/services/category',
  },
  PRODUCTS: {
    ALL: '/products',
    FEATURED: '/products/featured',
    LOW_STOCK: '/products/analytics/low-stock',
    BEST_SELLERS: '/products/analytics/best-sellers',
  },
  APPOINTMENTS: {
    ALL: '/appointments',
    MY_APPOINTMENTS: '/appointments/my-appointments',
    AVAILABLE: '/appointments/available',
    ASSIGNED: '/appointments/staff/assigned',
  },
  ORDERS: {
    ALL: '/orders',
    MY_ORDERS: '/orders/my-orders',
    ASSIGNED: '/orders/assigned/staff',
  },
  GIFTS: {
    ALL: '/gifts',
    OCCASION: '/gifts/occasion',
  },
  VOUCHERS: {
    ALL: '/vouchers',
    VALIDATE: '/vouchers/validate',
    MY_GIFTS: '/vouchers/my-gift-vouchers',
    ANALYTICS: '/vouchers/analytics/usage',
  },
  LEAVE: {
    ALL: '/leave',
    MY_LEAVE: '/leave/my-leave',
    APPLY: '/leave/apply',
    ANALYTICS: '/leave/analytics/summary',
  },
  COMMISSIONS: {
    ALL: '/commissions',
    MY_COMMISSIONS: '/commissions/my-commissions',
    MY_EARNINGS: '/commissions/my-earnings',
    CALCULATE: '/commissions/calculate',
  },
  PAYMENT: {
    INITIATE: '/payment/initiate',
    NOTIFY: '/payment/notify',
    SUCCESS: '/payment/success',
    CANCEL: '/payment/cancel',
  },
  DASHBOARD: {
    CUSTOMER: '/dashboard/customer',
    STAFF: '/dashboard/staff',
    ADMIN: '/dashboard/admin',
    OVERVIEW: '/dashboard/admin/overview',
  },
  ANALYTICS: {
    REVENUE: '/analytics/sales/revenue',
    PRODUCTS: '/analytics/sales/products',
    SERVICES: '/analytics/sales/services',
    GIFTS: '/analytics/sales/gift-packages',
    CUSTOMERS: '/analytics/customers/new',
    RETENTION: '/analytics/customers/retention',
    STAFF: '/analytics/staff/performance',
    COMMISSIONS: '/analytics/staff/commissions',
    APPOINTMENTS: '/analytics/appointments',
    INVENTORY: '/analytics/inventory/turnover',
  },
};