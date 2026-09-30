import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const authService = {
  /**
   * Đăng nhập tài khoản
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<any>}
   */
  login: async (credentials) => {
    const response = await apiInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Đăng ký tài khoản thành viên mới
   * @param {{ email: string, password: string, fullName: string, gender?: string, dateOfBirth?: string }} userData
   * @returns {Promise<any>}
   */
  register: async (userData) => {
    const response = await apiInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Lấy thông tin tài khoản hiện tại qua token Bearer
   * @returns {Promise<any>}
   */
  getCurrentUser: async () => {
    const response = await apiInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};

export default authService;
