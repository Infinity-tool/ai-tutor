# Architecture Overview

SuperTutor AI uses a **feature-based modular architecture** on Next.js 14 App Router.

## Core Principle

Every feature is **self-contained**: components, hooks, services, types, and README in one folder. A developer can understand a feature without reading other folders.

## Request Flow

```
Browser
  │
  ├── Page (app/(dashboard)/tutor/page.tsx)
  │     └── TutorChat component
  │           ├── useStreamingChat() → POST /api/ai/chat
  │           ├── useMicrophone() → browser MediaDevices API
  │           ├── useSpeechToText() → POST /api/ai/speech-to-text
  │           └── useTextToSpeech() → POST /api/ai/text-to-speech
  │
  └── API Routes (app/api/)
        ├── /api/ai/chat → llm.service.ts → Groq/Together AI
        ├── /api/ai/speech-to-text → OpenAI Whisper
        ├── /api/ai/text-to-speech → ElevenLabs
        └── /api/avatar/stream → heygen.service.ts → HeyGen
```

## State Management

| What | Where | Why |
|---|---|---|
| Auth session | NextAuth JWT | Built-in, server-side |
| User profile/points | Zustand (`user.store.ts`) | Global, persisted to localStorage |
| Active session | Zustand (`session.store.ts`) | Global, not persisted |
| Server data | React Query | Cache + refetch |

## Database

PostgreSQL via Prisma. Tables:
- `User` — auth, profile
- `Session` — each tutoring session with messages + feedback
- `UserStatistics` — aggregated totals
- `SubjectStats` — per-subject progress
- `UserStreak` — streak + 365-day activity log

Redis (Upstash) caches stats for 30 seconds to avoid DB hammering on dashboard.

## API Key Security

Zero client-side API keys. All external services are called from `src/app/api/` routes only. `NEXT_PUBLIC_` prefix is forbidden for secrets.

## Feature Dependencies

```
TutorChat
  ├── depends on: voice/* hooks
  ├── depends on: avatar/* components
  └── depends on: ai-tutor/* services

Statistics pages
  └── depends on: statistics/* hooks + components

All features
  └── depend on: shared/* (UI, lib, store, types)
```
