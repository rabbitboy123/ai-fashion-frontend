import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#121212] text-[#A1A1AA] py-16 mt-auto border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#27272A]">
          
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1.5 inline-block">
              <span className="font-serif font-bold text-2xl tracking-[0.2em] text-[#FAFAFA]">
                AI FASHION
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] mb-3 inline-block" />
            </Link>
            <p className="text-xs text-[#71717A] max-w-sm leading-relaxed font-light">
              Nhà mốt thời trang may đo cao cấp kết hợp trợ lý AI Stylist thông minh độc quyền, kiến tạo phong thái sang trọng và độc bản cho từng khách hàng.
            </p>
          </div>

          {/* Cột 2: Bộ sưu tập & Dịch vụ */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#FAFAFA] tracking-[0.2em] uppercase">
              Bộ Sưu Tập & AI
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  May Đo Bespoke Thu Đông 2026
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Bộ Sưu Tập Tối Giản Đương Đại
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-stylist"
                  className="text-[#C5A880] hover:text-[#DFCCA9] inline-flex items-center gap-1 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tư Vấn Trang Phục Cùng Gemini AI</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chăm sóc khách hàng */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#FAFAFA] tracking-[0.2em] uppercase">
              Dịch Vụ Khách Hàng
            </h4>
            <ul className="space-y-2.5 text-xs text-[#71717A]">
              <li>Quy chuẩn đo may & tư vấn kích thước</li>
              <li>Chính sách bảo hành & đổi trả tác phẩm</li>
              <li>Giao hàng COD bảo mật trên toàn quốc</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717A] gap-4">
          <p>© {new Date().getFullYear()} AI Fashion Shop. All rights reserved. Bespoke & Minimalist.</p>
          <p className="tracking-wider uppercase">
            Powered by Spring Boot 3 & Google Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
