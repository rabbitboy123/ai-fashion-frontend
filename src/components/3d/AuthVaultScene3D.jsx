import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AuthVaultScene3D - Interactive 3D WebGL Bespoke Atelier Seal & Golden Ribbons
 * Designed for Login & Register screens with mouse-following camera and ambient particle drift.
 */
export const AuthVaultScene3D = ({ className = 'w-full h-full' }) => {
  const mountRef = useRef(null);

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
      console.warn('WebGL is not supported for AuthVaultScene3D:', e);
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xc5a880, 3.5, 30);
    goldPointLight.position.set(5, 5, 6);
    scene.add(goldPointLight);

    const tealFillLight = new THREE.PointLight(0x2a4843, 2.0, 25);
    tealFillLight.position.set(-5, -4, 4);
    scene.add(tealFillLight);

    // Root Group
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // 1. Central Bespoke Atelier Crystal Seal (Dodecahedron + Wireframe)
    const sealGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    vaultGroup.add(sealMesh);

    // 2. Inner Core (Solid Gem reflecting gold light)
    const coreGeo = new THREE.OctahedronGeometry(0.9, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x121212,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    vaultGroup.add(coreMesh);

    // 3. Dual Swirling Luxury Ribbons (Torus Knots)
    const ribbonGeo1 = new THREE.TorusKnotGeometry(2.2, 0.035, 128, 16, 2, 3);
    const ribbonMat1 = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.5,
    });
    const ribbon1 = new THREE.Mesh(ribbonGeo1, ribbonMat1);
    vaultGroup.add(ribbon1);

    const ribbonGeo2 = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
    const ribbonMat2 = new THREE.MeshBasicMaterial({
      color: 0x2a4843,
      transparent: true,
      opacity: 0.4,
    });
    const ribbon2 = new THREE.Mesh(ribbonGeo2, ribbonMat2);
    ribbon2.rotation.x = Math.PI / 2.5;
    vaultGroup.add(ribbon2);

    // 4. Stardust Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 16;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 0.8 - targetX) * 0.05;
      targetY += (mouseY * 0.6 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(0, 0, 0);

      // Rotations
      vaultGroup.rotation.y = time * 0.25;
      vaultGroup.rotation.x = Math.sin(time * 0.3) * 0.15;

      ribbon1.rotation.z = time * 0.15;
      ribbon2.rotation.z = -time * 0.1;

      coreMesh.rotation.x = -time * 0.4;
      coreMesh.rotation.y = time * 0.5;

      particles.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      sealGeo.dispose();
      sealMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ribbonGeo1.dispose();
      ribbonMat1.dispose();
      ribbonGeo2.dispose();
      ribbonMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default AuthVaultScene3D;
