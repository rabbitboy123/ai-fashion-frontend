import React, { useRef, useState, useMemo } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Card3DTilt - 3D Perspective Tilt with Dynamic Specular Glare (High-Performance)
 * Optimized to eliminate Forced Reflow and avoid React State re-renders during mouse moves.
 */
export const Card3DTilt = ({
  children,
  className = '',
  maxTilt = 8,
  scaleOnHover = 1.02,
}) => {
  const cardRef = useRef(null);
  const boundsRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect touch screens to prevent touch scroll interference
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  }, []);

  // Springs for silky physics
  const springConfig = { damping: 22, stiffness: 240, mass: 0.4 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      boundsRef.current = cardRef.current.getBoundingClientRect();
    }
    setIsHovered(true);
  };

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || isTouchDevice || !cardRef.current) return;

    let rect = boundsRef.current;
    if (!rect) {
      rect = cardRef.current.getBoundingClientRect();
      boundsRef.current = rect;
    }

    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1

    rotateX.set(-yPct * maxTilt);
    rotateY.set(xPct * maxTilt);
    scale.set(scaleOnHover);

    // Update glare directly via CSS custom properties to bypass React Virtual DOM reconciler
    const glareX = ((mouseX / width) * 100).toFixed(1);
    const glareY = ((mouseY / height) * 100).toFixed(1);
    cardRef.current.style.setProperty('--glare-x', `${glareX}%`);
    cardRef.current.style.setProperty('--glare-y', `${glareY}%`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    boundsRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  if (shouldReduceMotion || isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1000px] ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic Specular Glare/Sheen Overlay driven by CSS variables */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background:
              'radial-gradient(circle 280px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.7) 0%, rgba(197, 168, 128, 0.15) 40%, transparent 80%)',
            mixBlendMode: 'overlay',
          }}
        />
      </motion.div>
    </div>
  );
};

export default Card3DTilt;
