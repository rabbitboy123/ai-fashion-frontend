import React, { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { useDebounce } from '@/hooks/useDebounce';
import ProductGrid from '@/components/product/ProductGrid/ProductGrid';
import CollectionStage3D from '@/components/3d/CollectionStage3D';

export const ProductsPage = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null); // null, 'MEN', 'WOMEN', 'UNISEX'
  const [priceRange, setPriceRange] = useState('ALL'); // 'ALL', 'UNDER_2M', '2M_5M', '5M_10M', 'ABOVE_10M'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'priceAsc', 'priceDesc'

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Tải danh mục
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res?.data) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.warn('Backend chưa sẵn sàng:', err);
      }
    };
    loadCategories();
  }, []);

  // Tải sản phẩm theo bộ lọc
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = { size: 36 };
        if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedGender) params.genderTarget = selectedGender;

        if (priceRange === 'UNDER_2M') {
          params.maxPrice = 2000000;
        } else if (priceRange === '2M_5M') {
          params.minPrice = 2000000;
          params.maxPrice = 5000000;
        } else if (priceRange === '5M_10M') {
          params.minPrice = 5000000;
          params.maxPrice = 10000000;
        } else if (priceRange === 'ABOVE_10M') {
          params.minPrice = 10000000;
        }

        if (sortBy) params.sortBy = sortBy;

        const res = await productService.getProducts(params);
        const productList =
          res?.data?.content ||
          res?.content ||
          (Array.isArray(res?.data) ? res.data : null);
        if (productList && productList.length > 0) {
          setProducts(productList);
        } else if (
          !debouncedSearch.trim() &&
          !selectedCategory &&
          !selectedGender &&
          priceRange === 'ALL'
        ) {
          setProducts(MOCK_PRODUCTS);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.warn('Sử dụng dữ liệu mẫu cho bộ sưu tập:', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, selectedCategory, selectedGender, priceRange, sortBy]);

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* 3D Runway Stage Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E4E4E7] bg-[#121212] shadow-xl">
        <CollectionStage3D className="w-full h-56 sm:h-72" />

        {/* Ambient Top Content overlay */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between pointer-events-none z-10 bg-gradient-to-t from-[#121212]/60 via-transparent to-[#121212]/20">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C5A880] text-[10px] font-semibold tracking-[0.25em] uppercase border border-[#C5A880]/30">
              <Sparkles className="w-3 h-3" />
              <span>Haute Couture 3D Runway</span>
            </div>
            <span className="hidden sm:inline text-[11px] text-[#A1A1AA] tracking-widest uppercase font-light">
              Paris / Milan Season 2026
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-serif text-white tracking-tight leading-tight">
              Sàn Diễn May Đo 3 Chiều
            </h1>
            <p className="text-xs text-[#A1A1AA] font-light max-w-lg">
              Rê chuột trên sàn diễn để điều hướng luồng sáng studio và chiêm ngưỡng các thiết kế độc bản.
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Category 3D Pills */}
      <div className="flex flex-col gap-4 pb-6 border-b border-[#E4E4E7]">
        {/* Row 1: Category Pills + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                selectedCategory === null
                  ? 'bg-[#121212] text-white shadow-md ring-2 ring-[#C5A880] ring-offset-2 ring-offset-[#FAFAFA]'
                  : 'bg-white text-[#71717A] hover:text-[#121212] hover:border-[#121212] border border-[#E4E4E7]'
              }`}
            >
              Tất Cả Tác Phẩm
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-[#121212] text-white shadow-md ring-2 ring-[#C5A880] ring-offset-2 ring-offset-[#FAFAFA]'
                    : 'bg-white text-[#71717A] hover:text-[#121212] hover:border-[#121212] border border-[#E4E4E7]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar with 3D Focus Sheen */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tác phẩm, thương hiệu..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E4E4E7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880] transition-all shadow-xs text-[#121212]"
            />
          </div>
        </div>

        {/* Row 2: Gender Target Pills (CAT-03) + Price Range & Sort (CAT-04) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F4F4F5]">
          {/* Gender Filter Pills (CAT-03) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mr-1 hidden sm:inline">
              Giới tính:
            </span>
            {[
              { id: null, label: 'Tất Cả' },
              { id: 'MEN', label: 'Thời Trang Nam' },
              { id: 'WOMEN', label: 'Thời Trang Nữ' },
              { id: 'UNISEX', label: 'Thiết Kế Unisex' },
            ].map((gender) => (
              <button
                key={gender.label}
                onClick={() => setSelectedGender(gender.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] tracking-wider font-medium transition-all duration-200 cursor-pointer ${
                  selectedGender === gender.id
                    ? 'bg-[#121212] text-white shadow-xs ring-1 ring-[#C5A880]'
                    : 'bg-[#F4F4F5] text-[#71717A] hover:text-[#121212] hover:bg-[#E4E4E7]'
                }`}
              >
                {gender.label}
              </button>
            ))}
          </div>

          {/* Price Range & Sort Filters (CAT-04) */}
          <div className="flex items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] hidden lg:inline">
                Khoảng giá:
              </span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-[#E4E4E7] rounded-xl text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#C5A880] cursor-pointer"
              >
                <option value="ALL">Tất cả mức giá</option>
                <option value="UNDER_2M">Dưới 2.000.000đ</option>
                <option value="2M_5M">2.000.000đ - 5.000.000đ</option>
                <option value="5M_10M">5.000.000đ - 10.000.000đ</option>
                <option value="ABOVE_10M">Trên 10.000.000đ</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] hidden lg:inline">
                Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-[#E4E4E7] rounded-xl text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#C5A880] cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp đến Cao</option>
                <option value="priceDesc">Giá: Cao đến Thấp</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== null ||
              selectedGender !== null ||
              priceRange !== 'ALL' ||
              sortBy !== 'newest' ||
              searchTerm.trim() !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedGender(null);
                  setPriceRange('ALL');
                  setSortBy('newest');
                  setSearchTerm('');
                }}
                className="text-[11px] font-medium text-[#C5A880] hover:text-[#8F7249] hover:underline cursor-pointer transition-colors whitespace-nowrap"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Product Grid */}
      <ProductGrid
        products={products}
        isLoading={loading}
        emptyTitle="Không tìm thấy tác phẩm"
        emptyDescription="Không có thiết kế nào phù hợp với danh mục hoặc từ khóa tìm kiếm này."
      />
    </div>
  );
};

export default ProductsPage;
