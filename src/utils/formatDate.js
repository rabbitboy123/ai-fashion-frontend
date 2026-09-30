/**
 * Định dạng chuỗi ngày tháng sang định dạng ngày giờ Việt Nam.
 * @param {string|Date} dateString - Thời gian đầu vào
 * @returns {string} Chuỗi hiển thị (ví dụ: "27/09/2026 22:30")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
