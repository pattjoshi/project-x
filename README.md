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
curl http://localhost:8000/health
```

## Project structure

```
project-x/
├── frontend/   # Next.js UI (Phase 2+)
├── backend/    # FastAPI API, models, migrations, AI chains/graphs, stories
└── worker/     # CrewAI background jobs (Phase 8+)
```

## Branching strategy

- `main` — stable, deployable. Only merged from `development`.
- `development` — integration branch. Phase branches merge here.
- `phase-N-<name>` — one branch per roadmap phase (e.g. `phase-1-setup`),
  merged into `development` via PR when the phase is working end-to-end.

## Roadmap

- [x] Phase 1 — Setup: Docker Compose, FastAPI, Postgres+pgvector, Alembic
- [ ] Phase 2 — UI: Next.js, Tailwind, shadcn/ui, auth, character pages
- [ ] Phase 3 — AI chat: OpenAI + LangChain, structured output, score rules
- [ ] Phase 4 — LangGraph chat pipeline, memory, unlock nodes
- [ ] Phase 5 — Story: branching chapter engine and unlocks
- [ ] Phase 6 — Quests: daily quests, streaks
- [ ] Phase 7 — 3D: React Three Fiber + VRM character, emotions
- [ ] Phase 8 — CrewAI worker container, first crews
- [ ] Phase 9 — Deploy: VPS or Vercel + Render/Railway, HTTPS
- [ ] Phase 10 — V2: voice, gifts, dates, VR, analytics

## Safety

- 18+ age-verification gate before signup completes
- Content stays romance/flirty — no explicit sexual content
- Moderation on every user message and AI reply (added in Phase 3)
- Users can delete their chat history and account
