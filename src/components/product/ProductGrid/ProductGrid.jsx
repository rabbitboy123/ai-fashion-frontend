import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard/ProductCard';
import Spinner from '@/components/common/Spinner/Spinner';
import EmptyState from '@/components/common/EmptyState/EmptyState';

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Nhịp điệu so le 0.08s chuẩn Choreography từ SKILL.md
      delayChildren: 0.05,
    },
  },
};

export const ProductGrid = ({
  products = [],
  isLoading = false,
  emptyTitle = 'Không tìm thấy sản phẩm nào',
  emptyDescription = 'Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.',
  onAddToCart,
}) => {
  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </motion.div>
  );
};

export default ProductGrid;
