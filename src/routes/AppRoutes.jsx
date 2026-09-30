import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute from '@/routes/AdminRoute';
import Spinner from '@/components/common/Spinner/Spinner';

// Tách nhỏ mã nguồn theo từng trang (Code Splitting / Dynamic Import)
const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const ProductsPage = lazy(() => import('@/pages/Products/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail/ProductDetailPage'));
const AIStylistPage = lazy(() => import('@/pages/AIStylist/AIStylistPage'));
const CartPage = lazy(() => import('@/pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const AdminDashboardPage = lazy(() => import('@/pages/Admin/AdminDashboardPage'));

const PageFallbackLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <Spinner size="lg" />
    <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] font-medium animate-pulse">
      Đang tải trải nghiệm...
    </span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallbackLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="ai-stylist" element={<AIStylistPage />} />
          <Route path="cart" element={<CartPage />} />

          {/* Tuyến đường yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          {/* Tuyến đường Quản trị viên (ROLE_ADMIN) */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
