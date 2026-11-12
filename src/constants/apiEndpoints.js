export const API_ENDPOINTS = {
  // Category Endpoints (Verified Backend)
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id) => `/categories/${id}`,

  // Product Endpoints (Verified Backend)
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,

  // Auth Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Cart Endpoints
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id) => `/cart/items/${id}`,
    REMOVE_ITEM: (id) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
  },

  // Order Endpoints
  ORDERS: {
    CREATE: '/orders',
    HISTORY: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },

  // AI Stylist Endpoints
  AI: {
    RECOMMEND: '/ai/recommend',
    HISTORY: '/ai/history',
  },

  ADMIN: {
    ORDERS: '/admin/orders',
    ORDER_STATUS: (id) => `/admin/orders/${id}/status`,
    PAYMENT_RECONCILIATION: '/admin/payments/reconciliation',
  },
};
