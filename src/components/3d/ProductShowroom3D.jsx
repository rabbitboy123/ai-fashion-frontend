import React, { useRef, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { Eye, Sparkles } from 'lucide-react';

/**
 * ProductShowroom3D - Interactive 3D Virtual Showroom Stage for Product Details
 * Uses 3D Perspective Canvas with dynamic studio lighting simulation, mouse-driven tilt, and specular highlights.
 */
export const ProductShowroom3D = ({
  imageUrl,
  alt = 'Tác phẩm may đo cao cấp',
  badgeText = 'Bespoke Atelier',
  maxTilt = 12,
}) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const shouldReduceMotion = useReducedMotion();

  // 3D Springs
  const springConfig = { damping: 22, stiffness: 200, mass: 0.6 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    rotateX.set(-yPct * maxTilt);
    rotateY.set(xPct * maxTilt);
    scale.set(1.025);

    setLightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative [perspective:1200px] w-full aspect-[3/4] select-none"
    >
      {/* 3D Floating Stage Platform */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-white border border-[#E4E4E7] shadow-xl transition-shadow duration-500 hover:shadow-2xl hover:border-[#C5A880]/50"
      >
        {/* Layer 1: Product Artwork (Base Z) */}
        <div className="w-full h-full relative overflow-hidden bg-[#F4F4F5]">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'}
            alt={alt}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />

          {/* Layer 2: Studio Spotlight Shader Simulation (Moves with mouse) */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.45 : 0.15,
              background: `radial-gradient(circle 350px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(197, 168, 128, 0.2) 35%, transparent 75%)`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Vignette Shadow for Cinematic Luxury Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Layer 3: Floating 3D Badge (translateZ 25px) */}
        <div className="absolute top-4 left-4 z-20 [transform:translateZ(25px)]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121212]/85 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/40 text-[10px] font-semibold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>{badgeText}</span>
          </div>
        </div>

        {/* Layer 4: Interactive 3D Indicator Badge (translateZ 30px) */}
        <div className="absolute bottom-4 right-4 z-20 [transform:translateZ(30px)]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#121212] border border-[#E4E4E7] text-[10px] font-medium tracking-wide shadow-xs opacity-80 group-hover:opacity-100">
            <Eye className="w-3 h-3 text-[#C5A880]" />
            <span>3D Interactive Stage</span>
          </div>
        </div>
      </motion.div>

      {/* Dynamic 3D Pedestal Shadow Beneath Stage */}
      <div
        className="absolute -bottom-4 inset-x-8 h-8 rounded-full bg-[#121212]/15 blur-xl transition-all duration-300 pointer-events-none"
        style={{
          transform: isHovered ? 'scale(1.08) translateY(6px)' : 'scale(0.95)',
          opacity: isHovered ? 0.35 : 0.15,
        }}
      />
    </div>
  );
};

export default ProductShowroom3D;
