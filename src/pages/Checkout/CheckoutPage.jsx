import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useCart from '@/hooks/useCart';
import orderService from '@/services/orderService';
import { formatCurrency } from '@/utils/formatCurrency';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalAmount, totalQuantity, clearCart } = useCart();

  const [formData, setFormData] = useState({
    receiverName: user?.fullName || '',
    receiverPhone: '',
    addressLine: '',
    city: 'Hà Nội',
    note: '',
    paymentMethod: 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.receiverName.trim()) {
      setError('Vui lòng nhập họ tên người nhận.');
      return;
    }
    if (!formData.receiverPhone.trim()) {
      setError('Vui lòng nhập số điện thoại người nhận.');
      return;
    }
    if (!formData.addressLine.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng chi tiết.');
      return;
    }

    try {
      setLoading(true);
      const fullShippingAddress = `${formData.addressLine.trim()}, ${formData.city}${
        formData.note ? ` (Ghi chú: ${formData.note.trim()})` : ''
      }`;

      const orderPayload = {
        receiverName: formData.receiverName.trim(),
        receiverPhone: formData.receiverPhone.trim(),
        shippingAddress: fullShippingAddress,
        paymentMethod: formData.paymentMethod,
      };

      const result = await orderService.createOrder(orderPayload);
      await clearCart();
      setOrderSuccess(result);
    } catch (err) {
      console.error('Lỗi khi tạo đơn hàng:', err);
      setError(
        err?.response?.data?.message ||
          'Không thể hoàn tất đơn đặt may đo. Vui lòng kiểm tra lại số lượng tồn kho hoặc thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Nếu đặt hàng thành công -> Hiển thị màn hình chúc mừng Haute Couture
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 sm:py-16 px-4">
        <div className="rounded-3xl bg-white border border-[#E4E4E7] p-8 sm:p-12 shadow-xl text-center space-y-8 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-[#2A4843]/10 text-[#2A4843] flex items-center justify-center mx-auto border border-[#2A4843]/20 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#C5A880] tracking-[0.25em] uppercase">
              Bespoke Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#121212] tracking-tight">
              Đơn May Đo Đã Được Khởi Tạo Thành Công
            </h1>
            <p className="text-xs text-[#71717A] max-w-md mx-auto leading-relaxed">
              Cảm ơn quý khách <strong>{orderSuccess.receiverName}</strong>. Nghệ nhân xưởng may đo đang tiến hành chuẩn bị vật liệu lụa và phụ kiện độc bản cho đơn hàng của bạn.
            </p>
          </div>

          {/* Chi tiết đơn */}
          <div className="rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] p-5 text-xs text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#E4E4E7]">
              <span className="text-[#71717A]">Mã đơn may đo:</span>
              <span className="font-mono font-bold text-[#121212] bg-white px-2.5 py-1 rounded-md border border-[#E4E4E7]">
                {orderSuccess.orderCode || `#BESPOKE-${orderSuccess.id}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#71717A]">Phương thức thanh toán:</span>
              <span className="font-semibold text-[#121212]">
                {orderSuccess.paymentMethod === 'COD'
                  ? 'Thanh toán may đo khi nhận hàng (COD)'
                  : 'Chuyển khoản ngân hàng'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#71717A]">Địa chỉ nhận hàng:</span>
              <span className="font-medium text-[#121212] text-right max-w-xs truncate">
                {orderSuccess.shippingAddress}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E4E4E7]">
              <span className="font-semibold text-[#121212]">Tổng giá trị đơn:</span>
              <span className="text-base font-serif font-bold text-[#121212]">
                {formatCurrency(orderSuccess.totalAmount || totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/products" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-widest transition-colors shadow-md cursor-pointer">
                <span>Tiếp Tục Chiêm Ngưỡng Sàn Diễn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <Link to="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#E4E4E7] text-[#71717A] hover:text-[#121212] hover:bg-[#F4F4F5] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer">
                Về Trang Chủ
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Khi giỏ hàng trống mà truy cập trang Checkout
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F4F4F5] flex items-center justify-center mx-auto text-[#71717A]">
          <PackageCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-[#121212]">Giỏ May Đo Đang Trống</h2>
          <p className="text-xs text-[#71717A]">
            Quý khách chưa chọn tác phẩm nào để đặt may đo. Vui lòng chọn sản phẩm trước khi thanh toán.
          </p>
        </div>
        <Link to="/products">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121212] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#121212] transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay Lại Sàn Diễn 3D</span>
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-semibold tracking-[0.22em] uppercase shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Haute Couture Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif text-[#121212] tracking-tight">
            Xác Nhận Đơn May Đo
          </h1>
        </div>

        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#121212] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quay lại giỏ hàng</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
        {/* Cột trái: Thông tin giao hàng & phương thức thanh toán (2/3 chiều rộng) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Box 1: Thông tin người nhận */}
          <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#121212] text-[#C5A880] font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="text-lg font-serif font-semibold text-[#121212]">
                Thông Tin Khách Hàng May Đo
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212]">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="w-full px-4 py-3 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-all text-[#121212]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212]">
                  Số điện thoại liên hệ *
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  placeholder="Ví dụ: 0987654321"
                  required
                  className="w-full px-4 py-3 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-all text-[#121212]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212]">
                  Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã) *
                </label>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tầng 8, Tòa nhà Landmark 81, P. 22"
                  required
                  className="w-full px-4 py-3 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-all text-[#121212]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212]">
                  Tỉnh / Thành phố *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-all text-[#121212]"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Khác">Tỉnh / Thành khác</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212]">
                Ghi chú số đo riêng hoặc thời gian giao hàng
              </label>
              <textarea
                name="note"
                rows="2"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ví dụ: Vui lòng gọi trước 30 phút, may đo theo form dáng người mẫu..."
                className="w-full px-4 py-2.5 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-all text-[#121212] resize-none"
              />
            </div>
          </div>

          {/* Box 2: Phương thức thanh toán */}
          <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#121212] text-[#C5A880] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="text-lg font-serif font-semibold text-[#121212]">
                Phương Thức Thanh Toán
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'COD'
                    ? 'border-[#C5A880] bg-[#C5A880]/5 ring-1 ring-[#C5A880]'
                    : 'border-[#E4E4E7] bg-white hover:border-[#121212]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="mt-1 accent-[#121212]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#2A4843]" />
                    <span className="text-xs font-bold text-[#121212]">
                      Thanh toán khi nhận hàng & thử đồ may đo (COD)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] leading-relaxed">
                    Nhân viên giao nhận găng tay trắng hỗ trợ bạn thử trang phục và kiểm tra chất liệu lụa trước khi thanh toán.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_TRANSFER'
                    ? 'border-[#C5A880] bg-[#C5A880]/5 ring-1 ring-[#C5A880]'
                    : 'border-[#E4E4E7] bg-white hover:border-[#121212]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                  className="mt-1 accent-[#121212]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-xs font-bold text-[#121212]">
                      Chuyển khoản nhanh qua mã VietQR
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] leading-relaxed">
                    Xác nhận tự động trong 30 giây với tài khoản ngân hàng của thương hiệu Atelier.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Cột phải: Tóm tắt đơn & nút Xác nhận (1/3 chiều rộng) */}
        <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-24">
          <div className="space-y-1">
            <h2 className="text-xl font-serif text-[#121212] tracking-tight">
              Tác Phẩm May Đo ({totalQuantity})
            </h2>
            <p className="text-[11px] text-[#71717A]">
              Danh mục tác phẩm bạn chuẩn bị xác nhận.
            </p>
          </div>

          {/* Mini items list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#E4E4E7]">
            {items.map((item) => (
              <div key={item.id || item.productVariantId} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
                  }
                  alt={item.productName}
                  className="w-12 h-14 rounded-lg object-cover object-top border border-[#E4E4E7] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#121212] truncate">
                    {item.productName}
                  </h4>
                  <div className="text-[10px] text-[#71717A]">
                    {item.sizeName} / {item.colorName} × {item.quantity}
                  </div>
                  <div className="text-xs font-medium text-[#121212]">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-xs border-t border-b border-[#E4E4E7] py-5">
            <div className="flex justify-between text-[#71717A]">
              <span>Tạm tính</span>
              <span className="font-semibold text-[#121212]">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[#71717A]">
              <span>Vận chuyển White-Glove VIP</span>
              <span className="font-semibold text-[#2A4843]">MIỄN PHÍ</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-[#121212]">Tổng Thanh Toán:</span>
            <span className="text-2xl font-serif font-bold text-[#121212] tracking-tight">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Đang Khởi Tạo Đơn May Đo...</span>
              ) : (
                <>
                  <span>Xác Nhận Đặt May Đo (COD)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#71717A] pt-2">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A4843]" />
                <span>Bảo hiểm may đo</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
