import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store';

interface ParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
}

export const Particles: React.FC<ParticlesProps> = ({ count = 1000, color = '#ff007f', size = 0.02, speed = 0.1 }) => {
  const mesh = useRef<THREE.Points>(null!);
  const { isDarkMode } = useStore();
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += speed * 0.01;
      mesh.current.rotation.x += speed * 0.005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation={true}
        transparent
        opacity={isDarkMode ? 0.8 : 0.6}
        blending={isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
};
