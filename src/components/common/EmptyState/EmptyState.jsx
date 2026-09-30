import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from '../Button/Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Không có dữ liệu',
  description = 'Chưa có sản phẩm hoặc kết quả phù hợp với tiêu chí của bạn.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};

export default EmptyState;
