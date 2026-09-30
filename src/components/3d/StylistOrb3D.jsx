import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * StylistOrb3D - Interactive 3D Gemini AI Energy Orb / Particle Sphere
 * Rendered via Three.js with multi-layer nested geometries and mouse interactivity.
 */
export const StylistOrb3D = ({ className = 'w-48 h-48 sm:w-64 sm:h-64' }) => {
  const mountRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL is not supported for StylistOrb3D:', e);
      return;
    }

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xc5a880, 3, 20);
    goldPointLight.position.set(3, 4, 5);
    scene.add(goldPointLight);

    const tealPointLight = new THREE.PointLight(0x2a4843, 2, 20);
    tealPointLight.position.set(-3, -4, 4);
    scene.add(tealPointLight);

    // Group for all rotating elements
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // 1. Outer Particle Sphere (Gold Champagne)
    const outerGeo = new THREE.IcosahedronGeometry(2, 3);
    const outerMat = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const outerPoints = new THREE.Points(outerGeo, outerMat);
    orbGroup.add(outerPoints);

    // 2. Middle Wireframe Polyhedron (Bespoke Crystal)
    const midGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const midMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    orbGroup.add(midMesh);

    // 3. Inner Pulsing Core (Deep Forest Teal & Gold)
    const innerGeo = new THREE.OctahedronGeometry(1.0, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x2a4843,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      roughness: 0.3,
      metalness: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    orbGroup.add(innerMesh);

    // 4. Floating Orbital Ring
    const ringGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    orbGroup.add(ring);

    // Interaction state
    let targetRotationSpeed = 0.008;
    let currentRotationSpeed = 0.008;
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseX = x;
      mouseY = y;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 240;
      const newHeight = container.clientHeight || 240;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic rotation speed based on hover
      targetRotationSpeed = container.matches(':hover') ? 0.025 : 0.008;
      currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.05;

      // Mouse tilt tracking
      targetTiltX += (mouseY * 0.5 - targetTiltX) * 0.08;
      targetTiltY += (mouseX * 0.5 - targetTiltY) * 0.08;

      orbGroup.rotation.x = targetTiltX + Math.sin(elapsedTime * 0.5) * 0.05;
      orbGroup.rotation.y += currentRotationSpeed;

      // Inner counter-rotation & pulsing
      innerMesh.rotation.y -= currentRotationSpeed * 1.5;
      innerMesh.rotation.z += 0.01;
      const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.08;
      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Ring gentle wobble
      ring.rotation.z = elapsedTime * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      outerGeo.dispose();
      outerMat.dispose();
      midGeo.dispose();
      midMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      title="Bespoke AI Core — Di chuột để tương tác"
      aria-label="3D AI Fashion Stylist Interactive Orb"
    >
      {/* Ambient Glow Aura */}
      <div
        className={`absolute inset-4 rounded-full bg-[#C5A880]/15 blur-2xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-90 scale-110' : 'opacity-40'
        }`}
      />
    </div>
  );
};

export default StylistOrb3D;
