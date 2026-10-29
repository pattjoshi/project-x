"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { CafeEnvironment } from "./cafe-environment";
import { CharacterAvatar } from "./character-avatar";
import { emojiForEmotion } from "./emotion";

export function CafeScene({
  vrmUrl,
  emotion,
}: {
  vrmUrl: string | null;
  emotion: string;
}) {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-muted">
      <Canvas shadows camera={{ position: [0, 1.4, 2.2], fov: 35 }}>
        <CafeEnvironment />
        <CharacterAvatar vrmUrl={vrmUrl} emotion={emotion} />
        <OrbitControls
          target={[0, 0.95, -0.8]}
          minDistance={1.2}
          maxDistance={3.5}
          maxPolarAngle={Math.PI / 2}
          enablePan={false}
        />
      </Canvas>

      {/* Plain DOM overlay, not a 3D-anchored drei <Html> - see
          placeholder-avatar.tsx for why. */}
      <div className="pointer-events-none absolute top-2 right-2 rounded-full bg-background/80 px-2 py-1 text-xl">
        {emojiForEmotion(emotion)}
      </div>
    </div>
  );
}
