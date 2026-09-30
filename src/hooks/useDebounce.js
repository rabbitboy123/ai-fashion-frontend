import { useState, useEffect } from 'react';

/**
 * Hook trì hoãn cập nhật giá trị đầu vào để tối ưu hóa tìm kiếm API realtime.
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian chờ (mặc định 400ms)
 * @returns {any} Giá trị đã được trì hoãn
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
