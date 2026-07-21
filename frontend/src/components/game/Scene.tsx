"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Ring, Box, Sphere } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from 'three';

function StudioLights() {
  const lightRef1 = useRef<THREE.SpotLight>(null);
  const lightRef2 = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef1.current) {
      lightRef1.current.position.x = Math.sin(t * 0.5) * 8;
      lightRef1.current.position.z = Math.cos(t * 0.5) * 8;
    }
    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(t * 0.3) * 8;
      lightRef2.current.position.z = Math.sin(t * 0.3) * 8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={40} color="#1d4ed8" distance={20} />
      <pointLight position={[0, 0, 0]} intensity={20} color="#00ffff" distance={6} />
      <spotLight ref={lightRef1} position={[0, 8, 5]} angle={0.4} penumbra={1} intensity={150} color="#3b82f6" />
      <spotLight ref={lightRef2} position={[5, 8, -5]} angle={0.4} penumbra={1} intensity={150} color="#8b5cf6" />
      {/* Backlight for silhouettes */}
      <pointLight position={[0, 3, -3]} intensity={15} color="#7c3aed" distance={8} />
    </>
  );
}

function GameShowSet() {
  return (
    <group position={[0, -1, 0]}>
      {/* Intricate Floor Pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#020813" roughness={0.5} metalness={0.5} />
      </mesh>
      
      {/* Concentric Neon Rings on Floor */}
      {[1.5, 3, 5, 7, 9].map((radius, i) => (
        <Ring key={i} args={[radius - 0.05, radius, 64]} position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={i % 2 === 0 ? "#3b82f6" : "#00ffff"} transparent opacity={0.6} />
        </Ring>
      ))}

      {/* Intersecting Floor Lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Box key={`line-${i}`} args={[20, 0.02, 0.1]} position={[0, -0.48, 0]} rotation={[0, (Math.PI / 6) * i, 0]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </Box>
      ))}

      {/* Center V-Console */}
      <group position={[0, 0, 0]}>
        <Cylinder args={[1.2, 1.2, 0.2, 32]} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.1} />
        </Cylinder>
        <Ring args={[1.1, 1.25, 32]} position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#00ffff" />
        </Ring>

        {/* Left Arm of V */}
        <Box args={[0.3, 1.8, 0.8]} position={[-0.8, 0.4, 0]} rotation={[0, 0, -0.5]}>
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[0.05, 1.8, 0.81]} position={[-0.65, 0.4, 0]} rotation={[0, 0, -0.5]}>
          <meshBasicMaterial color="#00ffff" />
        </Box>

        {/* Right Arm of V */}
        <Box args={[0.3, 1.8, 0.8]} position={[0.8, 0.4, 0]} rotation={[0, 0, 0.5]}>
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[0.05, 1.8, 0.81]} position={[0.65, 0.4, 0]} rotation={[0, 0, 0.5]}>
          <meshBasicMaterial color="#3b82f6" />
        </Box>
      </group>

      {/* Host Chair & Seated Person (Left) */}
      <group position={[-2.8, -0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Chair */}
        <Cylinder args={[0.4, 0.4, 0.8, 16]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Box args={[0.9, 0.1, 0.9]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
        </Box>
        <Box args={[0.9, 1.2, 0.1]} position={[0, 0.8, -0.4]} rotation={[0.1, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
        </Box>

        {/* Seated Host Mannequin */}
        <group position={[0, 0.25, 0]}>
          {/* Head */}
          <Sphere args={[0.18, 16, 16]} position={[0, 1.35, 0]}>
            <meshStandardMaterial color="#2a1f14" roughness={0.6} />
          </Sphere>
          {/* Neck */}
          <Cylinder args={[0.06, 0.06, 0.12, 8]} position={[0, 1.12, 0]}>
            <meshStandardMaterial color="#2a1f14" roughness={0.6} />
          </Cylinder>
          {/* Torso */}
          <Box args={[0.5, 0.6, 0.25]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#111827" roughness={0.4} />
          </Box>
          {/* Left Upper Arm */}
          <Cylinder args={[0.07, 0.06, 0.35, 8]} position={[-0.33, 0.85, 0]} rotation={[0, 0, 0.3]}>
            <meshStandardMaterial color="#111827" roughness={0.4} />
          </Cylinder>
          {/* Left Forearm (resting on lap) */}
          <Cylinder args={[0.06, 0.05, 0.3, 8]} position={[-0.3, 0.55, 0.15]} rotation={[1.2, 0, 0]}>
            <meshStandardMaterial color="#2a1f14" roughness={0.6} />
          </Cylinder>
          {/* Right Upper Arm */}
          <Cylinder args={[0.07, 0.06, 0.35, 8]} position={[0.33, 0.85, 0]} rotation={[0, 0, -0.3]}>
            <meshStandardMaterial color="#111827" roughness={0.4} />
          </Cylinder>
          {/* Right Forearm (resting on lap) */}
          <Cylinder args={[0.06, 0.05, 0.3, 8]} position={[0.3, 0.55, 0.15]} rotation={[1.2, 0, 0]}>
            <meshStandardMaterial color="#2a1f14" roughness={0.6} />
          </Cylinder>
          {/* Left Thigh (seated, horizontal) */}
          <Cylinder args={[0.09, 0.08, 0.45, 8]} position={[-0.15, 0.35, 0.2]} rotation={[1.5, 0, 0]}>
            <meshStandardMaterial color="#1e1e2e" roughness={0.5} />
          </Cylinder>
          {/* Right Thigh */}
          <Cylinder args={[0.09, 0.08, 0.45, 8]} position={[0.15, 0.35, 0.2]} rotation={[1.5, 0, 0]}>
            <meshStandardMaterial color="#1e1e2e" roughness={0.5} />
          </Cylinder>
          {/* Left Lower Leg (hanging down) */}
          <Cylinder args={[0.07, 0.06, 0.4, 8]} position={[-0.15, 0.0, 0.42]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#1e1e2e" roughness={0.5} />
          </Cylinder>
          {/* Right Lower Leg */}
          <Cylinder args={[0.07, 0.06, 0.4, 8]} position={[0.15, 0.0, 0.42]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#1e1e2e" roughness={0.5} />
          </Cylinder>
          {/* Left Shoe */}
          <Box args={[0.1, 0.06, 0.18]} position={[-0.15, -0.2, 0.47]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
          </Box>
          {/* Right Shoe */}
          <Box args={[0.1, 0.06, 0.18]} position={[0.15, -0.2, 0.47]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
          </Box>
        </group>
      </group>

      {/* Player Chair & Seated Person (Right) */}
      <group position={[2.8, -0.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Chair */}
        <Cylinder args={[0.4, 0.4, 0.8, 16]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Box args={[0.9, 0.1, 0.9]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
        </Box>
        <Box args={[0.9, 1.2, 0.1]} position={[0, 0.8, -0.4]} rotation={[0.1, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
        </Box>

        {/* Seated Player Mannequin */}
        <group position={[0, 0.25, 0]}>
          {/* Head */}
          <Sphere args={[0.18, 16, 16]} position={[0, 1.35, 0]}>
            <meshStandardMaterial color="#3b2a1a" roughness={0.6} />
          </Sphere>
          {/* Neck */}
          <Cylinder args={[0.06, 0.06, 0.12, 8]} position={[0, 1.12, 0]}>
            <meshStandardMaterial color="#3b2a1a" roughness={0.6} />
          </Cylinder>
          {/* Torso */}
          <Box args={[0.45, 0.55, 0.22]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#1e3a5f" roughness={0.4} />
          </Box>
          {/* Left Upper Arm */}
          <Cylinder args={[0.065, 0.055, 0.33, 8]} position={[-0.3, 0.85, 0]} rotation={[0, 0, 0.3]}>
            <meshStandardMaterial color="#1e3a5f" roughness={0.4} />
          </Cylinder>
          {/* Left Forearm */}
          <Cylinder args={[0.055, 0.045, 0.28, 8]} position={[-0.28, 0.55, 0.15]} rotation={[1.2, 0, 0]}>
            <meshStandardMaterial color="#3b2a1a" roughness={0.6} />
          </Cylinder>
          {/* Right Upper Arm */}
          <Cylinder args={[0.065, 0.055, 0.33, 8]} position={[0.3, 0.85, 0]} rotation={[0, 0, -0.3]}>
            <meshStandardMaterial color="#1e3a5f" roughness={0.4} />
          </Cylinder>
          {/* Right Forearm */}
          <Cylinder args={[0.055, 0.045, 0.28, 8]} position={[0.28, 0.55, 0.15]} rotation={[1.2, 0, 0]}>
            <meshStandardMaterial color="#3b2a1a" roughness={0.6} />
          </Cylinder>
          {/* Left Thigh */}
          <Cylinder args={[0.085, 0.075, 0.42, 8]} position={[-0.13, 0.35, 0.2]} rotation={[1.5, 0, 0]}>
            <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
          </Cylinder>
          {/* Right Thigh */}
          <Cylinder args={[0.085, 0.075, 0.42, 8]} position={[0.13, 0.35, 0.2]} rotation={[1.5, 0, 0]}>
            <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
          </Cylinder>
          {/* Left Lower Leg */}
          <Cylinder args={[0.065, 0.055, 0.38, 8]} position={[-0.13, 0.0, 0.42]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
          </Cylinder>
          {/* Right Lower Leg */}
          <Cylinder args={[0.065, 0.055, 0.38, 8]} position={[0.13, 0.0, 0.42]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
          </Cylinder>
          {/* Left Shoe */}
          <Box args={[0.09, 0.06, 0.17]} position={[-0.13, -0.2, 0.47]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
          </Box>
          {/* Right Shoe */}
          <Box args={[0.09, 0.06, 0.17]} position={[0.13, -0.2, 0.47]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
          </Box>
        </group>
      </group>

      {/* Background Giant Rings */}
      <Ring args={[11.8, 12, 64]} position={[0, 4, -10]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#1d4ed8" transparent opacity={0.4} />
      </Ring>
      <Ring args={[14.8, 15, 64]} position={[0, 5, -14]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
      </Ring>
    </group>
  );
}

export default function Scene({ isRevealing = false }: { isRevealing?: boolean }) {
  return (
    <div className="absolute inset-0 z-0" style={{ background: '#02050a' }}>
      <Canvas
        camera={{ position: [0, 3.5, 9], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#02050a');
        }}
      >
        <fog attach="fog" args={['#02050a', 6, 25]} />
        
        <Suspense fallback={null}>
          <StudioLights />
          <GameShowSet />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          minPolarAngle={Math.PI / 6}
          autoRotate 
          autoRotateSpeed={isRevealing ? 0.1 : 0.6} 
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}
