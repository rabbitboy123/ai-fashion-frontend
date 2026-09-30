import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroSilkScene3D - 3D Procedural Silk Wave & Champagne Particle Constellation
 * Rendered with Three.js on GPU with automatic cleanup and parallax mouse tracking.
 */
export const HeroSilkScene3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL is not supported on this device:', e);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, -1, 14);

    // Ambient & Directional Lights with Champagne Gold tone
    const ambientLight = new THREE.AmbientLight(0xfafafa, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc5a880, 2.5, 30);
    pointLight.position.set(4, 6, 8);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x2a4843, 1.5, 25);
    secondaryLight.position.set(-6, -4, 6);
    scene.add(secondaryLight);

    // 1. Procedural Silk Wave Mesh
    const planeWidth = 28;
    const planeHeight = 18;
    const segmentsX = 40;
    const segmentsY = 32;
    const waveGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);
    const initialPositions = waveGeometry.attributes.position.array.slice();

    const waveMaterial = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      roughness: 0.35,
      metalness: 0.65,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
    waveMesh.rotation.x = -Math.PI / 4.5;
    waveMesh.position.y = -2;
    scene.add(waveMesh);

    // 2. Floating Champagne Gold Particle Field (Constellation)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 32;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      particleScales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.12,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Parallax mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (event.clientX / innerWidth - 0.5) * 2;
      mouseY = (event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
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

      // Smooth camera parallax easing
      targetX += (mouseX * 1.2 - targetX) * 0.05;
      targetY += (mouseY * 0.8 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = -1 - targetY;
      camera.lookAt(0, 0, 0);

      // Undulate Silk Wave Vertices
      const posAttr = waveGeometry.attributes.position;
      const positions = posAttr.array;

      for (let i = 0; i < positions.length; i += 3) {
        const origX = initialPositions[i];
        const origY = initialPositions[i + 1];

        // Complex harmonic wave equation simulating liquid silk drape
        positions[i + 2] =
          Math.sin(origX * 0.35 + elapsedTime * 0.7) * 0.85 +
          Math.cos(origY * 0.45 + elapsedTime * 0.5) * 0.65 +
          Math.sin((origX + origY) * 0.2 + elapsedTime * 0.3) * 0.4;
      }
      posAttr.needsUpdate = true;

      // Subtle rotation for wave and particle constellation
      waveMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.05;
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Clean unmount to prevent WebGL memory leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      waveGeometry.dispose();
      waveMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
};

export default HeroSilkScene3D;
