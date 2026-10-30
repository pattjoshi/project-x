"use client";

import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";

import { AvatarLighting } from "./avatar-lighting";
import { CharacterAvatar } from "./character-avatar";

/** A compact, bust-framed render of a character - the same CharacterAvatar
 * used on the chat page, just closer-cropped and backed by a plain gradient
 * instead of a date-location environment. Used anywhere a character needs a
 * living presence without the full scene (character cards, profile hero,
 * chapter headers). */
export function CharacterBust({
  vrmUrl,
  emotion = "neutral",
  className,
}: {
  vrmUrl: string | null;
  emotion?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.25, 1.2], fov: 30 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.15, -0.8)}
      >
        <AvatarLighting />
        <CharacterAvatar vrmUrl={vrmUrl} emotion={emotion} />
      </Canvas>
    </div>
  );
}
