import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, CheckCircle, Wand2, Loader2, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import StylistOrb3D from '@/components/3d/StylistOrb3D';
import Card3DTilt from '@/components/3d/Card3DTilt';
import { aiService } from '@/services/aiService';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const OCCASIONS = [
  { id: 'party', label: 'Dự tiệc tối', backendValue: 'Dạ tiệc' },
  { id: 'work', label: 'Đi làm / Công sở', backendValue: 'Công sở' },
  { id: 'casual', label: 'Dạo phố cao cấp', backendValue: 'Dạo phố' },
  { id: 'dating', label: 'Hẹn hò lãng mạn', backendValue: 'Hẹn hò' },
];

const STYLES = [
  { id: 'luxury', label: 'Bespoke Luxury', backendValue: 'Bespoke Luxury' },
  { id: 'minimalist', label: 'Tối giản (Minimalist)', backendValue: 'Tối giản' },
  { id: 'classic', label: 'Cổ điển (Classic)', backendValue: 'Cổ điển' },
  { id: 'smart-casual', label: 'Smart Casual', backendValue: 'Smart Casual' },
];

const COLORS = [
  { id: 'charcoal', label: 'Đen than', hex: '#1E1E22', backendValue: 'Đen' },
  { id: 'cream', label: 'Trắng kem', hex: '#FDFBF7', backendValue: 'Trắng' },
  { id: 'gold', label: 'Vàng cát', hex: '#C5A880', backendValue: 'Vàng' },
  { id: 'teal', label: 'Xanh rêu', hex: '#2A4843', backendValue: 'Xanh' },
  { id: 'plum', label: 'Đỏ mận', hex: '#63323E', backendValue: 'Đỏ' },
];

