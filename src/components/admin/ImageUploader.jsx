import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Sparkles, X, Check } from 'lucide-react';

const LUXURY_PRESETS = [
  {
    id: 1,
    title: 'Quần Jean Ống Đứng Classic',
    url: '/src/assets/images/jean (2).jpg',
  },
  {
    id: 2,
    title: 'Jean Vintage Ripped Mài Xước',
    url: '/src/assets/images/jean (1).jpg',
  },
  {
    id: 3,
    title: 'Jean Cạp Cao Slim Fit',
    url: '/src/assets/images/jean (3).jpg',
  },
  {
    id: 4,
    title: 'Raw Selvedge Denim Thô',
    url: '/src/assets/images/jean (4).jpg',
  },
  {
    id: 5,
    title: 'Jean Xếp Gấu Boutique',
    url: '/src/assets/images/jean (5).jpg',
  },
  {
    id: 6,
    title: 'Jean Lụa Feather-Touch',
    url: '/src/assets/images/jean (6).jpg',
  },
  {
    id: 7,
    title: 'Đầm Lụa Thêu Tay',
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Măng Tô Dạ Cashmere',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 9,
    title: 'Vest Bespoke Hoàng Gia',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 10,
    title: 'Blazer May Đo Cao Cấp',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
  },
];

/**
 * Component Tải Ảnh Tác Phẩm Thời Trang
 * Hỗ trợ:
 * 1. Tải file từ máy tính (Kéo thả hoặc Click chọn) qua FileReader
 * 2. Chọn nhanh từ Bộ sưu tập mẫu Couture Presets
 * 3. Nhập trực tiếp URL hình ảnh
 */
export const ImageUploader = ({ value, onChange, label = 'Hình ảnh tác phẩm *' }) => {
  const [tab, setTab] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Xử lý đọc file từ máy tính
  const handleFileProcess = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file định dạng hình ảnh (.jpg, .png, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileProcess(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileProcess(file);
  };

  const handleClearImage = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-[#121212] text-xs">{label}</label>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-[#F4F4F5] p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              tab === 'upload'
                ? 'bg-white text-[#121212] shadow-2xs font-semibold'
                : 'text-[#71717A] hover:text-[#121212]'
            }`}
          >
            <span className="flex items-center gap-1">
              <Upload className="w-2.5 h-2.5" />
              Tải từ máy
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              tab === 'presets'
                ? 'bg-white text-[#121212] shadow-2xs font-semibold'
                : 'text-[#71717A] hover:text-[#121212]'
            }`}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
              Mẫu Couture
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              tab === 'url'
                ? 'bg-white text-[#121212] shadow-2xs font-semibold'
                : 'text-[#71717A] hover:text-[#121212]'
            }`}
          >
            <span className="flex items-center gap-1">
              <LinkIcon className="w-2.5 h-2.5" />
              Nhập URL
            </span>
          </button>
        </div>
      </div>

      {/* Hiển thị Preview ảnh nếu đã có */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[#E4E4E7] bg-[#FAFAFA] aspect-16/9 sm:aspect-21/9 max-h-48 flex items-center justify-center">
          <img
            src={value}
            alt="Preview tác phẩm"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-2xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full bg-white text-[#121212] text-xs font-semibold hover:bg-[#C5A880] transition-colors shadow-md cursor-pointer"
            >
              Đổi ảnh khác
            </button>
            <button
              type="button"
              onClick={handleClearImage}
              className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md cursor-pointer"
              title="Xóa ảnh này"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
            <Check className="w-3 h-3 text-[#C5A880]" />
            Đã tải ảnh lên thành công
          </span>
        </div>
      ) : (
        /* Vùng thả hoặc chọn ảnh */
        <div>
          {tab === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#C5A880] bg-[#C5A880]/10 scale-[1.01]'
                  : 'border-[#E4E4E7] bg-[#FAFAFA] hover:border-[#C5A880] hover:bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] shadow-xs flex items-center justify-center text-[#C5A880]">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#121212]">
                  Nhấn để chọn ảnh từ máy tính hoặc kéo thả vào đây
                </p>
                <p className="text-[10px] text-[#71717A]">
                  Hỗ trợ định dạng PNG, JPG, WEBP chất lượng cao
                </p>
              </div>
            </div>
          )}

          {tab === 'presets' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#71717A]">
                Nhấn chọn một mẫu Haute Couture có sẵn để gán ảnh tức thì:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {LUXURY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onChange(preset.url)}
                    className="group relative rounded-xl overflow-hidden border border-[#E4E4E7] aspect-3/4 hover:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880] transition-all cursor-pointer"
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 flex items-end p-1.5">
                      <span className="text-[9px] font-medium text-white line-clamp-1 text-left">
                        {preset.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'url' && (
            <div className="space-y-1.5">
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Dán link ảnh (https://...)"
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#C5A880] text-xs text-[#121212]"
                />
              </div>
              <p className="text-[10px] text-[#71717A]">
                Có thể dán link trực tiếp từ CDN, Unsplash hoặc Cloudinary
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
