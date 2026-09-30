import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CartVault3D - 3D Holographic Luxury Vault Pedestal for Cart Page
 * Features floating golden polyhedron seal, orbiting luxury ring, and shimmering stardust.
 */
export const CartVault3D = ({ className = 'w-48 h-48 sm:w-60 sm:h-60' }) => {
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
      console.warn('WebGL is not supported for CartVault3D:', e);
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
    camera.position.set(0, 1.2, 5.5);
    camera.lookAt(0, 0, 0);

    // Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xc5a880, 3, 20);
    goldLight.position.set(3, 4, 4);
    scene.add(goldLight);

    const tealLight = new THREE.PointLight(0x2a4843, 2, 15);
    tealLight.position.set(-3, -3, 3);
    scene.add(tealLight);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Floating Gem / Bag Lock Seal
    const gemGeo = new THREE.OctahedronGeometry(1.1, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    group.add(gemMesh);

    // 2. Inner Golden Core
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x121212,
      metalness: 0.9,
      roughness: 0.15,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 3. Dual Orbiting Luxury Rings
    const ringGeo1 = new THREE.TorusGeometry(1.6, 0.025, 16, 80);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.9, 0.015, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x2a4843,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 4. Stardust Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.07,
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

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 240;
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

      // Camera tilt
      targetX += (mouseX * 0.6 - targetX) * 0.08;
      targetY += (mouseY * 0.6 - targetY) * 0.08;
      camera.position.x = targetX;
      camera.position.y = 1.2 - targetY;
      camera.lookAt(0, 0, 0);

      group.rotation.y = time * 0.3;
      gemMesh.rotation.x = time * 0.2;
      ring1.rotation.z = time * 0.15;
      ring2.rotation.z = -time * 0.2;

      particles.rotation.y = time * 0.02;

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

      gemGeo.dispose();
      gemMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default CartVault3D;
