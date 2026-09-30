import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '@/components/common/Button/Button';

export const NotFoundPage = () => {
  return (
    <div className="py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center mx-auto shadow-xs">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-[#121212]">404</h1>
      <h2 className="text-base font-serif text-[#71717A]">Tác Phẩm Không Tồn Tại</h2>
      <p className="text-xs text-[#71717A] max-w-sm mx-auto font-light">
        Đường dẫn bạn yêu cầu không khả dụng hoặc đã được di chuyển sang bộ sưu tập khác.
      </p>
      <div className="pt-3">
        <Link to="/">
          <Button variant="primary">Về Trang Chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
