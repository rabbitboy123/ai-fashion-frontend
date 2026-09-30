import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, cubicBezier } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroSilkScene3D from '@/components/3d/HeroSilkScene3D';

// Đường cong Decelerate chuẩn thời trang cao cấp theo SKILL.md
const easeDecelerate = cubicBezier(0.16, 1, 0.3, 1);

export const HeroSection = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Tầng Primary Motion: Cuộn trang điều khiển Tiêu đề và Thẻ Lookbook
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -50], { ease: easeDecelerate });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.15], { ease: easeDecelerate });

  const imageScale = useTransform(scrollYProgress, [0, 0.8], [0.94, 1.0], { ease: easeDecelerate });
  const imageRadius = useTransform(scrollYProgress, [0, 0.8], ['24px', '16px'], { ease: easeDecelerate });

  return (
    <section ref={containerRef} className="relative h-[160vh] bg-[#FAFAFA]">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Tầng 3D Background: Lụa gợn sóng & chòm sao hạt vàng Champagne */}
        <HeroSilkScene3D />

        
        {/* Tầng 1: Sub-label & Editorial Headline */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : titleY,
            opacity: shouldReduceMotion ? 1 : titleOpacity,
          }}
          className="text-center space-y-3 max-w-3xl mx-auto z-10 pt-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-[#C5A880] text-[11px] font-semibold tracking-[0.22em] uppercase shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#121212] tracking-tight leading-[1.08]">
            Vẻ Đẹp May Đo <br className="hidden sm:inline" />
            <span className="italic font-light text-[#71717A]">Vượt Thời Gian</span>
          </h1>
        </motion.div>

        {/* Tầng 2: Lookbook Centerpiece với tỷ lệ cân đối 16:10 không bị dẹt */}
        <motion.div
          style={{
            scale: shouldReduceMotion ? 1 : imageScale,
            borderRadius: shouldReduceMotion ? '16px' : imageRadius,
          }}
          className="relative w-full max-w-4xl aspect-[16/10] overflow-hidden shadow-sm border border-[#E4E4E7] my-auto bg-white"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Bespoke Luxury Lookbook"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/50 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#121212]/85 backdrop-blur-md text-[#C5A880] text-[10px] font-semibold tracking-[0.2em] uppercase border border-[#C5A880]/30">
              Lookbook N° 01
            </span>
            <span className="text-white text-xs hidden sm:inline tracking-wider font-light">
              Cashmere & Lụa Tự Nhiên
            </span>
          </div>
        </motion.div>

        {/* Tầng 3: Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 z-10 pb-2">
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#121212] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#C5A880] hover:text-[#121212] transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <span>Khám Phá BST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>

          <Link to="/ai-stylist">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#121212] border border-[#C5A880] text-xs font-semibold tracking-widest uppercase hover:bg-[#C5A880]/10 transition-colors duration-300 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>AI Fashion Stylist</span>
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
