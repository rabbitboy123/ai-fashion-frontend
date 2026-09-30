import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Package,
  ShoppingBag,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronRight,
  Plus,
  Save,
  Check,
  X,
  ExternalLink,
  Search,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import adminService from '@/services/adminService';
import { categoryService } from '@/services/categoryService';
import { formatCurrency } from '@/utils/formatCurrency';
import Spinner from '@/components/common/Spinner/Spinner';
import ImageUploader from '@/components/admin/ImageUploader';

const LUXURY_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const COLOR_OPTIONS = [
  'Đen Onyx',
  'Trắng Ngà',
  'Vàng Champagne',
  'Xanh Emerald',
  'Đỏ Mận Plum',
  'Xanh Navy',
  'Hồng Pastel',
];

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loadingVariants, setLoadingVariants] = useState({});
  const [stockInputs, setStockInputs] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Thêm tác phẩm
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    categoryId: 1,
    price: 15000000,
    brand: 'Bespoke Atelier',
    material: 'Lụa Tơ Tằm Thượng Hạng',
    style: 'Sang Trọng',
    occasion: 'Dạ Tiệc',
    imageUrl: '',
    description: '',
  });

  // Modal Sửa tác phẩm
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal Xác nhận Xóa tác phẩm
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Modal Thêm Biến thể mới cho tác phẩm cụ thể
  const [variantModalProductId, setVariantModalProductId] = useState(null);
  const [newVariantData, setNewVariantData] = useState({
    sizeName: 'M',
    colorName: 'Đen Onyx',
    stockQuantity: 15,
    additionalPrice: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      try {
        const [productList, orderList, catRes] = await Promise.all([
          adminService.getProductsWithVariants(),
          adminService.getAllOrders(),
          categoryService.getAllCategories().catch(() => null),
        ]);
        if (!isMounted) return;
        setProducts(productList);
        setOrders(orderList);

        const catList = catRes?.data || catRes || [];
        if (Array.isArray(catList) && catList.length > 0) {
          setCategories(catList);
        }

        const initialStock = {};
        productList.forEach((p) => {
          p.variants?.forEach((v) => {
            initialStock[v.id] = v.stockQuantity;
          });
        });
        setStockInputs(initialStock);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu Admin:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Mở rộng sản phẩm và tự động nạp biến thể thật nếu chưa có
  const handleToggleExpand = async (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
      return;
    }

    setExpandedProduct(productId);
    const targetProduct = products.find((p) => p.id === productId);

    // Nếu sản phẩm chưa có variants hoặc mảng rỗng, nạp chi tiết từ Database Neon
    if (!targetProduct?.variants || targetProduct.variants.length === 0) {
      setLoadingVariants((prev) => ({ ...prev, [productId]: true }));
      try {
        const detailed = await adminService.loadProductDetail(productId);
        if (detailed && detailed.variants) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === productId ? { ...p, variants: detailed.variants } : p
            )
          );

          // Cập nhật stock inputs
          setStockInputs((prev) => {
            const next = { ...prev };
            detailed.variants.forEach((v) => {
              if (next[v.id] === undefined) {
                next[v.id] = v.stockQuantity;
              }
            });
            return next;
          });
        }
      } finally {
        setLoadingVariants((prev) => ({ ...prev, [productId]: false }));
      }
    }
  };

  // Cập nhật số lượng tồn kho của một biến thể trực tiếp vào PostgreSQL
  const handleSaveStock = async (variantId) => {
    const newQty = Number(stockInputs[variantId]);
    if (isNaN(newQty) || newQty < 0) return;

    try {
      await adminService.updateVariantStock(variantId, newQty);
      setSavedSuccess(variantId);
      setTimeout(() => setSavedSuccess(null), 2000);

      // Cập nhật state sản phẩm (cả variants lẫn totalStock để đồng bộ giao diện)
      setProducts((prev) =>
        prev.map((p) => {
          const hasVariant = p.variants?.some((v) => v.id === variantId);
          if (!hasVariant) return p;
          const updatedVariants = p.variants.map((v) =>
            v.id === variantId ? { ...v, stockQuantity: newQty } : v
          );
          const newTotalStock = updatedVariants.reduce(
            (sum, v) => sum + (v.stockQuantity || 0),
            0
          );
          return {
            ...p,
            variants: updatedVariants,
            totalStock: newTotalStock,
          };
        })
      );
    } catch (err) {
      console.error('Lỗi khi lưu tồn kho:', err);
    }
  };

  // Đổi trạng thái đơn hàng
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái đơn:', err);
    }
  };

  // Thêm sản phẩm mới
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        imageUrl: newProduct.imageUrl || LUXURY_FALLBACK_IMG,
      };
      const created = await adminService.createProduct(payload);
      setProducts((prev) => [created, ...prev]);

      // Khởi tạo stock cho các biến thể của sản phẩm mới
      if (created.variants) {
        setStockInputs((prev) => {
          const next = { ...prev };
          created.variants.forEach((v) => {
            next[v.id] = v.stockQuantity;
          });
          return next;
        });
      }

      setShowAddModal(false);
      setNewProduct({
        name: '',
        categoryId: categories[0]?.id || 1,
        price: 15000000,
        brand: 'Bespoke Atelier',
        material: 'Lụa Tơ Tằm Thượng Hạng',
        style: 'Sang Trọng',
        occasion: 'Dạ Tiệc',
        imageUrl: '',
        description: '',
      });
    } catch (err) {
      console.error('Lỗi khi tạo sản phẩm:', err);
    }
  };

  // Sửa tác phẩm
  const handleOpenEditModal = (e, product) => {
    e.stopPropagation();
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId || product.category?.id || (categories[0]?.id ?? 1),
      brand: product.brand || 'Bespoke Atelier',
      material: product.material || 'Lụa Tơ Tằm Thượng Hạng',
      style: product.style || 'Sang Trọng',
      occasion: product.occasion || 'Dạ Tiệc',
      imageUrl: product.imageUrl || '',
      description: product.description || '',
    });
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updated = await adminService.updateProduct(editingProduct.id, editingProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p))
      );
      setEditingProduct(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật tác phẩm:', err);
    }
  };

  // Xóa tác phẩm
  const handleOpenDeleteModal = (e, product) => {
    e.stopPropagation();
    setDeletingProduct(product);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await adminService.deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      if (expandedProduct === deletingProduct.id) {
        setExpandedProduct(null);
      }
      setDeletingProduct(null);
    } catch (err) {
      console.error('Lỗi khi xóa tác phẩm:', err);
    }
  };

  // Thêm biến thể mới cho sản phẩm
  const handleOpenAddVariantModal = (productId) => {
    setVariantModalProductId(productId);
    setNewVariantData({
      sizeName: 'M',
      colorName: 'Đen Onyx',
      stockQuantity: 15,
      additionalPrice: 0,
    });
  };

  const handleSaveNewVariant = async (e) => {
    e.preventDefault();
    if (!variantModalProductId) return;

    try {
      const added = await adminService.addVariant(variantModalProductId, newVariantData);
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === variantModalProductId) {
            const currentVars = p.variants || [];
            return { ...p, variants: [...currentVars, added] };
          }
          return p;
        })
      );

      setStockInputs((prev) => ({
        ...prev,
        [added.id]: added.stockQuantity,
      }));

      setVariantModalProductId(null);
    } catch (err) {
      console.error('Lỗi khi thêm biến thể:', err);
    }
  };

  // Xóa biến thể
  const handleDeleteVariant = async (productId, variantId) => {
    if (!confirm('Bạn có chắc muốn xóa biến thể này khỏi sản phẩm?')) return;
    try {
      await adminService.deleteVariant(productId, variantId);
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              variants: (p.variants || []).filter((v) => v.id !== variantId),
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Lỗi khi xóa biến thể:', err);
    }
  };

  // Tính toán KPI thống kê
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
  const totalStockCount = products.reduce(
    (sum, p) =>
      sum + (p.variants?.reduce((vSum, v) => vSum + (v.stockQuantity || 0), 0) || 0),
    0
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-28 flex flex-col justify-center items-center gap-4">
        <Spinner size="lg" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#71717A]">
          Đang nạp dữ liệu Atelier Executive Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121212] text-[#C5A880] text-[10px] font-semibold tracking-[0.25em] uppercase border border-[#C5A880]/30 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Atelier Executive Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#121212] tracking-tight">
            Quản Trị Hệ Thống May Đo
          </h1>
          <p className="text-xs text-[#71717A] font-light">
            Toàn quyền thêm, sửa, xóa tác phẩm; quản lý biến thể Size / Màu sắc và điều phối đơn hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E4E4E7] text-xs font-semibold text-[#121212] hover:bg-[#F4F4F5] transition-colors"
          >
            <span>Xem Gian Hàng 3D</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tác Phẩm</span>
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium uppercase tracking-wider">Doanh Thu</span>
            <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#121212]">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[10px] text-[#2A4843] font-medium">Bảo chứng may đo VIP</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium uppercase tracking-wider">Đơn Hàng</span>
            <div className="w-8 h-8 rounded-full bg-[#2A4843]/10 text-[#2A4843] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#121212]">
            {orders.length}
          </div>
          <p className="text-[10px] text-[#71717A]">Đang luân chuyển</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium uppercase tracking-wider">Tác Phẩm May Đo</span>
            <div className="w-8 h-8 rounded-full bg-[#121212] text-[#C5A880] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#121212]">
            {products.length}
          </div>
          <p className="text-[10px] text-[#71717A]">{totalVariants} biến thể Size & Màu</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium uppercase tracking-wider">Tổng Tồn Kho</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#121212]">
            {totalStockCount}
          </div>
          <p className="text-[10px] text-[#71717A]">Đơn vị sẵn sàng cắt may</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-[#E4E4E7] pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-[#121212] text-white shadow-sm'
              : 'text-[#71717A] hover:text-[#121212] hover:bg-white'
          }`}
        >
          Kho Tác Phẩm & Quản Lý Biến Thể ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#121212] text-white shadow-sm'
              : 'text-[#71717A] hover:text-[#121212] hover:bg-white'
          }`}
        >
          Quản Lý Đơn Hàng May Đo ({orders.length})
        </button>
      </div>

      {/* TAB 1: KHO HÀNG & QUẢN LÝ BIẾN THỂ SIZE / MÀU */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm tác phẩm may đo theo tên hoặc thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E4E4E7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C5A880] text-[#121212]"
              />
            </div>
            <span className="text-xs text-[#71717A] hidden sm:inline">
              Nhấn vào từng tác phẩm để mở rộng danh sách biến thể Size/Màu, sửa tồn kho hoặc thêm biến thể mới
            </span>
          </div>

          <div className="rounded-3xl bg-white border border-[#E4E4E7] overflow-hidden shadow-xs divide-y divide-[#E4E4E7]">
            {filteredProducts.map((p) => {
              const isExpanded = expandedProduct === p.id;
              const isLoadingThis = loadingVariants[p.id];
              const productStock =
                p.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) ?? p.totalStock ?? 0;

              return (
                <div key={p.id} className="transition-colors">
                  {/* Hàng sản phẩm cha */}
                  <div
                    onClick={() => handleToggleExpand(p.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FAFAFA] cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={p.imageUrl || LUXURY_FALLBACK_IMG}
                        alt={p.name}
                        className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl object-cover border border-[#E4E4E7] shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-[#C5A880] uppercase tracking-wider block">
                            {p.brand || 'Bespoke Atelier'}
                          </span>
                          <span className="text-[10px] text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-full">
                            {p.categoryName || p.category?.name || 'Haute Couture'}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-serif font-semibold text-[#121212] truncate">
                          {p.name}
                        </h3>
                        <p className="text-xs text-[#71717A]">
                          Giá niêm yết: <strong>{formatCurrency(p.price)}</strong> •{' '}
                          {p.variants?.length ? `${p.variants.length} biến thể` : 'Chưa có biến thể'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      {/* Nút Sửa & Xóa Sản Phẩm */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleOpenEditModal(e, p)}
                          className="p-2 rounded-lg border border-[#E4E4E7] hover:border-[#121212] hover:bg-white text-[#71717A] hover:text-[#121212] transition-colors cursor-pointer"
                          title="Chỉnh sửa thông tin tác phẩm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleOpenDeleteModal(e, p)}
                          className="p-2 rounded-lg border border-[#E4E4E7] hover:border-red-500 hover:bg-red-50 text-[#71717A] hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa tác phẩm khỏi hệ thống"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right hidden sm:block">
                        <span className="text-xs text-[#71717A] block">Tổng Tồn Kho</span>
                        <span
                          className={`text-sm font-bold ${
                            productStock > 10
                              ? 'text-[#2A4843]'
                              : productStock > 0
                              ? 'text-amber-700'
                              : 'text-red-600'
                          }`}
                        >
                          {productStock} cái
                        </span>
                      </div>

                      <div className="p-2 rounded-full hover:bg-white text-[#71717A]">
                        {isLoadingThis ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#C5A880]" />
                        ) : isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-[#121212]" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vùng mở rộng: Quản lý biến thể Size / Màu / Tồn kho */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-[#FAFAFA] border-t border-[#E4E4E7] space-y-4 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                            <span>Chi Tiết Biến Thể May Đo ({p.variants?.length || 0})</span>
                            {isLoadingThis && (
                              <span className="text-[10px] text-[#C5A880] font-normal lowercase">
                                (Đang nạp từ Database Neon...)
                              </span>
                            )}
                          </h4>
                          <span className="text-[11px] text-[#71717A]">
                            Nhập số lượng mới và bấm biểu tượng đĩa mềm để lưu. Bấm Thùng rác để xóa biến thể.
                          </span>
                        </div>

                        {/* Nút Thêm biến thể mới */}
                        <button
                          onClick={() => handleOpenAddVariantModal(p.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm Biến Thể</span>
                        </button>
                      </div>

                      {p.variants && p.variants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {p.variants.map((v) => (
                            <div
                              key={v.id}
                              className="p-3.5 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs flex items-center justify-between gap-3"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded-md bg-[#121212] text-white text-[10px] font-bold">
                                    Size {v.sizeName}
                                  </span>
                                  <span className="text-xs font-medium text-[#121212] truncate">
                                    {v.colorName}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#71717A] block truncate">
                                  SKU: {v.sku || `#VAR-${v.id}`}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <input
                                  type="number"
                                  min="0"
                                  value={stockInputs[v.id] ?? v.stockQuantity}
                                  onChange={(e) =>
                                    setStockInputs((prev) => ({
                                      ...prev,
                                      [v.id]: e.target.value,
                                    }))
                                  }
                                  className="w-16 px-2 py-1 text-xs text-center border border-[#E4E4E7] rounded-lg font-bold text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                                />
                                <button
                                  onClick={() => handleSaveStock(v.id)}
                                  className={`p-2 rounded-lg text-white transition-colors cursor-pointer shadow-xs ${
                                    savedSuccess === v.id
                                      ? 'bg-[#2A4843]'
                                      : 'bg-[#121212] hover:bg-[#C5A880] hover:text-[#121212]'
                                  }`}
                                  title="Lưu số lượng"
                                >
                                  {savedSuccess === v.id ? (
                                    <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                                  ) : (
                                    <Save className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteVariant(p.id, v.id)}
                                  className="p-2 rounded-lg text-[#71717A] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                                  title="Xóa biến thể này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-white border border-[#E4E4E7] text-center space-y-3">
                          <p className="text-xs text-[#71717A]">
                            Tác phẩm này hiện chưa có biến thể Size/Màu sắc nào.
                          </p>
                          <button
                            onClick={() => handleOpenAddVariantModal(p.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tạo Biến Thể Đầu Tiên Cho Tác Phẩm</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ ĐƠN HÀNG MAY ĐO */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white border border-[#E4E4E7] overflow-hidden shadow-xs divide-y divide-[#E4E4E7]">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-[#71717A] text-xs">
                Chưa có đơn may đo nào trong hệ thống.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#121212] bg-[#FAFAFA] px-3 py-1 rounded-md border border-[#E4E4E7]">
                        {order.orderCode || `#BESPOKE-${order.id}`}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
                          order.status === 'DELIVERED' || order.status === 'COMPLETED'
                            ? 'bg-[#2A4843]/15 text-[#2A4843] border-[#2A4843]/30'
                            : order.status === 'SHIPPING'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'CONFIRMED'
                            ? 'bg-[#C5A880]/20 text-[#8F7249] border-[#C5A880]/40'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                        disabled={order.status === 'CONFIRMED'}
                        className="px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#121212] disabled:opacity-40 cursor-pointer"
                      >
                        Xác Nhận May Đo
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPING')}
                        disabled={order.status === 'SHIPPING'}
                        className="px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#121212] disabled:opacity-40 cursor-pointer"
                      >
                        Giao Hàng
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                        disabled={order.status === 'DELIVERED'}
                        className="px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-[#2A4843] text-white hover:bg-[#121212] disabled:opacity-40 cursor-pointer"
                      >
                        Đã Giao Hàng
                      </button>
                    </div>
                  </div>

                  {/* Thông tin khách hàng & địa chỉ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FAFAFA] p-4 rounded-xl border border-[#E4E4E7]">
                    <div>
                      <span className="text-[#71717A] block">Khách hàng:</span>
                      <strong className="text-[#121212]">{order.receiverName}</strong> (
                      {order.receiverPhone})
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Địa chỉ nhận:</span>
                      <span className="text-[#121212] truncate block">
                        {order.shippingAddress}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Tổng thanh toán:</span>
                      <strong className="text-base font-serif text-[#121212]">
                        {formatCurrency(order.totalAmount)}
                      </strong>{' '}
                      <span className="text-[10px] text-[#71717A]">({order.paymentMethod})</span>
                    </div>
                  </div>

                  {/* Danh sách items snapshot */}
                  <div className="space-y-1.5 pl-2 border-l-2 border-[#C5A880]">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-xs text-[#71717A]"
                      >
                        <span>
                          • <strong>{item.productName}</strong> ({item.sizeName} - {item.colorName}) × {item.quantity}
                        </span>
                        <span className="font-semibold text-[#121212]">
                          {formatCurrency(item.subtotal || item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL THÊM TÁC PHẨM MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <h3 className="text-lg font-serif font-semibold text-[#121212]">
                  Thêm Tác Phẩm May Đo Mới
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#121212] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#121212]">Tên tác phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đầm Dạ Hội Lụa Đính Pha Lê Swarovski"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Danh mục tác phẩm *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, categoryId: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={1}>Đầm Dạ Hội (Haute Couture)</option>
                        <option value={2}>Áo Dài Di Sản</option>
                        <option value={3}>Quần Jeans (Bespoke Denim)</option>
                        <option value={4}>Set Đồ Thiết Kế</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Thương hiệu</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    placeholder="Nhập giá (VD: 850000)"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Chất liệu</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Phong cách</label>
                  <input
                    type="text"
                    value={newProduct.style}
                    onChange={(e) => setNewProduct({ ...newProduct, style: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Dịp sử dụng</label>
                  <input
                    type="text"
                    value={newProduct.occasion}
                    onChange={(e) => setNewProduct({ ...newProduct, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              {/* Tải ảnh từ máy tính hoặc chọn presets */}
              <ImageUploader
                value={newProduct.imageUrl}
                onChange={(url) => setNewProduct({ ...newProduct, imageUrl: url })}
                label="Hình ảnh tác phẩm Haute Couture (Tải từ máy / Presets)"
              />

              <div className="space-y-1">
                <label className="font-semibold text-[#121212]">Mô tả may đo</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả chi tiết kỹ thuật may và nguồn gốc vải..."
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5] text-xs font-semibold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Lưu Tác Phẩm Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA TÁC PHẨM */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C5A880]" />
                <h3 className="text-lg font-serif font-semibold text-[#121212]">
                  Chỉnh Sửa Tác Phẩm May Đo
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#121212] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#121212]">Tên tác phẩm *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Danh mục tác phẩm *</label>
                  <select
                    value={editingProduct.categoryId || 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={1}>Đầm Dạ Hội (Haute Couture)</option>
                        <option value={2}>Áo Dài Di Sản</option>
                        <option value={3}>Quần Jeans (Bespoke Denim)</option>
                        <option value={4}>Set Đồ Thiết Kế</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Thương hiệu</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        brand: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    placeholder="Nhập giá (VD: 850000)"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Chất liệu</label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        material: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Phong cách</label>
                  <input
                    type="text"
                    value={editingProduct.style}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, style: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Dịp sử dụng</label>
                  <input
                    type="text"
                    value={editingProduct.occasion}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        occasion: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              {/* Tải ảnh từ máy tính hoặc đổi ảnh */}
              <ImageUploader
                value={editingProduct.imageUrl}
                onChange={(url) => setEditingProduct({ ...editingProduct, imageUrl: url })}
                label="Cập nhật hình ảnh (Tải file từ máy / Chọn mẫu)"
              />

              <div className="space-y-1">
                <label className="font-semibold text-[#121212]">Mô tả may đo</label>
                <textarea
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-full border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5] text-xs font-semibold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Cập Nhật Tác Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA TÁC PHẨM */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-serif font-bold text-[#121212]">
                Xác Nhận Xóa Tác Phẩm
              </h3>
              <p className="text-xs text-[#71717A]">
                Bạn có chắc chắn muốn xóa tác phẩm{' '}
                <strong className="text-[#121212]">"{deletingProduct.name}"</strong>? Toàn bộ các
                biến thể Size/Màu liên quan sẽ bị hủy bỏ.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-5 py-2.5 rounded-full border border-[#E4E4E7] text-xs font-semibold text-[#71717A] hover:bg-[#F4F4F5] cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="px-5 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM BIẾN THỂ MỚI CHO TÁC PHẨM */}
      {variantModalProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="rounded-3xl bg-white border border-[#E4E4E7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C5A880]" />
                <h3 className="text-base font-serif font-semibold text-[#121212]">
                  Thêm Biến Thể Size / Màu Mới
                </h3>
              </div>
              <button
                onClick={() => setVariantModalProductId(null)}
                className="p-1 rounded-full text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#121212] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewVariant} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Kích cỡ (Size) *</label>
                  <select
                    value={newVariantData.sizeName}
                    onChange={(e) =>
                      setNewVariantData({ ...newVariantData, sizeName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212] font-semibold"
                  >
                    {SIZE_OPTIONS.map((sz) => (
                      <option key={sz} value={sz}>
                        Size {sz}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Màu sắc may đo *</label>
                  <select
                    value={newVariantData.colorName}
                    onChange={(e) =>
                      setNewVariantData({ ...newVariantData, colorName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newVariantData.stockQuantity}
                    onChange={(e) =>
                      setNewVariantData({
                        ...newVariantData,
                        stockQuantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212] font-bold text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#121212]">Phụ phí nếu có (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={newVariantData.additionalPrice}
                    onChange={(e) =>
                      setNewVariantData({
                        ...newVariantData,
                        additionalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-[#121212]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setVariantModalProductId(null)}
                  className="px-4 py-2 rounded-full border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5] text-xs font-semibold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Tạo Biến Thể
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
