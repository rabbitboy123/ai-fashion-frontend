import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const productService = {
  /**
   * Lấy danh sách sản phẩm phân trang kèm bộ lọc tiêu chí.
   * @param {Object} params - { keyword, categoryId, minPrice, maxPrice, sizeId, colorId, style, occasion, page, size, sort }
   */
  getProducts: async (params = {}) => {
    const response = await apiInstance.get(API_ENDPOINTS.PRODUCTS, { params });
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết một sản phẩm theo ID kèm các biến thể (variants).
   * @param {number|string} id - ID sản phẩm
   */
  getProductById: async (id) => {
    const response = await apiInstance.get(API_ENDPOINTS.PRODUCT_DETAIL(id));
    return response.data;
  },
};
