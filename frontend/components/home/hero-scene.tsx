"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group } from "three";

function RomanticBlob() {
  const groupRef = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0015;
    groupRef.current.rotation.x = pointer.current.y * 0.15;
    groupRef.current.rotation.z = -pointer.current.x * 0.08;
  });

  return (
    <group ref={groupRef} position={[1.7, -0.2, -0.5]}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.25, 12]} />
          <MeshDistortMaterial
            color="#e0637a"
            distort={0.4}
            speed={1.8}
            roughness={0.25}
            metalness={0.1}
            emissive="#ff8a7a"
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>
      <Sparkles count={70} scale={5.5} size={2.5} speed={0.3} color="#f3a978" />
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} color="#3a2a4a" />
      <pointLight position={[3, 2, 3]} intensity={2.2} color="#ff9fae" />
      <pointLight position={[-3, -2, 2]} intensity={1.1} color="#8a5bc2" />
      <pointLight position={[1, 0, 4]} intensity={0.8} color="#ffd9c0" />
      <RomanticBlob />
    </Canvas>
  );
}
