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
    <div className="relative h-80 w-full overflow-hidden rounded-xl border shadow-sm">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.86 0.04 55) 0%, oklch(0.9 0.025 40) 60%, oklch(0.82 0.03 35) 100%)",
        }}
        aria-hidden
      />
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
      <div className="glass-panel pointer-events-none absolute top-3 right-3 rounded-full px-2.5 py-1 text-xl shadow-sm">
        {emojiForEmotion(emotion)}
      </div>
    </div>
  );
}
