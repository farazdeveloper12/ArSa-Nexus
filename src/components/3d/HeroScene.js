import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const HeroScene = () => {
  const mountRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    // Dynamically import THREE.js only on client side
    import('three').then((THREE) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 5000;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#4F46E5',
        transparent: true,
        opacity: 0.8,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Create floating geometries
      const geometries = [];

      // Torus
      const torusGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
      const torusMaterial = new THREE.MeshBasicMaterial({
        color: '#8B5CF6',
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.set(-2, 1, 0);
      scene.add(torus);
      geometries.push(torus);

      // Icosahedron
      const icosahedronGeometry = new THREE.IcosahedronGeometry(0.5, 0);
      const icosahedronMaterial = new THREE.MeshBasicMaterial({
        color: '#06B6D4',
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
      icosahedron.position.set(2, -1, 0);
      scene.add(icosahedron);
      geometries.push(icosahedron);

      // Octahedron
      const octahedronGeometry = new THREE.OctahedronGeometry(0.4, 0);
      const octahedronMaterial = new THREE.MeshBasicMaterial({
        color: '#F59E0B',
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
      octahedron.position.set(0, 2, -1);
      scene.add(octahedron);
      geometries.push(octahedron);

      camera.position.z = 3;

      // Mouse position
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate particles
        particlesMesh.rotation.x += 0.001;
        particlesMesh.rotation.y += 0.001;

        // Animate geometries
        geometries.forEach((geometry, index) => {
          geometry.rotation.x += 0.01 + index * 0.002;
          geometry.rotation.y += 0.01 + index * 0.002;

          // Float animation
          geometry.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
        });

        // Camera follows mouse with damping
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };

      animate();

      // Cleanup
      return () => {
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);

        // Dispose of geometries and materials
        geometries.forEach(geometry => {
          geometry.geometry.dispose();
          geometry.material.dispose();
        });
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();
      };
    }).catch(error => {
      console.error('Failed to load THREE.js:', error);
    });
  }, [isClient]);

  if (!isClient) {
    return <div ref={mountRef} className="absolute inset-0 z-0" />;
  }

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default HeroScene;