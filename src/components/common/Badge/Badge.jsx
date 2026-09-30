import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-[#F4F4F5] text-[#121212] border-[#E4E4E7]',
    primary: 'bg-[#2A4843]/10 text-[#2A4843] border-[#2A4843]/20', // Teal
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-[#63323E]/10 text-[#63323E] border-[#63323E]/20', // Plum
    ai: 'bg-[#C5A880]/15 text-[#8F7249] border-[#C5A880]/30', // Gold
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wider uppercase border ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
