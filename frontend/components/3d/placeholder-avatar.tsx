"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

import { colorForEmotion } from "./emotion";

const BASE_POSITION: [number, number, number] = [0, 0.95, -0.8];

/** A simple procedural stand-in used until a character has a real VRM
 * model (`character.vrm_model_url`). Emotion is shown via a color tint here;
 * the emoji badge lives outside the Canvas (see DateScene) since drei's
 * <Html> uses its own nested React root internally, which is unreliable
 * under React 19's concurrent rendering. */
export function PlaceholderAvatar({ emotion }: { emotion: string }) {
  const groupRef = useRef<Group>(null);
  const color = colorForEmotion(emotion);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = BASE_POSITION[1] + Math.sin(clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <group ref={groupRef} position={BASE_POSITION}>
      {/* body */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.6, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial color="#f1d8bf" />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.08, 0.57, 0.21]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#2b2320" />
      </mesh>
      <mesh position={[0.08, 0.57, 0.21]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#2b2320" />
      </mesh>
    </group>
  );
}
