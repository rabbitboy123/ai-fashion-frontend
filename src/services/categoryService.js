import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const categoryService = {
  /**
   * Lấy danh sách toàn bộ danh mục sản phẩm.
   */
  getAllCategories: async () => {
    const response = await apiInstance.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  /**
   * Lấy chi tiết danh mục theo ID.
   */
  getCategoryById: async (id) => {
    const response = await apiInstance.get(API_ENDPOINTS.CATEGORY_DETAIL(id));
    return response.data;
  },
};
