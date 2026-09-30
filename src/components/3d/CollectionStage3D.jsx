import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CollectionStage3D - 3D Haute Couture Runway Stage Header for Collection Page
 * Features responsive studio spotlight beam, moving catwalk light pool, reflective obsidian runway, and floating gold stardust.
 */
export const CollectionStage3D = ({ className = 'w-full h-56 sm:h-72' }) => {
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
      console.warn('WebGL is not supported for CollectionStage3D:', e);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 320;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 8.5);
    camera.lookAt(0, 0.4, 0);

    // Ambient Warm Light for Base Visibility
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.85);
    scene.add(ambientLight);

    // 1. Studio Ceiling Spotlight (Golden Champagne)
    const lampPos = new THREE.Vector3(0, 8.5, 2.5);
    const runwaySpotlight = new THREE.SpotLight(0xffe6c2, 12, 32, Math.PI / 4, 0.35, 1);
    runwaySpotlight.position.copy(lampPos);
    scene.add(runwaySpotlight);
    scene.add(runwaySpotlight.target); // Bắt buộc để Spotlight cập nhật mục tiêu theo chuột

    // Ceiling Track Light Fixture Mesh
    const fixtureGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.4, 16);
    const fixtureMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.9,
      roughness: 0.2,
    });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.position.copy(lampPos);
    scene.add(fixture);

    // 2. Volumetric Studio Light Cone Beam (Chùm sáng hình nón thể tích xuyên không khí)
    const beamHeight = 9.2;
    const beamGeo = new THREE.CylinderGeometry(0.2, 3.2, beamHeight, 32, 1, true);
    // Dịch tâm hình học xuống chân nón để xoay quanh đỉnh đèn
    beamGeo.translate(0, -beamHeight / 2, 0);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const volumetricBeam = new THREE.Mesh(beamGeo, beamMat);
    volumetricBeam.position.copy(lampPos);
    scene.add(volumetricBeam);

    // 3. Central Catwalk Runway (Bề mặt sàn sàn diễn đen bóng phản chiếu ánh sáng)
    const runwayGeo = new THREE.PlaneGeometry(6.5, 24, 16, 16);
    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.15,
    });
    const catwalk = new THREE.Mesh(runwayGeo, runwayMat);
    catwalk.rotation.x = -Math.PI / 2;
    catwalk.position.y = -0.5;
    scene.add(catwalk);

    // Viền vàng sắc sảo 2 bên Catwalk
    const borderGeo = new THREE.PlaneGeometry(0.08, 24);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0xc5a880 });
    const leftBorder = new THREE.Mesh(borderGeo, borderMat);
    leftBorder.rotation.x = -Math.PI / 2;
    leftBorder.position.set(-3.25, -0.49, 0);
    scene.add(leftBorder);

    const rightBorder = new THREE.Mesh(borderGeo, borderMat);
    rightBorder.rotation.x = -Math.PI / 2;
    rightBorder.position.set(3.25, -0.49, 0);
    scene.add(rightBorder);

    // Sàn lưới xung quanh (Ambient Wireframe Grid)
    const floorGridGeo = new THREE.PlaneGeometry(32, 24, 28, 24);
    const floorGridMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const floorGrid = new THREE.Mesh(floorGridGeo, floorGridMat);
    floorGrid.rotation.x = -Math.PI / 2;
    floorGrid.position.y = -0.51;
    scene.add(floorGrid);

    // 4. Floor Light Pool (Vệt sáng đĩa tròn rực rỡ trượt theo chuột trên sàn Catwalk)
    const poolCanvas = document.createElement('canvas');
    poolCanvas.width = 256;
    poolCanvas.height = 256;
    const ctx = poolCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 240, 210, 0.95)');
    grad.addColorStop(0.3, 'rgba(197, 168, 128, 0.6)');
    grad.addColorStop(0.65, 'rgba(197, 168, 128, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const poolTexture = new THREE.CanvasTexture(poolCanvas);
    const poolGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const poolMat = new THREE.MeshBasicMaterial({
      map: poolTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });
    const lightPool = new THREE.Mesh(poolGeo, poolMat);
    lightPool.rotation.x = -Math.PI / 2;
    lightPool.position.set(0, -0.48, 0);
    scene.add(lightPool);

    // 5. Floating Haute Couture Geometric Motifs (Bắt sáng khi tia sáng quét qua)
    const motifGroup = new THREE.Group();
    scene.add(motifGroup);

    const motifs = [];
    const motifGeo1 = new THREE.OctahedronGeometry(0.5, 0);
    const motifGeo2 = new THREE.TetrahedronGeometry(0.42, 0);
    const motifMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });

    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(i % 2 === 0 ? motifGeo1 : motifGeo2, motifMat);
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        Math.random() * 2.8 + 0.6,
        (Math.random() - 0.5) * 7
      );
      motifGroup.add(mesh);
      motifs.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2,
      });
    }

    // 6. Gold Stardust Field
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 22;
      particlePos[i * 3 + 1] = Math.random() * 5.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let targetX = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      mouseX = Math.max(-1.6, Math.min(1.6, x));
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Viewport Throttling
    let animationFrameId;
    let isVisible = true;
    let observer;

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible && !animationFrameId) {
            animate();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Mượt mà bám theo chuột (Lerp)
      targetX += (mouseX * 4.5 - targetX) * 0.08;

      // Cập nhật tọa độ mục tiêu của Spotlight
      runwaySpotlight.target.position.set(targetX, -0.5, 0.5);
      runwaySpotlight.target.updateMatrixWorld();

      // Cập nhật vệt sáng Catwalk trên sàn
      lightPool.position.x = targetX;
      lightPool.position.z = 0.5;
      lightPool.scale.setScalar(1 + Math.sin(time * 2) * 0.04);

      // Cập nhật luồng sáng hình nón thể tích (Beam nghiêng từ đèn trần tới vệt sáng sàn)
      const targetVec = new THREE.Vector3(targetX, -0.5, 0.5);
      volumetricBeam.position.copy(lampPos);
      volumetricBeam.lookAt(targetVec);
      volumetricBeam.rotateX(-Math.PI / 2); // Căn chỉnh hướng nón

      // Hiệu ứng các khối Haute Couture xoay và bồng bềnh
      motifs.forEach((m) => {
        m.mesh.rotation.x += m.rotSpeedX;
        m.mesh.rotation.y += m.rotSpeedY;
        m.mesh.position.y += Math.sin(time * 1.5 + m.floatOffset) * 0.003;

        // Khi tia sáng quét qua khối, tăng độ sáng phản chiếu
        const dist = Math.abs(m.mesh.position.x - targetX);
        if (dist < 2.5) {
          m.mesh.material.opacity = 0.95;
          m.mesh.scale.setScalar(1.08);
        } else {
          m.mesh.material.opacity = 0.6;
          m.mesh.scale.setScalar(1.0);
        }
      });

      // Hiệu ứng sàn catwalk lướt nhẹ
      catwalk.position.z = (time * 0.3) % 1;
      floorGrid.position.z = (time * 0.3) % 1;

      particles.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      runwayGeo.dispose();
      runwayMat.dispose();
      borderGeo.dispose();
      borderMat.dispose();
      floorGridGeo.dispose();
      floorGridMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      poolGeo.dispose();
      poolMat.dispose();
      poolTexture.dispose();
      fixtureGeo.dispose();
      fixtureMat.dispose();
      motifGeo1.dispose();
      motifGeo2.dispose();
      motifMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden pointer-events-auto cursor-crosshair ${className}`}
      aria-hidden="true"
    />
  );
};

export default CollectionStage3D;
