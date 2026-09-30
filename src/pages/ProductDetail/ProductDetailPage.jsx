import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles, Check, AlertCircle } from 'lucide-react';
import { productService } from '@/services/productService';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { formatCurrency } from '@/utils/formatCurrency';
import Spinner from '@/components/common/Spinner/Spinner';
import Badge from '@/components/common/Badge/Badge';
import ProductShowroom3D from '@/components/3d/ProductShowroom3D';
import useCart from '@/hooks/useCart';

const DEFAULT_PRODUCT_IMAGE = '/src/assets/images/minimal-white-blazer.jpg.jpg';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let data = null;
        try {
          const res = await productService.getProductById(id);
          data = res?.data || res;
        } catch {
          // Fallback mock product
          const mock = MOCK_PRODUCTS.find((p) => p.id === Number(id)) || MOCK_PRODUCTS[0];
          data = {
            ...mock,
            description:
              mock.description ||
              'Tác phẩm may đo được chế tác thủ công tinh xảo từ chất liệu cao cấp, đường may tỉ mỉ và cấu trúc chuẩn mực tôn vinh vóc dáng thanh lịch của quý khách.',
            variants: mock.variants || [
              { id: 101, sizeName: 'S', colorName: 'Đen Onyx', stockQuantity: 15, additionalPrice: 0 },
              { id: 102, sizeName: 'M', colorName: 'Đen Onyx', stockQuantity: 25, additionalPrice: 0 },
              { id: 103, sizeName: 'L', colorName: 'Đen Onyx', stockQuantity: 10, additionalPrice: 50000 },
              { id: 104, sizeName: 'XL', colorName: 'Đen Onyx', stockQuantity: 0, additionalPrice: 50000 },
            ],
          };
        }
        setProduct(data);
        if (data?.variants && data.variants.length > 0) {
          const firstInStock = data.variants.find((v) => v.stockQuantity > 0);
          setSelectedVariant(firstInStock || data.variants[0]);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stockQuantity <= 0 || isAdding) return;
    try {
      setIsAdding(true);
      setErrorMessage(null);
      await addToCart(selectedVariant, product, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2400);
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ:', err);
      setErrorMessage(err.message || 'Không thể thêm sản phẩm vào giỏ hàng.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-serif text-[#121212] mb-2">Không tìm thấy tác phẩm</h2>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#121212] text-white text-xs font-semibold uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại bộ sưu tập</span>
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant
    ? Number(product.price) + Number(selectedVariant.additionalPrice || 0)
    : Number(product.price);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Back Link */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717A] hover:text-[#C5A880] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại bộ sưu tập</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-start">
        {/* Left Col: 3D Interactive Virtual Showroom Stage */}
        <div className="w-full max-w-lg mx-auto lg:max-w-none">
          <ProductShowroom3D
            imageUrl={
              selectedVariant?.imageUrl ||
              product.imageUrl ||
              DEFAULT_PRODUCT_IMAGE
            }
            alt={product.name}
            badgeText={product.brand || 'Bespoke Atelier'}
          />
        </div>

        {/* Right Col: Details & 3D Interactive Controls */}
        <div className="flex flex-col space-y-6 justify-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{product.categoryName || product.category?.name || 'Bespoke'}</Badge>
              {product.style && <Badge variant="default">{product.style}</Badge>}
              <span className="inline-flex items-center gap-1 text-[10px] text-[#C5A880] font-semibold uppercase tracking-widest ml-auto">
                <Sparkles className="w-3 h-3" />
                <span>Haute Couture</span>
              </span>
            </div>

            {product.brand && (
              <p className="text-xs font-semibold text-[#C5A880] uppercase tracking-[0.2em]">
                {product.brand}
              </p>
            )}

            <h1 className="text-3xl sm:text-4xl font-serif text-[#121212] tracking-tight mt-1.5 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#121212] tracking-tight">
            {formatCurrency(currentPrice)}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-b border-[#E4E4E7] py-4 font-light">
              {product.description}
            </p>
          )}

          {/* 3D Physical Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212]">
                Lựa Chọn Kích Cỡ & Màu Sắc:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isOutOfStock = v.stockQuantity <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide border transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#121212] ring-2 ring-[#C5A880]/40 font-semibold'
                          : isOutOfStock
                          ? 'border-[#E4E4E7] bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed line-through'
                          : 'border-[#E4E4E7] bg-white text-[#71717A] hover:text-[#121212] hover:border-[#121212]'
                      }`}
                    >
                      <span>
                        {v.sizeName} — {v.colorName}
                      </span>
                      {v.stockQuantity > 0 ? (
                        <span className="ml-1.5 text-[10px] text-[#A1A1AA]">
                          ({v.stockQuantity})
                        </span>
                      ) : (
                        <span className="ml-1 text-[10px] text-[#63323E]">(Hết)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action CTA */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#121212]">
                Số Lượng:
              </span>
              <div className="flex items-center border border-[#E4E4E7] rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isAdding}
                  className="px-3.5 py-1.5 text-[#71717A] hover:text-[#121212] hover:bg-[#F4F4F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-[#121212]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      selectedVariant?.stockQuantity ? Math.min(selectedVariant.stockQuantity, q + 1) : q + 1
                    )
                  }
                  disabled={
                    isAdding ||
                    (selectedVariant?.stockQuantity ? quantity >= selectedVariant.stockQuantity : false)
                  }
                  className="px-3.5 py-1.5 text-[#71717A] hover:text-[#121212] hover:bg-[#F4F4F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stockQuantity <= 0 || isAdding}
              className={`w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
                addedNotice
                  ? 'bg-[#2A4843] text-white ring-2 ring-[#2A4843]/30'
                  : selectedVariant?.stockQuantity <= 0
                  ? 'bg-[#E4E4E7] text-[#A1A1AA] cursor-not-allowed'
                  : 'bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212]'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Đã Thêm Vào Giỏ Hàng!</span>
                </>
              ) : selectedVariant?.stockQuantity <= 0 ? (
                <span>Tác Phẩm Tạm Hết Hàng</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? 'Đang Xử Lý...' : 'Thêm Vào Giỏ Hàng May Đo'}</span>
                </>
              )}
            </button>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E4E4E7] text-xs text-[#71717A]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span className="text-[11px]">Giao hàng COD bảo mật toàn quốc</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2A4843] shrink-0" />
                <span className="text-[11px]">100% May đo & Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
