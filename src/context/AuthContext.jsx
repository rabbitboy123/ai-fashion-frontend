import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '@/services/authService';
import { tokenStorage } from '@/utils/tokenStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo và kiểm tra token hiện có với backend
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenStorage.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response?.success && response?.data) {
          const userData = response.data;
          setUser(userData);
          tokenStorage.setUser(userData);
        } else {
          // Token không hợp lệ
          tokenStorage.clear();
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.warn('Phiên đăng nhập đã hết hạn hoặc không hợp lệ:', error?.message);
        tokenStorage.clear();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res?.success && res?.data) {
        const authData = res.data;
        const accessToken = authData.accessToken;
        const userInfo = {
          id: authData.id,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
        };

        tokenStorage.setToken(accessToken);
        tokenStorage.setUser(userInfo);

        setToken(accessToken);
        setUser(userInfo);
        return { success: true, data: authData };
      }
      return { success: false, message: res?.message || 'Đăng nhập thất bại' };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      if (res?.success && res?.data) {
        const authData = res.data;
        const accessToken = authData.accessToken;
        const userInfo = {
          id: authData.id,
          email: authData.email,
          fullName: authData.fullName,
          role: authData.role,
        };

        tokenStorage.setToken(accessToken);
        tokenStorage.setUser(userInfo);

        setToken(accessToken);
        setUser(userInfo);
        return { success: true, data: authData };
      }
      return { success: false, message: res?.message || 'Đăng ký thất bại' };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Đăng ký thất bại';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    try {
      localStorage.removeItem('bespoke_vault_cart');
      localStorage.removeItem('bespoke_vault_orders');
      window.dispatchEvent(new Event('bespoke_logout'));
    } catch {
      // Ignored
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
