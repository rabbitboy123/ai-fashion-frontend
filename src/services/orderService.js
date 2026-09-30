import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/utils/tokenStorage';
import cartService from './cartService';

const LOCAL_ORDERS_KEY = 'bespoke_vault_orders';

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalOrder = (order) => {
  try {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return order;
  } catch {
    return order;
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
        // Nếu backend phản hồi lỗi cụ thể (ví dụ hết hàng, sai dữ liệu), ném lỗi để hiển thị cho người dùng
        if (err.response?.data?.message) {
          throw err;
        }
        console.warn('Backend offline, lưu đơn hàng cục bộ tạm thời:', err);
      }
    }

    const cart = await cartService.getCart();
    const newOrder = {
      id: Date.now(),
      orderCode: `BESPOKE-${Math.floor(100000 + Math.random() * 900000)}`,
      receiverName: orderData.receiverName,
      receiverPhone: orderData.receiverPhone,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'COD',
      status: 'PENDING',
      totalAmount: cart.totalAmount || 0,
      items: (cart.items || []).map((item) => ({
        id: `item_${Date.now()}_${Math.random()}`,
        productName: item.productName,
        sizeName: item.sizeName,
        colorName: item.colorName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
      })),
      createdAt: new Date().toISOString(),
    };

    saveLocalOrder(newOrder);
    await cartService.clearCart();
    return newOrder;
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
