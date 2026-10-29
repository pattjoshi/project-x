"use client";

import { Suspense } from "react";

import { AvatarErrorBoundary } from "./avatar-error-boundary";
import { PlaceholderAvatar } from "./placeholder-avatar";
import { VrmAvatar } from "./vrm-avatar";

/** Renders the character's real VRM model when `vrmUrl` is set, falling
 * back to a simple procedural placeholder otherwise (no VRM assets are
 * seeded yet - see frontend/public/models/README.md). */
export function CharacterAvatar({
  vrmUrl,
  emotion,
}: {
  vrmUrl: string | null;
  emotion: string;
}) {
  if (!vrmUrl) {
    return <PlaceholderAvatar emotion={emotion} />;
  }

  return (
    <AvatarErrorBoundary fallback={<PlaceholderAvatar emotion={emotion} />}>
      <Suspense fallback={<PlaceholderAvatar emotion={emotion} />}>
        <VrmAvatar url={vrmUrl} emotion={emotion} />
      </Suspense>
    </AvatarErrorBoundary>
  );
}
