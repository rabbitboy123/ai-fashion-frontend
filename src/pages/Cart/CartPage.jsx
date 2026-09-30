import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trash2,
  ShieldCheck,
  Package,
  CreditCard,
} from 'lucide-react';
import CartVault3D from '@/components/3d/CartVault3D';
import useCart from '@/hooks/useCart';
import useAuth from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatCurrency';

export const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { items, totalAmount, totalQuantity, updateQuantity, removeFromCart, clearCart } =
    useCart();

  // Khi giỏ hàng trống: Hiển thị Bệ Hologram 3D Vault
  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-semibold tracking-[0.22em] uppercase shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Bespoke Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#121212] tracking-tight">
            Giỏ Hàng May Đo Của Quý Khách
          </h1>
          <p className="text-xs text-[#71717A] font-light max-w-md mx-auto">
            Các tác phẩm được bảo lưu và chuẩn bị quy trình cắt may theo số đo riêng của bạn.
          </p>
        </div>

        {/* 3D Holographic Vault Empty State */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E4E4E7] p-8 sm:p-14 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <CartVault3D className="w-52 h-52 sm:w-64 sm:h-64" />
            <div className="absolute -bottom-2 w-32 h-6 rounded-full bg-[#C5A880]/20 blur-xl pointer-events-none" />
          </div>

          <div className="space-y-2 max-w-sm">
            <span className="text-[11px] font-semibold text-[#C5A880] tracking-widest uppercase">
              Holographic Chamber Empty
            </span>
            <h2 className="text-xl font-serif text-[#121212]">
              Túi May Đo Đang Trống
            </h2>
            <p className="text-xs text-[#71717A] font-light leading-relaxed">
              Chưa có tác phẩm nào được thêm vào giỏ. Hãy ghé thăm sàn diễn thời trang 3D để khám phá bộ sưu tập mới nhất.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/products">
              <button className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-widest transition-colors duration-300 shadow-md cursor-pointer">
                <span>Khám Phá Sàn Diễn 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Khi giỏ hàng có tác phẩm: Giao diện 2 cột Haute Couture
  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-semibold tracking-[0.22em] uppercase shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Bespoke Reservation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#121212] tracking-tight">
            Túi Đồ May Đo ({totalQuantity})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-[#71717A] hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Dọn sạch giỏ hàng</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
        {/* Cột trái: Danh sách sản phẩm (2/3 chiều rộng) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemId = item.id || item.productVariantId;
            return (
              <div
                key={itemId}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs hover:border-[#C5A880]/50 transition-all duration-200"
              >
                {/* Ảnh đại diện tác phẩm */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#F4F4F5] border border-[#E4E4E7] shrink-0">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
                    }
                    alt={item.productName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Thông tin chi tiết */}
                <div className="flex-1 space-y-2 min-w-0">
                  {item.brand && (
                    <span className="text-[10px] font-semibold text-[#C5A880] uppercase tracking-widest block">
                      {item.brand}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-[#121212] truncate">
                    {item.productName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F4F5] text-[#121212] font-medium border border-[#E4E4E7]">
                      Size: {item.sizeName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F4F5] text-[#121212] font-medium border border-[#E4E4E7]">
                      Màu: {item.colorName}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-[#121212]">
                    Đơn giá: {formatCurrency(item.unitPrice)}
                  </div>
                </div>

                {/* Bộ đếm số lượng & Xóa */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0">
                  <div className="flex items-center border border-[#E4E4E7] rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 text-[#71717A] hover:text-[#121212] hover:bg-[#F4F4F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-semibold cursor-pointer"
                      aria-label="Giảm số lượng"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#121212]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity + 1)}
                      className="px-3 py-1 text-[#71717A] hover:text-[#121212] hover:bg-[#F4F4F5] transition-colors text-xs font-semibold cursor-pointer"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-serif font-bold text-[#121212]">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="p-1.5 text-[#A1A1AA] hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                      title="Xóa khỏi túi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#121212] hover:text-[#C5A880] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Khám phá thêm các thiết kế trên sàn diễn</span>
            </Link>
          </div>
        </div>

        {/* Cột phải: Bảng Tóm Tắt & Thanh Toán (1/3 chiều rộng) */}
        <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-24">
          <div className="space-y-1">
            <h2 className="text-xl font-serif text-[#121212] tracking-tight">
              Tóm Tắt Đơn May Đo
            </h2>
            <p className="text-[11px] text-[#71717A]">
              Kiểm tra chi phí dịch vụ may đo và giao nhận.
            </p>
          </div>

          <div className="space-y-3.5 text-xs border-t border-b border-[#E4E4E7] py-5">
            <div className="flex justify-between text-[#71717A]">
              <span>Tạm tính ({totalQuantity} tác phẩm)</span>
              <span className="font-semibold text-[#121212]">{formatCurrency(totalAmount)}</span>
            </div>

            <div className="flex justify-between text-[#71717A]">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Giao hàng may đo VIP</span>
              </span>
              <span className="font-semibold text-[#2A4843]">MIỄN PHÍ</span>
            </div>

            <div className="flex justify-between text-[#71717A]">
              <span>Hộp quà tặng sơn mài & nơ lụa</span>
              <span className="font-semibold text-[#2A4843]">ĐÍNH KÈM</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-[#121212]">Tổng Cộng:</span>
            <span className="text-2xl font-serif font-bold text-[#121212] tracking-tight">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {isAuthenticated ? (
              <Link to="/checkout" className="block">
                <button className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer">
                  <span>Tiến Hành May Đo & Đặt Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="block">
                <button className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#63323E] text-white hover:bg-[#121212] text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer">
                  <span>Đăng Nhập Để Đặt May Đo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#71717A] pt-2">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A4843]" />
                <span>Bảo hiểm may đo</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>COD kiểm hàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
