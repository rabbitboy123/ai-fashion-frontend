import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { tokenStorage } from '@/utils/tokenStorage';

const LOCAL_CART_KEY = 'bespoke_vault_cart';

const getLocalCart = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : { items: [], totalQuantity: 0, totalAmount: 0 };
  } catch {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

const saveLocalCart = (cart) => {
  try {
    const totalQuantity = (cart.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = (cart.items || []).reduce(
      (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
      0
    );
    const updated = { ...cart, totalQuantity, totalAmount };
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return cart;
  }
};

export const cartService = {
  /**
   * Lấy giỏ hàng của người dùng hiện tại
   * Ưu tiên Backend API nếu đã đăng nhập và server sẵn sàng;
   * Tự động fallback sang LocalStorage nếu chưa đăng nhập hoặc Backend chưa triển khai endpoint / lỗi 500.
   */
  getCart: async () => {
    const token = tokenStorage.getToken();
    if (!token) {
      return getLocalCart();
    }

    try {
      const response = await apiInstance.get(API_ENDPOINTS.CART.GET);
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      return data || getLocalCart();
    } catch {
      // Backend chưa có controller / 500 / 404 / 401: Fallback êm dịu sang giỏ hàng cục bộ
      return getLocalCart();
    }
  },

  /**
   * Thêm sản phẩm biến thể vào giỏ hàng
   */
  addToCart: async (productVariantId, quantity = 1, fallbackItemData = {}) => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const response = await apiInstance.post(API_ENDPOINTS.CART.ADD_ITEM, {
          productVariantId,
          quantity,
        });
        return response.data?.data || response.data;
      } catch (err) {
        if (err.response?.data?.message) {
          throw err;
        }
        // Fallback sang lưu cục bộ
      }
    }

    const local = getLocalCart();
    const existingIndex = local.items.findIndex(
      (i) => i.productVariantId === productVariantId || i.id === productVariantId
    );

    if (existingIndex > -1) {
      local.items[existingIndex].quantity += quantity;
    } else {
      local.items.push({
        id: fallbackItemData.id || `local_${Date.now()}`,
        productVariantId,
        productId: fallbackItemData.productId,
        productName: fallbackItemData.productName || 'Tác phẩm Haute Couture',
        sizeName: fallbackItemData.sizeName || 'M',
        colorName: fallbackItemData.colorName || 'Đen Onyx',
        unitPrice: fallbackItemData.unitPrice || fallbackItemData.price || 0,
        imageUrl: fallbackItemData.imageUrl || '',
        brand: fallbackItemData.brand || 'Bespoke Atelier',
        quantity,
      });
    }
    return saveLocalCart(local);
  },

  /**
   * Cập nhật số lượng của một mục giỏ hàng
   */
  updateCartItem: async (cartItemId, quantity) => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const response = await apiInstance.put(API_ENDPOINTS.CART.UPDATE_ITEM(cartItemId), {
          quantity,
        });
        return response.data?.data || response.data;
      } catch {
        // Fallback sang cục bộ
      }
    }

    const local = getLocalCart();
    const item = local.items.find(
      (i) => i.id === cartItemId || i.productVariantId === cartItemId
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    return saveLocalCart(local);
  },

  /**
   * Xóa một mục khỏi giỏ hàng
   */
  removeCartItem: async (cartItemId) => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const response = await apiInstance.delete(API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId));
        return response.data?.data || response.data;
      } catch {
        // Fallback sang cục bộ
      }
    }

    const local = getLocalCart();
    local.items = local.items.filter(
      (i) => i.id !== cartItemId && i.productVariantId !== cartItemId
    );
    return saveLocalCart(local);
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart: async () => {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        await apiInstance.delete(API_ENDPOINTS.CART.CLEAR);
      } catch {
        // Ignored
      }
    }

    const empty = { items: [], totalQuantity: 0, totalAmount: 0 };
    return saveLocalCart(empty);
  },
};

export default cartService;
