"use client";

import { useEffect, useState } from "react";
import { useXRSessionModeSupported, type XRStore } from "@react-three/xr";

/** `useXRSessionModeSupported` reads `navigator.xr` via `useSyncExternalStore`
 * with no server snapshot, which breaks SSR. Gate it behind a mount check so
 * the hook never runs on the server - it only matters client-side anyway. */
export function VrEntryButton({ store }: { store: XRStore }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return <VrEntryButtonInner store={store} />;
}

function VrEntryButtonInner({ store }: { store: XRStore }) {
  const supported = useXRSessionModeSupported("immersive-vr");

  if (supported === false) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        store.enterVR().catch(() => {
          // No headset connected, permission denied, etc. - stay in the
          // regular 3D view, nothing else to do here.
        });
      }}
      disabled={supported === undefined}
      className="glass-panel pointer-events-auto absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm disabled:opacity-60"
    >
      {supported === undefined ? "Checking VR..." : "🥽 Enter VR"}
    </button>
  );
}