const BUDGETS = [
  { id: 'b1', label: 'Dưới 1 triệu', min: 0, max: 1000000 },
  { id: 'b2', label: '1 - 3 triệu', min: 1000000, max: 3000000 },
  { id: 'b3', label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { id: 'b4', label: 'Trên 5 triệu', min: 5000000, max: 30000000 },
];

const GENDERS = [
  { id: 'UNISEX', label: 'Tất cả (Unisex)', backendValue: 'UNISEX' },
  { id: 'FEMALE', label: 'Nữ giới (Womenswear)', backendValue: 'WOMEN' },
  { id: 'MALE', label: 'Nam giới (Menswear)', backendValue: 'MEN' },
];

export const AIStylistPage = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
  const [selectedBudget, setSelectedBudget] = useState(BUDGETS[1].id);
  const [selectedGender, setSelectedGender] = useState(GENDERS[0].id);

  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [addedAll, setAddedAll] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');

  // Lịch sử tư vấn
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Tự động khởi tạo bộ gợi ý ban đầu khi vào trang
  useEffect(() => {
    let isMounted = true;
    const fetchInitialRecommendation = async () => {
      setIsGenerating(true);
      try {
        const occObj = OCCASIONS.find((o) => o.id === OCCASIONS[0].id);
        const stObj = STYLES.find((s) => s.id === STYLES[0].id);
        const colObj = COLORS.find((c) => c.id === COLORS[0].id);
        const bgObj = BUDGETS.find((b) => b.id === BUDGETS[1].id);

        const data = await aiService.getRecommendation({
          occasion: occObj.backendValue,
          style: stObj.backendValue,
          preferredColor: colObj.backendValue,
          budgetMin: bgObj.min,
          budgetMax: bgObj.max,
          genderTarget: GENDERS[0].backendValue,
        });

        if (isMounted && data) {
          setRecommendation(data);
        }
      } catch (err) {
        console.warn('Lỗi khi tải gợi ý ban đầu:', err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    fetchInitialRecommendation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý bấm nút Phân tích phối đồ
  const handleGenerate = async () => {
    setIsGenerating(true);
    setAddedAll(false);
    setAddedItemIds(new Set());

    try {
      const occObj = OCCASIONS.find((o) => o.id === selectedOccasion);
      const stObj = STYLES.find((s) => s.id === selectedStyle);
      const colObj = COLORS.find((c) => c.id === selectedColor);
      const bgObj = BUDGETS.find((b) => b.id === selectedBudget);
      const genObj = GENDERS.find((g) => g.id === selectedGender);

      const data = await aiService.getRecommendation({
        occasion: occObj?.backendValue || 'Dạ tiệc',
        style: stObj?.backendValue || 'Bespoke Luxury',
        preferredColor: colObj?.backendValue || 'Đen',
        budgetMin: bgObj?.min,
        budgetMax: bgObj?.max,
        genderTarget: genObj?.backendValue || 'UNISEX',
      });

      if (data) {
        setRecommendation(data);
      }
    } catch (err) {
      console.error('Lỗi khi tạo gợi ý AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Mở modal lịch sử tư vấn
  const handleOpenHistory = async () => {
    setShowHistoryModal(true);
    setLoadingHistory(true);
    try {
      const data = await aiService.getHistory();
      setHistoryList(data || []);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Áp dụng bộ trang phục từ lịch sử tư vấn
  const handleLoadHistoryItem = (historyItem) => {
    setRecommendation(historyItem);
    setShowHistoryModal(false);
    setAddedItemIds(new Set());
    setAddedAll(false);
    showToast('Đã tải bộ phối đồ từ lịch sử tư vấn!');
  };

  // Thêm 1 món lẻ vào giỏ hàng (chuẩn hóa variant thích ứng hoàn hảo với CartContext)
  const handleAddSingleItem = async (item) => {
    try {
      const raw = item.availableVariants?.[0];
      const variant = raw
        ? {
            id: raw.id,
            sizeName: raw.sizeName || raw.size || 'M',
            colorName: raw.colorName || raw.color || 'Tiêu chuẩn',
            stockQuantity: raw.stockQuantity ?? 10,
            additionalPrice: raw.additionalPrice ?? 0,
            imageUrl: raw.imageUrl || item.imageUrl,
          }
        : {
            id: item.id,
            sizeName: 'M',
            colorName: 'Tiêu chuẩn',
            stockQuantity: 10,
            additionalPrice: 0,
            imageUrl: item.imageUrl,
          };

      await addToCart(variant, item, 1);
      setAddedItemIds((prev) => new Set([...prev, item.id]));
      showToast(`Đã thêm "${item.name}" (Size: ${variant.sizeName}, Màu: ${variant.colorName}) vào Giỏ Hàng!`);
    } catch (err) {
      console.error('Không thể thêm sản phẩm:', err);
      showToast('Không thể thêm vào giỏ hàng.');
    }
  };

  // Thêm cả 3 món (toàn bộ bộ phối đồ) vào giỏ hàng
  const handleAddAllToCart = async () => {
    if (!recommendation?.items?.length) return;

    try {
      for (const item of recommendation.items) {
        const raw = item.availableVariants?.[0];
        const variant = raw
          ? {
              id: raw.id,
              sizeName: raw.sizeName || raw.size || 'M',
              colorName: raw.colorName || raw.color || 'Tiêu chuẩn',
              stockQuantity: raw.stockQuantity ?? 10,
              additionalPrice: raw.additionalPrice ?? 0,
              imageUrl: raw.imageUrl || item.imageUrl,
            }
          : {
              id: item.id,
              sizeName: 'M',
              colorName: 'Tiêu chuẩn',
              stockQuantity: 10,
              additionalPrice: 0,
              imageUrl: item.imageUrl,
            };
        await addToCart(variant, item, 1);
      }

      setAddedAll(true);
      const allIds = new Set(recommendation.items.map((i) => i.id));
      setAddedItemIds(allIds);
      showToast('Đã thêm trọn bộ 3 tác phẩm phối sẵn vào Giỏ Hàng!');

      setTimeout(() => setAddedAll(false), 3000);
    } catch (err) {
      console.error('Lỗi khi thêm cả bộ vào giỏ hàng:', err);
      showToast('Có lỗi xảy ra khi thêm cả bộ vào giỏ hàng.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const totalOutfitPrice =
    recommendation?.items?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 sm:py-8 px-4 sm:px-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#121212] text-[#FAFAFA] border border-[#C5A880]/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section with 3D AI Energy Orb */}
      <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center">
        <StylistOrb3D className="w-32 h-32 sm:w-44 sm:h-44" />

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Styling Engine</span>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-[#121212] hover:border-[#C5A880] hover:text-[#C5A880] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Lịch Sử Tư Vấn</span>
            </button>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#121212] tracking-tight leading-tight">
          AI Fashion Stylist
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] font-light leading-relaxed">
          Tùy chỉnh thông số cá nhân để nhận lời khuyên phối đồ độc bản và danh sách tác phẩm được may đo riêng từ Google Gemini AI kết hợp dữ liệu Atelier thực tế.
        </p>
      </div>

      {/* Survey Chips Selector Form */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-[#E4E4E7] pb-4 flex items-center justify-between">
          <h2 className="text-lg font-serif text-[#121212] tracking-tight">
            Khảo Sát Định Hình Phong Cách
          </h2>
          <span className="text-xs text-[#C5A880] tracking-wider uppercase font-semibold">
            Bespoke Survey
          </span>
        </div>

        {/* 1. Dịp (Occasion) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block">
            1. Dịp xuất hiện (Occasion)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {OCCASIONS.map((occ) => {
              const active = selectedOccasion === occ.id;
              return (
                <motion.button
                  key={occ.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                    active
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#121212] shadow-sm font-semibold ring-1 ring-[#C5A880]/30'
                      : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#121212] hover:border-[#C5A880]/50'
                  }`}
                >
                  {occ.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 2. Phong cách (Style) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block">
            2. Phong cách chủ đạo (Style)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {STYLES.map((st) => {
              const active = selectedStyle === st.id;
              return (
                <motion.button
                  key={st.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                    active
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#121212] shadow-sm font-semibold ring-1 ring-[#C5A880]/30'
                      : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#121212] hover:border-[#C5A880]/50'
                  }`}
                >
                  {st.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 3. Màu sắc yêu thích (Color) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block">
            3. Gam màu ưu tiên (Preferred Color)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((col) => {
              const active = selectedColor === col.id;
              return (
                <motion.button
                  key={col.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedColor(col.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                    active
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#121212] shadow-sm font-semibold ring-1 ring-[#C5A880]/30'
                      : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#121212] hover:border-[#C5A880]/50'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 4. Ngân sách dự kiến (Budget) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block">
            4. Khung ngân sách (Budget)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {BUDGETS.map((bg) => {
              const active = selectedBudget === bg.id;
              return (
                <motion.button
                  key={bg.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedBudget(bg.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                    active
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#121212] shadow-sm font-semibold ring-1 ring-[#C5A880]/30'
                      : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#121212] hover:border-[#C5A880]/50'
                  }`}
                >
                  {bg.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 5. Đối tượng may đo (Gender Target) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block">
            5. Phân khúc đối tượng (Target)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {GENDERS.map((gen) => {
              const active = selectedGender === gen.id;
              return (
                <motion.button
                  key={gen.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedGender(gen.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                    active
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#121212] shadow-sm font-semibold ring-1 ring-[#C5A880]/30'
                      : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#121212] hover:border-[#C5A880]/50'
                  }`}
                >
                  {gen.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#121212] text-[#FAFAFA] hover:bg-[#C5A880] hover:text-[#121212] text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shadow-md cursor-pointer disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                <span>AI Đang Phân Tích & Phối Đồ...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Khởi Tạo Gợi Ý Phối Đồ</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* AI Recommendation Showcase */}
      <AnimatePresence mode="wait">
        {recommendation && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Gemini Advice Quote Block */}
            <div className="bg-white rounded-2xl border border-[#E4E4E7] border-l-4 border-l-[#C5A880] p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A880]/15 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider">
                      Lời Khuyên Từ Gemini Haute Couture Stylist
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A4843]/10 text-[#2A4843] font-bold">
                      Độ hòa hợp: {recommendation.scoreAvg}%
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#121212]/90 font-serif leading-relaxed italic">
                    "{recommendation.advice}"
                  </p>
                </div>
              </div>
            </div>

            {/* Top 3 Recommended Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-[#121212] tracking-tight">
                  Top 3 Tác Phẩm Đề Xuất Cho Bộ Trang Phục
                </h3>
                <span className="text-xs text-[#71717A]">
                  Tuyển chọn từ kho lưu trữ Bespoke
                </span>
              </div>

              {(!recommendation.items || recommendation.items.length === 0) ? (
                <div className="py-12 text-center text-[#71717A] bg-white rounded-2xl border border-[#E4E4E7] p-8 space-y-2">
                  <p className="font-serif text-base text-[#121212]">Chưa tìm thấy tác phẩm hoàn toàn phù hợp</p>
                  <p className="text-xs">Quý khách vui lòng thử nới rộng khung ngân sách hoặc lựa chọn phong cách khác.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendation.items.map((item, idx) => {
                    const isItemAdded = addedItemIds.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4 }}
                        className="h-full"
                      >
                        <Card3DTilt maxTilt={8} className="h-full">
                          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5A880]/50 transition-all duration-300 flex flex-col h-full group [transform-style:preserve-3d]">
                            <div className="relative aspect-3/4 bg-[#F4F4F5] overflow-hidden [transform:translateZ(10px)]">
                              <img
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'}
                                alt={item.name}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop';
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              />
                              <div className="absolute top-3 left-3 [transform:translateZ(20px)]">
                                <span className="px-2.5 py-1 rounded-full bg-[#121212]/85 backdrop-blur-xs text-[#C5A880] text-[11px] font-bold tracking-wider uppercase border border-[#C5A880]/30 shadow-md">
                                  Phù hợp: {item.score}%
                                </span>
                              </div>
                            </div>

                            <div className="p-4 flex flex-col flex-1 justify-between gap-3 [transform:translateZ(20px)]">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">
                                    {item.brand || 'Bespoke Atelier'}
                                  </span>
                                  <span className="text-[10px] text-[#71717A]">
                                    {item.category}
                                  </span>
                                </div>
                                <Link
                                  to={`/products/${item.id}`}
                                  className="text-sm font-semibold text-[#121212] hover:text-[#C5A880] transition-colors line-clamp-1 block"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-[11px] text-[#71717A] mt-1.5 leading-snug line-clamp-2">
                                  {item.matchReason}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs text-[#71717A] block text-[10px] uppercase">
                                    Giá niêm yết
                                  </span>
                                  <span className="text-sm font-bold text-[#121212]">
                                    {formatCurrency(item.price)}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleAddSingleItem(item)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    isItemAdded
                                      ? 'bg-[#2A4843] text-white'
                                      : 'bg-[#FAFAFA] border border-[#E4E4E7] text-[#121212] hover:bg-[#121212] hover:text-white'
                                  }`}
                                >
                                  {isItemAdded ? (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      <span>Đã thêm</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3.5 h-3.5" />
                                      <span>Chọn món</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card3DTilt>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct All-in-One CTA Outfit Bar */}
            {recommendation.items && recommendation.items.length > 0 && (
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#C5A880]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                    Trọn Bộ Trang Phục Phối Sẵn
                  </span>
                  <div className="flex items-baseline gap-3 justify-center sm:justify-start">
                    <span className="text-2xl font-bold text-[#121212]">
                      {formatCurrency(totalOutfitPrice)}
                    </span>
                    <span className="text-xs text-[#71717A] font-light">
                      (Bao gồm {recommendation.items.length} tác phẩm đề xuất)
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAllToCart}
                  className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg ${
                    addedAll
                      ? 'bg-[#2A4843] text-white'
                      : 'bg-[#121212] text-[#FAFAFA] hover:bg-[#C5A880] hover:text-[#121212]'
                  }`}
                >
                  {addedAll ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Đã Thêm Trọn Bộ Vào Giỏ Hàng!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Thêm Toàn Bộ Outfit Vào Giỏ Hàng</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Slide-over Drawer / Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#E4E4E7]"
            >
              <div className="p-6 border-b border-[#E4E4E7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#C5A880]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#121212]">
                      Lịch Sử Tư Vấn Phong Cách
                    </h3>
                    <p className="text-xs text-[#71717A]">
                      Các bộ phối đồ may đo Haute Couture đã được AI gợi ý riêng cho bạn
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 text-[#71717A] hover:text-[#121212] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {loadingHistory ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#71717A]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C5A880]" />
                    <span className="text-xs">Đang tải lịch sử tư vấn...</span>
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="py-12 text-center text-[#71717A] space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-[#C5A880]/60" />
                    <p className="text-sm font-medium text-[#121212]">Chưa có lịch sử tư vấn nào</p>
                    <p className="text-xs">
                      Hãy hoàn thành khảo sát và bấm "Khởi tạo gợi ý" để lưu giữ bộ phối đầu tiên.
                    </p>
                  </div>
                ) : (
                  historyList.map((item, idx) => (
                    <div
                      key={item.recommendationId || idx}
                      className="p-4 rounded-xl border border-[#E4E4E7] hover:border-[#C5A880]/50 transition-all bg-[#FAFAFA] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#C5A880]">
                          Phiên tư vấn #{item.recommendationId || idx + 1}
                        </span>
                        <span className="text-[#71717A]">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                        </span>
                      </div>
                      <p className="text-xs text-[#121212]/90 italic font-serif leading-relaxed line-clamp-2">
                        "{item.advice}"
                      </p>
                      {item.items && item.items.length > 0 && (
                        <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7]/60">
                          <div className="flex items-center gap-2">
                            {item.items.slice(0, 3).map((prod) => (
                              <img
                                key={prod.id}
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-9 h-9 object-cover rounded-lg border border-[#E4E4E7]"
                              />
                            ))}
                            <span className="text-xs text-[#71717A] font-medium ml-1">
                              {item.items.length} tác phẩm
                            </span>
                          </div>
                          <button
                            onClick={() => handleLoadHistoryItem(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#121212] text-white hover:bg-[#C5A880] hover:text-[#121212] text-xs font-medium transition-colors cursor-pointer"
                          >
                            Xem & Đặt bộ này
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIStylistPage;
