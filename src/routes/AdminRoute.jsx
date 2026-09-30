import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner/Spinner';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#71717A]">
          Đang xác thực quyền Quản trị viên Atelier...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu người dùng không có vai trò ROLE_ADMIN
  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif text-[#121212]">Khu Vực Hạn Chế</h1>
          <p className="text-xs text-[#71717A] leading-relaxed">
            Bạn không có đặc quyền <strong>ROLE_ADMIN</strong> để truy cập Atelier Executive Portal. Vui lòng đăng nhập bằng tài khoản quản trị viên.
          </p>
        </div>
        <Link to="/">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A880] transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay Về Trang Chủ</span>
          </button>
        </Link>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
