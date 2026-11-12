import apiInstance from './api';
import { productService } from './productService';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const adminService = {
  /**
   * Lấy danh sách toàn bộ sản phẩm kèm đầy đủ biến thể thật từ Backend Neon Database
   */
  getProductsWithVariants: async () => {
    const response = await apiInstance.get('/admin/products');
    const data = response.data?.data !== undefined ? response.data.data : response.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Nạp chi tiết sản phẩm kèm danh sách biến thể thật từ Backend Database Neon
   */
  loadProductDetail: async (productId) => {
    try {
      const res = await productService.getProductById(productId);
      return res?.data || res || null;
    } catch (err) {
      console.warn(`Không thể nạp chi tiết sản phẩm #${productId}:`, err?.message || err);
      return null;
    }
  },

  /**
   * Thêm sản phẩm thời trang may đo mới vào Backend Database
   */
  createProduct: async (productData) => {
    const response = await apiInstance.post('/admin/products', productData);
    return response.data?.data || response.data;
  },

  /**
   * Cập nhật thông tin tác phẩm may đo trong Backend Database
   */
  updateProduct: async (productId, updatedData) => {
    const response = await apiInstance.put(`/admin/products/${productId}`, updatedData);
    return response.data?.data || response.data;
  },

  /**
   * Xóa tác phẩm khỏi hệ thống
   */
  deleteProduct: async (productId) => {
    const response = await apiInstance.delete(`/admin/products/${productId}`);
    return response.data?.data || response.data;
  },

  /**
   * Thêm một biến thể Size / Màu sắc mới cho tác phẩm vào Database
   */
  addVariant: async (productId, variantData) => {
    const response = await apiInstance.post(`/admin/products/${productId}/variants`, variantData);
    return response.data?.data || response.data;
  },

  /**
   * Xóa một biến thể cụ thể của tác phẩm trong Database
   */
  deleteVariant: async (productId, variantId) => {
    const response = await apiInstance.delete(`/admin/variants/${variantId}`);
    return response.data?.data || response.data;
  },

  /**
   * Cập nhật số lượng tồn kho cho một biến thể sản phẩm trực tiếp vào Database Neon
   */
  updateVariantStock: async (variantId, newStock) => {
    const response = await apiInstance.put(`/admin/variants/${variantId}/stock`, {
      stockQuantity: Number(newStock),
    });
    return response.data?.data || response.data;
  },

  /**
   * Lấy danh sách tất cả các đơn hàng may đo thật từ Backend Database
   */
  getAllOrders: async () => {
    const response = await apiInstance.get(API_ENDPOINTS.ADMIN.ORDERS);
    const data = response.data?.data !== undefined ? response.data.data : response.data;
    return Array.isArray(data) ? data : [];
  },

  getPaymentReconciliation: async () => {
    const response = await apiInstance.get(API_ENDPOINTS.ADMIN.PAYMENT_RECONCILIATION);
    const data = response.data?.data !== undefined ? response.data.data : response.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Cập nhật trạng thái đơn hàng trong Database Neon
   * (PENDING -> CONFIRMED -> SHIPPING -> DELIVERED -> CANCELLED)
   */
  updateOrderStatus: async (orderId, newStatus) => {
    const response = await apiInstance.put(API_ENDPOINTS.ADMIN.ORDER_STATUS(orderId), {
      status: newStatus,
    });
    return response.data?.data || response.data;
  },
};

export default adminService;
