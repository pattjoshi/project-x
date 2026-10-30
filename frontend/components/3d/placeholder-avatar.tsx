"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { MathUtils } from "three";

import { colorForEmotion } from "./emotion";

const BASE_POSITION: [number, number, number] = [0, 0.95, -0.8];
const SKIN = "#f1d8bf";
const HAIR = "#4a3426";

/** A stylized, non-photoreal character bust used until a real VRM model is
 * loaded (`character.vrm_model_url`) - see `public/models/README.md`. Built
 * entirely from primitives (no textures/skinning), so the realism budget
 * here goes into lighting (see AvatarLighting) and motion: idle breathing,
 * periodic blinking, and the head turning gently toward the cursor. Emotion
 * tints the outfit color; the emoji badge lives outside the Canvas (see
 * DateScene) since drei's <Html> uses its own nested React root internally,
 * which is unreliable under React 19's concurrent rendering. */
export function PlaceholderAvatar({ emotion }: { emotion: string }) {
  const groupRef = useRef<Group>(null);
  const torsoRef = useRef<Mesh>(null);
  const headRef = useRef<Group>(null);
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);
  const outfit = colorForEmotion(emotion);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y = BASE_POSITION[1] + Math.sin(t * 1.1) * 0.015;
    }
    if (torsoRef.current) {
      const breath = Math.sin(t * 0.8) * 0.018;
      torsoRef.current.scale.set(1 - breath * 0.5, 1 + breath, 1 - breath * 0.5);
    }
    if (headRef.current) {
      const targetY = pointer.x * 0.35;
      const targetX = -pointer.y * 0.18;
      headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, targetY, 0.06);
      headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, targetX, 0.06);
    }

    const blinkCycle = t % 4;
    const blink = blinkCycle > 3.85 ? Math.abs(Math.sin(((blinkCycle - 3.85) / 0.15) * Math.PI)) : 0;
    const eyeScale = 1 - blink * 0.92;
    leftEyeRef.current?.scale.set(1, eyeScale, 1);
    rightEyeRef.current?.scale.set(1, eyeScale, 1);
  });

  return (
    <group ref={groupRef} position={BASE_POSITION}>
      {/* torso */}
      <mesh ref={torsoRef} position={[0, -0.12, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.5, 8, 16]} />
        <meshStandardMaterial color={outfit} roughness={0.75} />
      </mesh>

      {/* neck */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.095, 0.14, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>

      <group ref={headRef} position={[0, 0.5, 0]}>
        {/* head */}
        <mesh castShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.5} />
        </mesh>

        {/* ears */}
        <mesh position={[-0.21, -0.02, 0]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.5} />
        </mesh>
        <mesh position={[0.21, -0.02, 0]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.5} />
        </mesh>

        {/* hair cap + fringe */}
        <mesh position={[0, 0.05, -0.02]} scale={[1.06, 0.95, 1.05]} castShadow>
          <sphereGeometry args={[0.225, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color={HAIR} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0.17]} rotation={[0.3, 0, 0]} castShadow>
          <sphereGeometry args={[0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color={HAIR} roughness={0.4} />
        </mesh>

        {/* eyebrows */}
        <mesh position={[-0.08, 0.11, 0.195]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.07, 0.014, 0.01]} />
          <meshStandardMaterial color={HAIR} />
        </mesh>
        <mesh position={[0.08, 0.11, 0.195]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.07, 0.014, 0.01]} />
          <meshStandardMaterial color={HAIR} />
        </mesh>

        {/* eyes */}
        <mesh ref={leftEyeRef} position={[-0.08, 0.03, 0.21]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshStandardMaterial color="#2b2320" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.08, 0.03, 0.21]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshStandardMaterial color="#2b2320" />
        </mesh>

        {/* blush */}
        <mesh position={[-0.14, -0.06, 0.16]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#e8909a" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0.14, -0.06, 0.16]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#e8909a" transparent opacity={0.35} />
        </mesh>

        {/* mouth */}
        <mesh position={[0, -0.1, 0.2]} rotation={[Math.PI, 0, 0]}>
          <torusGeometry args={[0.035, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#9a5050" />
        </mesh>
      </group>
    </group>
  );
}
