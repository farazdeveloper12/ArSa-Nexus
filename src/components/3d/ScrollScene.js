import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Float, 
  Text,
  PerspectiveCamera
} from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import * as THREE from 'three';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Floating cubes background
const FloatingCubes = ({ count = 20, scrollProgress }) => {
  const group = useRef();
  const cubes = useRef([]);
  
  // Initialize cube data
  useEffect(() => {
    cubes.current = Array(count).fill().map(() => ({
      position: [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 15
      ],
      scale: Math.random() * 0.3 + 0.1,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      speed: Math.random() * 0.01 + 0.001,
      color: Math.random() > 0.5 ? '#6c63ff' : '#0070f3'
    }));
  }, [count]);
  
  // Animate cubes
  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((cube, i) => {
        // Rotate cubes
        cube.rotation.x += cubes.current[i].speed;
        cube.rotation.y += cubes.current[i].speed * 0.5;
        
        // Move cubes based on scroll
        if (scrollProgress !== undefined) {
          // Move cubes away as we scroll down
          cube.position.z = cubes.current[i].position[2] - scrollProgress * 20;
          
          // Optional: Change scale based on scroll progress
          cube.scale.setScalar(cubes.current[i].scale * (1 - scrollProgress * 0.3));
        }
      });
    }
  });
  
  return (
    <group ref={group}>
      {cubes.current.map((cube, i) => (
        <mesh 
          key={i} 
          position={cube.position} 
          scale={cube.scale}
          rotation={cube.rotation}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={cube.color} 
            roughness={0.5} 
            metalness={0.8} 
            opacity={0.7} 
            transparent 
          />
        </mesh>
      ))}
    </group>
  );
};

// Animated 3D text component
const AnimatedText = ({ text, position, rotation, color, scrollProgress }) => {
  const textRef = useRef();
  
  useEffect(() => {
    if (textRef.current) {
      gsap.from(textRef.current.position, {
        y: position[1] - 2,
        duration: 1.5,
        ease: 'power3.out',
      });
      
      gsap.from(textRef.current.material, {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [position]);
  
  // Update position based on scroll
  useFrame(() => {
    if (textRef.current && scrollProgress !== undefined) {
      // Move text up and fade out as we scroll
      textRef.current.position.y = position[1] + scrollProgress * 5;
      textRef.current.material.opacity = 1 - scrollProgress;
    }
  });
  
  return (
    <Text
      ref={textRef}
      position={position}
      rotation={rotation}
      color={color}
      fontSize={0.5}
      font="/fonts/Inter-Bold.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

// Floating sphere component
const FloatingSphere = ({ position, scale, color, scrollProgress }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth floating animation
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.1;
      
      // Update position based on scroll
      if (scrollProgress !== undefined) {
        // Move sphere based on scroll
        meshRef.current.position.x = position[0] + scrollProgress * 3 * (position[0] > 0 ? 1 : -1);
        meshRef.current.position.z = position[2] - scrollProgress * 5;
      }
    }
  });
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
      </mesh>
    </Float>
  );
};

// Scene setup - main component
const Scene = ({ scrollProgress = 0 }) => {
  const { camera } = useThree();
  const sceneRef = useRef();
  
  // Animate camera on load
  useEffect(() => {
    gsap.from(camera.position, {
      z: 15,
      duration: 2,
      ease: 'power3.out',
    });
  }, [camera]);
  
  // Update camera position based on scroll
  useFrame(() => {
    if (sceneRef.current && scrollProgress !== undefined) {
      // Move camera forward as we scroll
      camera.position.z = 5 - scrollProgress * 2;
      
      // Tilt camera slightly up as we scroll
      camera.rotation.x = scrollProgress * 0.2;
    }
  });
  
  return (
    <group ref={sceneRef}>
      <AnimatedText 
        text="ARSA NEXUS"
        position={[0, 1, 0]}
        rotation={[0, 0, 0]}
        color="#ffffff"
        scrollProgress={scrollProgress}
      />
      
      <AnimatedText 
        text="INNOVATION & EDUCATION"
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        color="#6c63ff"
        scrollProgress={scrollProgress}
      />
      
      <FloatingSphere position={[-2, -1, -1]} scale={[0.5, 0.5, 0.5]} color="#0070f3" scrollProgress={scrollProgress} />
      <FloatingSphere position={[2, -1.5, -2]} scale={[0.3, 0.3, 0.3]} color="#6c63ff" scrollProgress={scrollProgress} />
      <FloatingSphere position={[0, 2, -3]} scale={[0.7, 0.7, 0.7]} color="#10b981" scrollProgress={scrollProgress} />
      
      <FloatingCubes count={30} scrollProgress={scrollProgress} />
    </group>
  );
};

// Main exported component
const ScrollScene = ({ scrollY = 0, scrollHeight = 1000 }) => {
  // Calculate scroll progress (0 to 1)
  const scrollProgress = Math.min(1, Math.max(0, scrollY / scrollHeight));
  
  return (
    <Canvas
      className="absolute top-0 left-0 w-full h-full z-0"
      camera={{ position: [0, 0, 5], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Scene scrollProgress={scrollProgress} />
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={scrollProgress < 0.2} // Disable rotation after scrolling a bit
        autoRotate={scrollProgress < 0.1} // Only auto-rotate at the top
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

export default ScrollScene;