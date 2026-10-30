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
presets), otherwise falls back to `PlaceholderAvatar` - a simple procedural
stand-in (color-tinted capsule + sphere) plus an emoji badge overlaid outside
the Canvas. No VRM assets are seeded yet; see
`public/models/README.md` for how to add one.

Note: the emotion badge is a plain DOM overlay, not drei's `<Html>` -
`<Html>` renders through its own internal `ReactDOM.createRoot()`, which is
unreliable under React 19's concurrent rendering (content silently failed to
mount in testing). Keep that in mind before reaching for `<Html>` elsewhere
in the 3D tree.
