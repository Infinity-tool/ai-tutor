# AI Tutor Feature

Real-time language and subject tutoring via streaming LLM with pronunciation/grammar feedback.

## Main Components
- `TutorChat.tsx` — Full tutor interface: Avatar + Chat + Voice
- `MessageBubble.tsx` — User/AI message bubbles with feedback chips
- `FeedbackPanel.tsx` — Pronunciation & grammar score bars
- `SubjectSelector.tsx` — Subject picker (EN/RU/DE/TR/Math)
- `LevelBadge.tsx` — CEFR level indicator

## Hooks
- `useStreamingChat.ts` — SSE streaming, parses `<feedback>` tags from LLM
- `useTutorSession.ts` — Session lifecycle, timer, save to DB

## Services
- `llm.service.ts` — Groq primary + Together AI fallback streaming
- `prompts/base.prompt.ts` — System prompt factory per subject/level
- `prompts/english.prompt.ts` — English conversation starters per CEFR level

## External APIs
- Groq API — `GROQ_API_KEY` (model: llama-3.1-70b-versatile)
- Together AI — `TOGETHER_AI_API_KEY` (fallback)

## Known Limitations
- Feedback parsing is regex-based — complex LLM outputs may miss some tags
- Avatar speaking is triggered after full AI response (not streamed sentence-by-sentence)
