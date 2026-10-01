import React from 'react';

/**
 * BrandIconP - Reusable Haute Couture Monogram 'P' Icon (Lucide-compatible)
 * @param {number|string} size - Icon dimensions in pixels (default: 24)
 * @param {string} className - Additional Tailwind CSS classes
 * @param {string} color - Primary accent color (default: Gold Champagne '#C5A880')
 */
export const BrandIconP = ({
  size = 24,
  className = '',
  color = '#C5A880',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {/* Luxury Onyx Squircle Base */}
      <rect width="64" height="64" rx="16" fill="#121212" />
      {/* Gold Hairline Inset Border */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="13"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.85"
      />

      {/* Haute Couture Serif Letter 'P' */}
      <path
        d="M19 16H29M19 48H29"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 16V48"
        stroke="#FAFAFA"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M24 18H36C42.6274 18 47 22.3726 47 29C47 35.6274 42.6274 40 36 40H24"
        stroke="#FAFAFA"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 29H36"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Champagne Diamond Sparkle Accent */}
      <path
        d="M42 22L43.5 25L46.5 26.5L43.5 28L42 31L40.5 28L37.5 26.5L40.5 25Z"
        fill={color}
      />
    </svg>
  );
};

export default BrandIconP;
