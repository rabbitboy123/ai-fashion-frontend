import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Sparkle } from 'lucide-react';
import { productService } from '@/services/productService';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import ProductGrid from '@/components/product/ProductGrid/ProductGrid';
import HeroSection from './components/HeroSection';
import StylistOrb3D from '@/components/3d/StylistOrb3D';

const LUXURY_BRANDS = [
  'MAISON MINIMAL',
  'HERITAGE TAILORING',
  'ATELIER BESPOKE',
  'STUDIO NORDIC',
  "L'ÉLÉGANCE PARIS",
  'MONOGRAMME STUDIO',
];

const CATEGORY_SPOTLIGHTS = [
  {
    id: 1,
    title: 'May Đo Bespoke',
    subtitle: 'Kỹ nghệ thủ công hoàn mỹ',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    link: '/products',
  },
  {
    id: 2,
    title: 'Dạ Tiệc Thượng Lưu',
    subtitle: 'Nét kiêu sa vượt thời gian',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
    link: '/products',
  },
  {
    id: 3,
    title: 'Tối Giản Đương Đại',
    subtitle: 'Phong thái tự nhiên thuần khiết',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    link: '/products',
  },
];

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts({ size: 6 });
        if (data?.content && data.content.length > 0) {
          setFeaturedProducts(data.content);
        } else {
          setFeaturedProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.warn('Backend chưa sẵn sàng, sử dụng dữ liệu mẫu thời trang cao cấp:', err);
        setFeaturedProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 -mt-6 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* 1. Hero Section với Sticky Scroll Pinning */}
      <HeroSection />

      {/* 2. Brand Partner Marquee */}
      <section className="border-y border-[#E4E4E7] py-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-[#71717A] mb-4 font-semibold">
            Đại Diện Cho Các Nhà Mốt Danh Tiếng
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70">
            {LUXURY_BRANDS.map((brand, i) => (
              <span
                key={i}
                className="font-serif text-xs sm:text-sm tracking-[0.2em] font-medium text-[#121212] whitespace-nowrap"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Editorial Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-semibold text-[#C5A880] tracking-[0.2em] uppercase">
            Curated Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#121212] tracking-tight">
            Phong Cách Thời Trang Tiêu Biểu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORY_SPOTLIGHTS.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#E4E4E7] shadow-xs"
            >
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-[#121212]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-[#C5A880] font-medium">
                  {cat.subtitle}
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-semibold">{cat.title}</h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#C5A880] transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Curated Selection (Lưới sản phẩm 3 cột) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#121212] tracking-tight">
              Tác Phẩm May Đo Nổi Bật
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold tracking-widest uppercase text-[#121212] hover:text-[#C5A880] inline-flex items-center gap-1.5 transition-colors group"
          >
            <span>Toàn bộ bộ sưu tập</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          isLoading={loading}
          emptyTitle="Chưa có sản phẩm"
          emptyDescription="Các thiết kế mới đang được hoàn thiện và cập nhật."
        />
      </section>

      {/* 5. AI Stylist Interactive Teaser with 3D Energy Orb */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-[#C5A880]/40 p-8 sm:p-14 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold tracking-wider uppercase">
              <Sparkle className="w-3.5 h-3.5" />
              <span>Trợ Lý Thời Trang Trí Tuệ Nhân Tạo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#121212] tracking-tight leading-tight">
              Khám Phá Phong Cách Độc Bản May Đo Riêng Bạn
            </h2>

            <p className="text-sm text-[#71717A] leading-relaxed font-light">
              Tận dụng sức mạnh từ Google Gemini AI kết hợp thuật toán chấm điểm thời trang chuyên biệt để tìm ra trang phục hoàn hảo theo dịp sự kiện, tone màu yêu thích và ngân sách của bạn.
            </p>

            <div className="pt-2">
              <Link to="/ai-stylist">
                <button className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-widest transition-colors duration-300 shadow-sm cursor-pointer">
                  <span>Trải Nghiệm AI Stylist Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Khối 3D Stylist Orb tương tác */}
          <div className="shrink-0 flex flex-col items-center justify-center p-4">
            <StylistOrb3D className="w-56 h-56 sm:w-72 sm:h-72" />
            <span className="text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-semibold mt-2">
              Bespoke 3D AI Core
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
