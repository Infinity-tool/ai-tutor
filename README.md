# SuperTutor AI — Web MVP

Premium AI-powered language and math tutoring. Built with Next.js 14, TypeScript, and a Dark Glassmorphism design system.

## Features

- 🎙️ **Voice Chat** — Microphone → Whisper STT → LLM → ElevenLabs TTS
- 🤖 **Live AI Avatar** — HeyGen Streaming API via WebRTC
- 📊 **Real-time Feedback** — Grammar & pronunciation scores per message
- 🌍 **5 Subjects** — English, Russian, German, Turkish, Math
- 📐 **Math Tutor** — Step-by-step KaTeX rendering + function graphs
- 🏆 **Leaderboard** — Global rankings with streaks
- 📈 **Statistics** — GitHub-style heatmap, weekly charts, streaks

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in API keys
npx prisma generate
npx prisma db push
npm run dev
```

→ http://localhost:3000

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables |
| State | Zustand + React Query |
| Database | PostgreSQL + Prisma |
| Cache | Redis (Upstash) |
| Auth | NextAuth.js v5 |
| LLM | Groq (primary) + Together AI (fallback) |
| STT | OpenAI Whisper |
| TTS | ElevenLabs |
| Avatar | HeyGen Streaming (WebRTC) |
| Charts | Recharts |

## Documentation

- [Onboarding](./docs/ONBOARDING.md) — Start here
- [Architecture](./docs/ARCHITECTURE.md) — How it all fits together
- [API Reference](./docs/API.md) — All endpoints
- [Design System](./docs/DESIGN_SYSTEM.md) — Colors, fonts, components
- [Migration Guide](./docs/MIGRATION.md) — Moving to self-hosted APIs

## Project Structure

```
src/
  app/          → Next.js pages + API routes
  features/     → auth, avatar, voice, ai-tutor, math-tutor, statistics, sessions
  shared/       → Shared UI, hooks, lib, store, types
prisma/         → Database schema
docs/           → Documentation
```

## Environment Variables

See `.env.example` for all required variables.

## Deployment

Deploy to Vercel in one click. Set all `.env.example` variables in the Vercel dashboard.

**Note:** Voice features require HTTPS. Vercel provides this automatically.
