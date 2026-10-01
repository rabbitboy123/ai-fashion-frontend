import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShoppingBag, User, LogOut, ChevronDown, Shield } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useCart from '@/hooks/useCart';
import BrandIconP from '@/components/common/BrandIconP';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setDropdownOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E4E4E7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Typography Serif Tối Giản kết hợp Monogram P */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <BrandIconP size={32} className="group-hover:scale-105 transition-transform duration-300" />
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-2xl tracking-[0.2em] text-[#121212] group-hover:text-[#C5A880] transition-colors">
                AI FASHION
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] mb-3 inline-block" />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors hover:text-[#C5A880] ${
                isActive('/') ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#71717A]'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors hover:text-[#C5A880] ${
                isActive('/products') ? 'text-[#121212] font-bold border-b border-[#121212] pb-0.5' : 'text-[#71717A]'
              }`}
            >
              Bộ sưu tập
            </Link>
            <Link
              to="/ai-stylist"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                isActive('/ai-stylist')
                  ? 'bg-[#121212] text-white shadow-sm'
                  : 'bg-white text-[#121212] border border-[#C5A880]/60 hover:bg-[#C5A880]/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>AI Stylist</span>
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-[#121212] hover:text-[#C5A880] hover:bg-white transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#121212] text-[#C5A880] border border-[#C5A880]/40 text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#E4E4E7] hover:border-[#C5A880] transition-colors shadow-xs cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#121212] text-[#C5A880] font-semibold text-[11px] flex items-center justify-center">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-[#121212] max-w-[120px] truncate">
                    {user?.fullName?.split(' ').pop() || user?.fullName || 'Thành viên'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#71717A] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E4E4E7] shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-[#E4E4E7]">
                      <p className="text-xs font-semibold text-[#121212] truncate">{user?.fullName}</p>
                      <p className="text-[11px] text-[#71717A] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                        {user?.role === 'ROLE_ADMIN' ? 'Quản Trị Viên' : 'Thành Viên VIP'}
                      </span>
                    </div>

                    {user?.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#121212] hover:bg-[#F4F4F5] transition-colors border-b border-[#E4E4E7]"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Quản Trị Atelier</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50/60 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium text-[#121212] hover:bg-white border border-transparent hover:border-[#E4E4E7] transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#71717A]" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
