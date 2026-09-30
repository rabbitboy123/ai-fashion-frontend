import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner/Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#71717A]">
          Đang xác thực thông tin...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
