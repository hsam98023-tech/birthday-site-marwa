import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store';

export const CountdownRing: React.FC = () => {
  const torusRef = useRef<THREE.Mesh>(null!);
  const { isDarkMode } = useStore();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.2;
      torusRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
      // Slight scale pulse
      const scale = 1 + Math.sin(t * 2) * 0.02;
      torusRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer Glow Ring */}
      <mesh ref={torusRef} position={[0, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 64, 100]} />
        <meshBasicMaterial color={isDarkMode ? "#ff007f" : "#FF2D55"} toneMapped={false} />
      </mesh>
      
      {/* Main Distorted Ring */}
      <mesh position={[0, 0, -1]}>
        <torusGeometry args={[3, 0.4, 128, 100]} />
        <MeshDistortMaterial
          color={isDarkMode ? "#200020" : "#ffffff"}
          emissive={isDarkMode ? "#500050" : "#FF2D55"}
          emissiveIntensity={isDarkMode ? 1 : 0.1}
          roughness={isDarkMode ? 0.1 : 0.2}
          metalness={isDarkMode ? 1 : 0.8}
          distort={0.4}
          speed={2}
          transparent
          opacity={isDarkMode ? 0.6 : 0.4}
        />
      </mesh>
    </group>
  );
};
