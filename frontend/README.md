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
- `/characters/[id]/chat` — 3D café scene + free-form AI chat (Phase 3/4/7)
- `/characters/[id]/chapters`, `/characters/[id]/chapters/[chapterId]` — branching story chapters (Phase 5)
- `/daily` — login streak + daily quests (Phase 6)

## 3D (`components/3d/`)

The chat page renders a small café scene (`CafeScene`) via React Three Fiber.
`CharacterAvatar` loads a real VRM model when `character.vrm_model_url` is
set (via `@pixiv/three-vrm`, mapping our emotion strings to VRM expression
presets), otherwise falls back to `PlaceholderAvatar` - a simple procedural
stand-in (color-tinted capsule + sphere) plus an emoji badge overlaid outside
the Canvas. No VRM assets are seeded yet; see
`public/models/README.md` for how to add one.

Note: the emotion badge is a plain DOM overlay, not drei's `<Html>` -
`<Html>` renders through its own internal `ReactDOM.createRoot()`, which is
unreliable under React 19's concurrent rendering (content silently failed to
mount in testing). Keep that in mind before reaching for `<Html>` elsewhere
in the 3D tree.
