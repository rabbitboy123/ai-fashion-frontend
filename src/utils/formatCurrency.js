/**
 * Định dạng số tiền sang định dạng tiền tệ Việt Nam (VNĐ).
 * @param {number|string} amount - Số tiền cần định dạng
 * @returns {string} Chuỗi hiển thị (ví dụ: "399.000 ₫")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(amount));
};
