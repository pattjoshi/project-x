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

## Routes (Phase 2)

- `/` — landing page
- `/signup`, `/login` — auth forms (signup includes the 18+ age-gate checkbox)
- `/characters` — character list (protected by `middleware.ts`)
- `/characters/[id]` — character profile
