# AI Dating Simulator

A web-based dating simulator: users (18+) meet fictional adult characters,
build relationships, unlock story chapters, and chat with AI-driven
characters. Content stays romance/flirty — no explicit sexual content is
generated; see Safety below.

## Tech stack

Next.js + TypeScript (frontend) · FastAPI + SQLModel (backend) · Postgres +
pgvector · Redis · LangChain / LangGraph / CrewAI · OpenAI.

## Running locally

```bash
cp .env.example .env   # fill in OPENAI_API_KEY, AUTH_SECRET
docker compose up -d
docker compose exec backend alembic upgrade head
docker compose exec backend python -m scripts.seed_characters
docker compose exec backend python -m scripts.seed_chapters
docker compose exec backend python -m scripts.seed_quests
docker compose exec backend python -m scripts.seed_gifts
```

Then open http://localhost:3000, sign up (18+ age-gate checkbox required),
and browse `/characters`.

## Project structure

```
project-x/
├── frontend/   # Next.js UI (Phase 2+)
├── backend/    # FastAPI API, models, migrations, AI chains/graphs, stories
└── worker/     # CrewAI background jobs (ARQ), run via docker compose
```

## Branching strategy

- `main` — stable, deployable. Only merged from `development`.
- `development` — integration branch. Phase branches merge here.
- `phase-N-<name>` — one branch per roadmap phase (e.g. `phase-1-setup`),
  merged into `development` via PR when the phase is working end-to-end.

## Roadmap

- [x] Phase 1 — Setup: Docker Compose, FastAPI, Postgres+pgvector, Alembic
- [x] Phase 2 — UI: Next.js, Tailwind, shadcn/ui, auth, character pages
- [x] Phase 3 — AI chat: OpenAI + LangChain, structured output, score rules
- [x] Phase 4 — LangGraph chat pipeline, memory, unlock nodes
- [x] Phase 5 — Story: branching chapter engine and unlocks
- [x] Phase 6 — Quests: daily quests, streaks
- [x] Phase 7 — 3D: React Three Fiber + VRM character, emotions
- [x] Phase 8 — CrewAI worker container, first crews
- [ ] Phase 9 — Deploy: VPS or Vercel + Render/Railway, HTTPS
- [ ] Phase 10 — V2: voice, gifts, dates, VR, analytics
  - [x] Phase 10a — Gifts: catalog + send-gift flow, affinity-based relationship deltas
  - [ ] Phase 10b — Analytics (admin dashboard)
  - [x] Phase 10c — Date locations: cafe/park/rooftop 3D scenes, client-side switcher
  - [x] Phase 10d — Voice: OpenAI TTS read-aloud on chat replies (generated on demand, not cached — real per-play cost, see `backend/README.md`)
  - [ ] Phase 10e — VR (WebXR)

## Safety

- 18+ age-verification gate before signup completes
- Content stays romance/flirty — no explicit sexual content, and that
  includes character art/avatars: no sexualized imagery or real-person
  likenesses
- Moderation on every user message and AI reply
- Users can delete their chat history and account — not yet implemented (add in a later phase)
- Known gap: `/api/auth/login` and `/api/chat` have no rate limiting yet — add before public launch (Redis-backed, see Cost Control notes)
