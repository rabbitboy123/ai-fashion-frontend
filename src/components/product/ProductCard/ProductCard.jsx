import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import Card3DTilt from '@/components/3d/Card3DTilt';
import useCart from '@/hooks/useCart';

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1], // Decelerate curve chuẩn sang trọng
    },
  },
};

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop';

export const ProductCard = React.memo(({ product, onAddToCart }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    brand,
    price,
    imageUrl,
    categoryName,
    tag,
    tagColor = 'teal',
  } = product;

  // Xử lý màu sắc Badge tinh tế
  const getBadgeStyle = () => {
    if (tagColor === 'gold') {
      return 'bg-[#C5A880]/15 text-[#8F7249] border-[#C5A880]/30';
    }
    if (tagColor === 'plum') {
      return 'bg-[#63323E]/10 text-[#63323E] border-[#63323E]/25';
    }
    return 'bg-[#2A4843]/10 text-[#2A4843] border-[#2A4843]/20';
  };

  const isOutOfStock =
    product.totalStock !== undefined
      ? product.totalStock <= 0
      : product.variants && product.variants.length > 0
      ? product.variants.every((v) => v.stockQuantity <= 0)
      : false;

  // Xử lý thêm nhanh vào giỏ hàng
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isOutOfStock) return;

    // Lấy biến thể đầu tiên còn hàng
    const variant =
      product.variants?.find((v) => v.stockQuantity > 0) ||
      product.variants?.[0] || {
        id: product.id,
        sizeName: 'M',
        colorName: 'Đen Onyx',
        additionalPrice: 0,
        stockQuantity: 10,
      };

    try {
      setIsAdding(true);
      await addToCart(variant, product, 1);
      if (onAddToCart) onAddToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    } catch (err) {
      console.error('Lỗi khi thêm nhanh vào giỏ:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div variants={cardItemVariants} className="h-full">
      <Card3DTilt className="h-full" maxTilt={8}>
        <div className="group relative bg-white rounded-xl border border-[#E4E4E7] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C5A880]/40 transition-all duration-400 flex flex-col h-full [transform-style:preserve-3d]">
          {/* Toàn bộ khung ảnh là Link điều hướng trực tiếp */}
          <Link
            to={`/products/${id}`}
            className="block relative aspect-[3/4] w-full bg-[#F4F4F5] overflow-hidden [transform:translateZ(12px)] cursor-pointer"
            title={`Xem chi tiết tác phẩm ${name}`}
          >
            <img
              src={imageUrl || FALLBACK_PRODUCT_IMAGE}
              alt={name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              loading="lazy"
            />

            {/* Badge góc trên */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
              {isOutOfStock ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border bg-[#121212]/85 text-[#C5A880] border-[#C5A880]/40 backdrop-blur-xs">
                  Hết Hàng
                </span>
              ) : (tag || categoryName || product.category?.name) && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border backdrop-blur-xs ${getBadgeStyle()}`}
                >
                  {tag || categoryName || product.category?.name}
                </span>
              )}
            </div>

            {/* Hover Quick View Overlay (chỉ dẫn trực quan, bấm bất kỳ đâu trên ảnh đều mở Link) */}
            <div className="absolute inset-0 bg-[#121212]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 pointer-events-none">
              <span className="p-3 bg-white text-[#121212] rounded-full shadow-md group-hover:scale-105 transition-transform duration-200">
                <Eye className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Thông tin sản phẩm */}
          <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 [transform:translateZ(20px)]">
            <div>
              {brand && (
                <p className="text-[10px] font-semibold text-[#C5A880] uppercase tracking-[0.18em] mb-1">
                  {brand}
                </p>
              )}
              <Link
                to={`/products/${id}`}
                className="text-sm font-serif font-medium text-[#121212] hover:text-[#C5A880] line-clamp-1 transition-colors duration-200"
                title={name}
              >
                {name}
              </Link>
            </div>

            <div className="pt-3 border-t border-[#E4E4E7]/70 flex items-center justify-between">
              <span className="text-sm sm:text-base font-semibold text-[#121212] tracking-tight">
                {formatCurrency(price)}
              </span>

              {/* Nút thêm nhanh vào giỏ hàng có phản hồi thị giác trực quan */}
              <motion.button
                whileTap={isOutOfStock ? {} : { scale: 0.92 }}
                onClick={handleQuickAdd}
                disabled={isAdding || isOutOfStock}
                className={`p-2.5 rounded-full border transition-all duration-300 shadow-xs [transform:translateZ(10px)] ${
                  isOutOfStock
                    ? 'bg-[#F4F4F5] text-[#A1A1AA] border-[#E4E4E7] cursor-not-allowed opacity-50'
                    : isAdded
                    ? 'bg-[#2A4843] text-white border-[#2A4843] ring-2 ring-[#2A4843]/30 scale-105 cursor-pointer'
                    : 'bg-[#F4F4F5] hover:bg-[#121212] hover:text-white text-[#121212] border-[#E4E4E7] cursor-pointer'
                }`}
                title={
                  isOutOfStock
                    ? 'Tác phẩm tạm hết hàng'
                    : isAdded
                    ? 'Đã thêm vào giỏ hàng!'
                    : 'Thêm nhanh vào giỏ'
                }
                aria-label={isOutOfStock ? 'Tác phẩm tạm hết hàng' : 'Thêm nhanh vào giỏ'}
              >
                {isAdded ? (
                  <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                ) : (
                  <ShoppingBag className="w-3.5 h-3.5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </Card3DTilt>
    </motion.div>
  );
});

export default ProductCard;
