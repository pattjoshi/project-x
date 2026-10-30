# frontend

Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui-style components +
Auth.js (NextAuth v5, credentials against the backend API).

```bash
cd frontend
npm install
npm run dev
```

Requires the backend running (see `../backend/README.md`) and a `.env.local`
with `AUTH_SECRET` and `NEXT_PUBLIC_API_URL` (see root `.env.example`).

## Routes

- `/` — landing page
- `/signup`, `/login` — auth forms (signup includes the 18+ age-gate checkbox)
- `/characters` — character list (protected by `middleware.ts`)
- `/characters/[id]` — character profile
- `/characters/[id]/chat` — 3D date scene + free-form AI chat (Phase 3/4/7/10c)
- `/characters/[id]/chapters`, `/characters/[id]/chapters/[chapterId]` — branching story chapters (Phase 5)
- `/characters/[id]/gifts` — send a gift, see the relationship react (Phase 10a)
- `/daily` — login streak + daily quests (Phase 6)

## 3D (`components/3d/`)

The chat page renders a small 3D date scene (`DateScene`) via React Three
Fiber. A `LocationSwitcher` lets the user pick between three locations —
cafe, park, rooftop (`components/3d/environments/`) — each its own
environment component with matching lighting/background; switching is
client-side only (no backend state) and the character avatar always anchors
to the same world position so it composes into any of them unmodified.
`CharacterAvatar` loads a real VRM model when `character.vrm_model_url` is
set (via `@pixiv/three-vrm`, mapping our emotion strings to VRM expression
presets), otherwise falls back to `PlaceholderAvatar` - a simple procedural
stand-in (color-tinted capsule + sphere) plus an emoji badge overlaid outside
the Canvas. No VRM assets are seeded yet; see
`public/models/README.md` for how to add one.

### VR (`@react-three/xr`, Phase 10e)

The scene is wrapped in `<XR store={...}>` (`createXRStore()`, one per
`DateScene` instance) so it can run as a WebXR immersive session. A
`VrEntryButton` overlay checks `useXRSessionModeSupported("immersive-vr")`
and only renders an "Enter VR" button when the browser/device actually
reports support (`store.enterVR()` on click) - on everything else (no
headset, no WebXR, desktop browsers) it renders nothing, so the regular 3D
view is unaffected. That hook reads `navigator.xr` via
`useSyncExternalStore` with no server snapshot, which breaks SSR - it's
gated behind a mount check (see the comment in `vr-entry-button.tsx`) so it
only ever runs client-side. No real headset was available to test this
against in development; verified by code review plus patching the browser's
own `navigator.xr.isSessionSupported` to force each path (supported /
unsupported) in a real headless-Chromium run.

Note: the emotion badge is a plain DOM overlay, not drei's `<Html>` -
`<Html>` renders through its own internal `ReactDOM.createRoot()`, which is
unreliable under React 19's concurrent rendering (content silently failed to
mount in testing). Keep that in mind before reaching for `<Html>` elsewhere
in the 3D tree.
