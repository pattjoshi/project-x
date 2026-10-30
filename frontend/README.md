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
- `/characters/[id]/chat` — 3D date scene + free-form AI chat, with a "Play" button on each reply to hear it read aloud via OpenAI TTS (Phase 3/4/7/10c/10d)
- `/characters/[id]/chapters`, `/characters/[id]/chapters/[chapterId]` — branching story chapters (Phase 5)
- `/characters/[id]/gifts` — send a gift, see the relationship react (Phase 10a)
- `/daily` — login streak + daily quests (Phase 6)
- `/admin` — analytics dashboard (drop-off, choice stats, estimated AI cost); only visible/reachable for accounts with `is_admin = true` (Phase 10b)

## 3D (`components/3d/`)

The chat page renders a small 3D date scene (`DateScene`) via React Three
Fiber. A `LocationSwitcher` lets the user pick between three locations —
cafe, park, rooftop (`components/3d/environments/`) — each its own
environment component with matching lighting/background; switching is
client-side only (no backend state) and the character avatar always anchors
to the same world position so it composes into any of them unmodified.
`CharacterAvatar` loads a real VRM model when `character.vrm_model_url` is
set (via `@pixiv/three-vrm`, mapping our emotion strings to VRM expression
presets), otherwise falls back to `PlaceholderAvatar` - a stylized procedural
bust (head/hair/torso built from primitives, no textures or skinning) with
idle breathing, periodic blinking, and the head turning gently toward the
cursor each frame. No VRM assets are seeded yet; see
`public/models/README.md` for how to add one.

`AvatarLighting` (`components/3d/avatar-lighting.tsx`) is a shared
three-point studio lighting rig - key/fill/rim lights plus a procedural
`<Environment>` built from drei `Lightformer`s (no HDRI fetch, so it renders
fully offline) and a soft `ContactShadows` under the character. `DateScene`
(the chat page) uses it alongside each location's own environment lighting;
`CharacterBust` (`components/3d/character-bust.tsx`) uses it alone for a
plain bust-framed render with ACES tone mapping. `CharacterBust` is what
gives characters a living presence outside the chat page too - character
cards, the profile hero, and the chapters header all render a small live
instance of it instead of a flat initial-letter badge.

Note: `@react-three/postprocessing` (for real bloom) is **not** installed -
every published version pins `postprocessing@^6.36.0`, which requires
`three < 0.168`, and this project is on `three@0.186`. Forcing it past that
with `--legacy-peer-deps` would silently risk a broken runtime, so the
"soft glow" look here comes from tone mapping + emissive materials + the
lighting rig instead. Revisit if a `postprocessing` release adds support for
current `three`.

## Cinematic design system (`components/cinematic/`)

A site-wide visual language inspired by WebGL/scrollytelling portfolio sites
(full-bleed 3D hero, oversized display type, grain, smooth scroll, a custom
cursor) applied across every page - landing included, plus the functional
app shell (auth, characters, chat, chapters, gifts, daily quests, admin).
The functional screens keep native forms/tables/chat underneath the new look
rather than wrapping them in anything WebGL - usability came first on those.

- `SmoothScroll` (`lenis/react`, mounted once in `app/layout.tsx`) - inertial
  scrolling site-wide.
- `GrainOverlay` - a fixed, low-opacity SVG noise texture over everything.
- `CustomCursor` (`motion/react`) - a spring-follows-pointer dot that grows
  over `a`, `button`, or `[data-cursor-hover]` elements; only mounts on
  `(pointer: fine)` devices (never on touch), and hides the native cursor via
  the `html.has-custom-cursor` rule in `globals.css`.
- `Reveal` - a `motion.div` fade/slide-up on scroll-into-view (`whileInView`,
  `once: true`), used for nearly every section/card entrance.
- `Magnetic` - wraps a button/link and nudges it toward the cursor on hover;
  reserved for primary CTAs, not nav links (would feel gimmicky there).
- `PageHeading` (`components/layout/`) - the shared eyebrow + `text-display-2`
  pattern used at the top of every inner page.
- The `Fraunces` display serif (`next/font/google`, `--font-display`) pairs
  with the existing Geist sans; `.text-display-1/2/3` and `.text-eyebrow` in
  `globals.css` are the fluid (`clamp()`) type scale built on it.
- `components/home/hero-scene.tsx` is the landing page's WebGL hero: a
  `MeshDistortMaterial` blob (`@react-three/drei`) that reacts to the pointer,
  against a fixed dark hero section (not the light page background) so white
  headline text stays legible regardless of what the blob is doing.

Note: `useXRSessionModeSupported` (used by the VR entry button, Phase 10e)
isn't the only hook in this app that can't run during SSR - keep that in mind
before reaching for other browser-only hooks (`motion`'s `useScroll` against
`window`, etc.) without a mount guard like the one in `vr-entry-button.tsx`.

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
