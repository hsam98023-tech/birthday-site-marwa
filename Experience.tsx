import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars, Float } from '@react-three/drei';
import { Particles } from './Particles'; // تعديل: حذفنا components/
import { CountdownRing } from './CountdownRing'; // تعديل: حذفنا components/
import { useStore } from './store'; // تعديل: الملف فالمجلد الرئيسي يعني ./store مباشرة
import { ScrollControls, Scroll } from '@react-three/drei';
import { Interface } from './Interface'; // تعديل: حذفنا components/

export const Experience: React.FC = () => {
  const { hasEntered, isDarkMode } = useStore();

  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* Dynamic Fog */}
        <fog attach="fog" args={[isDarkMode ? '#050505' : '#FBFBFD', 5, 20]} />
        
        <ambientLight intensity={isDarkMode ? 0.5 : 0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={isDarkMode ? "#ff007f" : "#FF2D55"} />

        {/* Stars only visible in Dark Mode */}
        {isDarkMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
        
        {hasEntered ? (
           <ScrollControls pages={4} damping={0.3}>
             {/* 3D Content that stays or moves with scroll */}
             <group position={[0, 0, 0]}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                   <CountdownRing />
                </Float>
                <Particles count={2000} color={isDarkMode ? "#ff00ff" : "#FF2D55"} size={isDarkMode ? 0.03 : 0.02} speed={0.5} />
             </group>
             
             {/* HTML Overlay managed by ScrollControls for perfect sync */}
             <Scroll html style={{ width: '100%', height: '100%' }}>
                <Interface />
             </Scroll>
           </ScrollControls>
        ) : (
          /* Login Scene Background */
          <group>
             <Particles count={800} color={isDarkMode ? "#ffffff" : "#1D1D1F"} size={0.02} speed={0.2} />
             <Particles count={200} color={isDarkMode ? "#ff007f" : "#FF2D55"} size={0.05} speed={0.4} />
             <Float speed={1.5}>
               <mesh position={[4, -2, -5]} rotation={[0, 0, Math.PI / 4]}>
                 <torusGeometry args={[1, 0.2, 16, 100]} />
                 <meshStandardMaterial color={isDarkMode ? "#330033" : "#F0F0F0"} roughness={0.2} metalness={0.8} />
               </mesh>
             </Float>
          </group>
        )}
        
        <Environment preset={isDarkMode ? "city" : "studio"} />
      </Canvas>
    </div>
  );
};
