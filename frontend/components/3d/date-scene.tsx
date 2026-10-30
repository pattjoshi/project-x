"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";

import { CharacterAvatar } from "./character-avatar";
import { emojiForEmotion } from "./emotion";
import { CafeEnvironment } from "./environments/cafe-environment";
import { ParkEnvironment } from "./environments/park-environment";
import { RooftopEnvironment } from "./environments/rooftop-environment";
import { VrEntryButton } from "./vr-entry-button";
import type { DateLocation } from "@/types/location";

const LOCATION_CONFIG: Record<
  DateLocation,
  {
    Environment: () => React.JSX.Element;
    background: string;
    cameraPosition: [number, number, number];
    fov: number;
  }
> = {
  cafe: {
    Environment: CafeEnvironment,
    background:
      "linear-gradient(180deg, oklch(0.86 0.04 55) 0%, oklch(0.9 0.025 40) 60%, oklch(0.82 0.03 35) 100%)",
    cameraPosition: [0, 1.4, 2.2],
    fov: 35,
  },
  park: {
    Environment: ParkEnvironment,
    background:
      "linear-gradient(180deg, oklch(0.88 0.05 150) 0%, oklch(0.9 0.04 120) 55%, oklch(0.84 0.05 100) 100%)",
    cameraPosition: [0, 1.5, 2.6],
    fov: 40,
  },
  rooftop: {
    Environment: RooftopEnvironment,
    background:
      "linear-gradient(180deg, oklch(0.5 0.07 300) 0%, oklch(0.6 0.09 20) 55%, oklch(0.68 0.08 40) 100%)",
    cameraPosition: [0, 1.6, 2.4],
    fov: 38,
  },
};

export function DateScene({
  vrmUrl,
  emotion,
  location = "cafe",
}: {
  vrmUrl: string | null;
  emotion: string;
  location?: DateLocation;
}) {
  const { Environment, background, cameraPosition, fov } = LOCATION_CONFIG[location];
  const [store] = useState(() => createXRStore());

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl border shadow-sm">
      <div
        className="absolute inset-0 -z-10"
        style={{ background }}
        aria-hidden
      />
      <Canvas key={location} shadows camera={{ position: cameraPosition, fov }}>
        <XR store={store}>
          <Environment />
          <CharacterAvatar vrmUrl={vrmUrl} emotion={emotion} />
          <OrbitControls
            target={[0, 0.95, -0.8]}
            minDistance={1.2}
            maxDistance={3.5}
            maxPolarAngle={Math.PI / 2}
            enablePan={false}
          />
        </XR>
      </Canvas>

      {/* Plain DOM overlays, not 3D-anchored drei <Html> - see
          placeholder-avatar.tsx for why. */}
      <div className="glass-panel pointer-events-none absolute top-3 right-3 rounded-full px-2.5 py-1 text-xl shadow-sm">
        {emojiForEmotion(emotion)}
      </div>
      <VrEntryButton store={store} />
    </div>
  );
}
