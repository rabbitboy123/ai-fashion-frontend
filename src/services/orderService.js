import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/utils/tokenStorage';

const LOCAL_ORDERS_KEY = 'bespoke_vault_orders';

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const orderService = {
  /**
   * Tạo đơn hàng mới từ giỏ hàng hiện tại
   * @param {Object} orderData - { receiverName, receiverPhone, shippingAddress, paymentMethod }
   */
  createOrder: async (orderData) => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const response = await apiInstance.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
        return response.data?.data || response.data;
      } catch (err) {
        // Checkout là giao dịch thật; không báo thành công bằng đơn hàng giả khi API lỗi.
        throw err;
      }
    }

    throw new Error('Vui lòng đăng nhập để tạo đơn hàng.');

  },

  /**
   * Lấy lịch sử đơn hàng của người dùng hiện tại
   */
  getMyOrders: async () => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const response = await apiInstance.get(API_ENDPOINTS.ORDERS.HISTORY);
        const data = response.data?.data !== undefined ? response.data.data : response.data;
        if (Array.isArray(data)) {
          return data;
        }
      } catch (err) {
        console.warn('Lỗi khi tải lịch sử đơn hàng từ backend:', err?.message || err);
      }
    }
    return getLocalOrders();
  },

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  getOrderById: async (id) => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const response = await apiInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
        return response.data?.data || response.data;
      } catch (err) {
        console.warn(`Lỗi khi tải chi tiết đơn #${id} từ backend:`, err?.message || err);
      }
    }
    const local = getLocalOrders();
    return local.find((o) => o.id === Number(id) || o.id === id);
  },
};

export default orderService;
