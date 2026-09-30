import apiInstance from './api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

/**
 * Service kết nối Module AI Fashion Stylist
 * Giao tiếp với Endpoint /api/ai/recommend và /api/ai/history
 */
export const aiService = {
  /**
   * Yêu cầu tư vấn bộ phối thời trang Haute Couture từ AI
   * @param {Object} preferences { occasion, style, preferredColor, budgetMin, budgetMax, genderTarget }
   */
  async getRecommendation(preferences) {
    try {
      const response = await apiInstance.post(API_ENDPOINTS.AI.RECOMMEND, preferences);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/ai/recommend không phản hồi (offline/dev), chuyển sang Fallback Haute Couture:', err);
    }

    // Fallback Offline thông minh nếu Backend chưa khởi động
    return generateOfflineRecommendation(preferences);
  },

  /**
   * Lấy lịch sử tư vấn AI của người dùng
   */
  async getHistory() {
    try {
      const response = await apiInstance.get(API_ENDPOINTS.AI.HISTORY);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/ai/history không khả dụng:', err);
    }
    return [];
  },
};

/**
 * Sinh bộ dữ liệu tư vấn phong cách mẫu chuẩn mực từ ảnh thật trong MOCK_PRODUCTS
 */
function generateOfflineRecommendation(preferences) {
  const occasion = preferences?.occasion || 'Dự tiệc tối';
  const style = preferences?.style || 'Bespoke Luxury';
  const color = preferences?.preferredColor || 'Đen than';

  // Lấy 3 sản phẩm thực tế từ mockProducts
  const item1 = MOCK_PRODUCTS[0] || {
    id: 1,
    name: 'Tailored Minimal Blazer',
    categoryName: 'Áo Khoác',
    brand: 'Bespoke Atelier',
    price: 1250000,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  };

  const item2 = MOCK_PRODUCTS.find((p) => p.name?.toLowerCase().includes('jean')) || {
    id: 7,
    name: 'Classic Straight Leg Blue Jeans',
    categoryName: 'Quần & Set May Đo',
    brand: 'Bespoke Atelier',
    price: 1280000,
    imageUrl: '/src/assets/images/jean (2).jpg',
  };

  const item3 = MOCK_PRODUCTS[4] || {
    id: 5,
    name: 'Emerald Luxury Suit',
    categoryName: 'Vest & Suit',
    brand: 'Heritage Tailoring',
    price: 1450000,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
  };

  const formattedItems = [
    {
      id: item1.id,
      name: item1.name,
      category: item1.categoryName || 'Áo Khoác',
      brand: item1.brand || 'Bespoke Atelier',
      material: 'Dạ Cashmere / Cotton cao cấp',
      price: item1.price,
      imageUrl: item1.imageUrl,
      score: 98,
      matchReason: `Đúng chuẩn phong cách ${style} và sắc độ ${color}`,
      availableVariants: [
        { id: 101, size: 'M', color: color, colorHex: '#121212', stockQuantity: 12, additionalPrice: 0 },
        { id: 102, size: 'L', color: color, colorHex: '#121212', stockQuantity: 8, additionalPrice: 0 },
      ],
    },
    {
      id: item2.id,
      name: item2.name,
      category: item2.categoryName || 'Quần Jean',
      brand: item2.brand || 'Bespoke Atelier',
      material: 'Denim Nhật Bản Dệt Biên',
      price: item2.price,
      imageUrl: item2.imageUrl,
      score: 95,
      matchReason: `Tạo tỷ lệ cân bằng hình thể lý tưởng cho dịp ${occasion}`,
      availableVariants: [
        { id: 201, size: 'M', color: 'Xanh Chàm', colorHex: '#1F3A52', stockQuantity: 15, additionalPrice: 0 },
        { id: 202, size: 'L', color: 'Xanh Chàm', colorHex: '#1F3A52', stockQuantity: 10, additionalPrice: 0 },
      ],
    },
    {
      id: item3.id,
      name: item3.name,
      category: item3.categoryName || 'Phụ kiện',
      brand: item3.brand || 'Heritage Tailoring',
      material: 'Lụa Tơ Tằm Tự Nhiên',
      price: item3.price,
      imageUrl: item3.imageUrl,
      score: 93,
      matchReason: 'Điểm xuyết chiều sâu và độ tinh tế cho diện mạo',
      availableVariants: [
        { id: 301, size: 'Free Size', color: 'Vàng Cát', colorHex: '#C5A880', stockQuantity: 20, additionalPrice: 0 },
      ],
    },
  ];

  return {
    recommendationId: null,
    advice: `Dành cho dịp ${occasion} theo phong cách ${style}, sự hòa quyện giữa ${item1.name} và ${item2.name} thiết lập cấu trúc hình thể uyển chuyển, đĩnh đạc. Điểm nhấn cùng ${item3.name} sẽ tôn vinh trọn vẹn nét trang nhã, sang trọng mà vẫn giữ được sự tinh tế chuẩn mực của phong cách Haute Couture.`,
    scoreAvg: 95,
    items: formattedItems,
    createdAt: new Date().toISOString(),
  };
}
