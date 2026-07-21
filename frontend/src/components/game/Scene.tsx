"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Scene() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        {/* Dramatic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 5, 0]} intensity={2} angle={0.5} penumbra={1} color="#00ffff" />
        <spotLight position={[-5, 5, -5]} intensity={1.5} angle={0.5} penumbra={1} color="#ff00ff" />
        <pointLight position={[0, -5, 0]} intensity={1} color="#4444ff" />

        <Environment preset="city" />

        {/* The "TriviaSphere" */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[1.5, 64, 64]}>
            <MeshDistortMaterial 
              color="#1e1e1e"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0.2}
              metalness={0.8}
              emissive="#0a0a0a"
            />
          </Sphere>
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
