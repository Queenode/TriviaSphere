"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Cylinder, Ring } from "@react-three/drei";
import { useRef } from "react";
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
      <ambientLight intensity={0.1} />
      <spotLight ref={lightRef1} position={[0, 8, 5]} angle={0.4} penumbra={1} intensity={100} color="#3b82f6" castShadow />
      <spotLight ref={lightRef2} position={[5, 8, -5]} angle={0.4} penumbra={1} intensity={100} color="#8b5cf6" castShadow />
      <pointLight position={[0, 2, 0]} intensity={10} color="#ffffff" distance={6} />
    </>
  );
}

function CameraRig({ isRevealing }: { isRevealing: boolean }) {
  useFrame((state) => {
    // Zoom in dramatically when an answer is locked in
    const targetZ = isRevealing ? 4 : 8;
    const targetY = isRevealing ? 1.5 : 3;
    state.camera.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.03);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene({ isRevealing = false }: { isRevealing?: boolean }) {
  return (
    <div className="absolute inset-0 -z-10 bg-gray-950">
      <Canvas shadows camera={{ position: [0, 3, 8], fov: 45 }}>
        <fog attach="fog" args={['#050510', 5, 20]} />
        <StudioLights />
        <Environment preset="city" />

        {/* Center Glowing Table */}
        <Cylinder args={[2, 1.5, 0.5, 32]} position={[0, -0.5, 0]} receiveShadow castShadow>
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Neon Rings around table */}
        <Ring args={[2.1, 2.15, 64]} position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#3b82f6" toneMapped={false} />
        </Ring>
        <Ring args={[1.9, 1.95, 64]} position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ea580c" toneMapped={false} />
        </Ring>

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#020205" roughness={0.9} metalness={0.1} />
        </mesh>

        <CameraRig isRevealing={isRevealing} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          minPolarAngle={0}
          autoRotate 
          autoRotateSpeed={isRevealing ? 0.2 : 0.8} // Slow down rotation during suspense
        />
      </Canvas>
    </div>
  );
}
