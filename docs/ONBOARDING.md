# New to SuperTutor AI? Start Here.

Welcome. This document gets you from zero to running in under 15 minutes.

## 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or Supabase free tier)
- Redis (or Upstash free tier)
- API keys: see `.env.example`

## 2. Install & Run

```bash
# Clone and install
npm install

# Copy env file and fill in your keys
cp .env.example .env.local

# Push DB schema
npx prisma generate
npx prisma db push

# Start dev server
npm run dev
```

Open http://localhost:3000

## 3. Project Structure (30-second tour)

```
src/
  app/           → Pages and API routes (Next.js App Router)
  features/      → ALL business logic lives here (one folder per feature)
  shared/        → Components, hooks, stores shared across features
prisma/          → Database schema
docs/            → You are here
```

## 4. Where to Find Things

| I want to... | Look in... |
|---|---|
| Change the AI prompt | `src/features/ai-tutor/services/prompts/` |
| Modify the chat UI | `src/features/ai-tutor/components/TutorChat.tsx` |
| Change the avatar | `src/features/avatar/services/heygen.service.ts` |
| Add a new subject | `src/shared/types/global.types.ts` → `Subject` type |
| Change colors/fonts | `src/app/globals.css` → CSS variables |
| Add an API route | `src/app/api/` → follow existing route pattern |
| Change DB schema | `prisma/schema.prisma` → run `npx prisma db push` |

## 5. Key Concepts

- **Voice requires HTTPS** — use `localhost` in dev, `https://` in prod
- **No API keys in client code** — all go through `src/app/api/` routes
- **Feature READMEs** — every `src/features/*/README.md` explains that feature
- **Streaming** — LLM responses stream via SSE, never buffered
- **Avatar** — WebRTC, loaded with `dynamic(..., { ssr: false })`

## 6. Running Type Checks

```bash
npm run type-check
```

## 7. Deploying

```bash
# Vercel (recommended)
vercel deploy

# Set all .env.example variables in Vercel dashboard
```

See `docs/ARCHITECTURE.md` for the full picture.
