/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
          surface: '#F4F4F5',
          dark: '#121212',
          charcoal: '#1E1E22',
          muted: '#71717A',
          border: '#E4E4E7',
        },
        triadic: {
          gold: '#C5A880',      /* Primary Accent: Nút chính, AI recommendation, badge nổi bật */
          'gold-hover': '#B5976F',
          teal: '#2A4843',      /* Secondary Accent: Tag còn hàng, phong cách, danh mục */
          'teal-hover': '#1F3834',
          plum: '#63323E',      /* Tertiary Accent: Sale badge, thông báo đặc biệt */
          'plum-hover': '#502631',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'luxury-card': '0 4px 20px -2px rgba(18, 18, 18, 0.04), 0 2px 6px -1px rgba(18, 18, 18, 0.02)',
        'luxury-hover': '0 12px 30px -4px rgba(18, 18, 18, 0.07), 0 4px 10px -2px rgba(18, 18, 18, 0.03)',
        'luxury-elevated': '0 20px 35px -5px rgba(18, 18, 18, 0.08), 0 8px 15px -3px rgba(18, 18, 18, 0.04)',
      },
      letterSpacing: {
        'luxury-wider': '0.05em',
        'luxury-widest': '0.15em',
      },
      borderWidth: {
        'luxury': '1px',
      },
    },
  },
  plugins: [],
};
