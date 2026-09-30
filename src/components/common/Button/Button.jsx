import React from 'react';
import Spinner from '../Spinner/Spinner';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-xs';

  const variantClasses = {
    primary: 'bg-[#121212] hover:bg-[#C5A880] hover:text-[#121212] text-white focus:ring-[#C5A880] shadow-xs',
    secondary: 'bg-white hover:bg-[#F4F4F5] text-[#121212] border border-[#E4E4E7] focus:ring-[#C5A880]',
    outline: 'border border-[#C5A880] text-[#121212] hover:bg-[#C5A880]/10 focus:ring-[#C5A880]',
    danger: 'bg-[#63323E] hover:bg-[#4E2630] text-white focus:ring-[#63323E]',
    ghost: 'hover:bg-[#F4F4F5] text-[#121212] focus:ring-gray-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 gap-1.5',
    md: 'px-6 py-2.5 gap-2',
    lg: 'px-8 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" className="mr-1.5" />
      ) : (
        Icon && <Icon className="w-3.5 h-3.5 shrink-0" />
      )}
      {children}
    </button>
  );
};

export default Button;
