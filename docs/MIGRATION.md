# Migration Paths

This document describes how to migrate from hosted APIs to self-hosted alternatives.

---

## HeyGen → MuseTalk (Avatar)

**When:** 1000+ concurrent users or cost optimization needed.

**Steps:**
1. Deploy MuseTalk on your infrastructure
2. Create `src/features/avatar/services/musetalk.service.ts` with the **same function signatures**:
   - `createStreamingSession(avatarId)`
   - `sendSdpAnswer(sessionId, sdp)`
   - `sendIceCandidate(sessionId, candidate)`
   - `sendTextToAvatar(payload)`
   - `closeSession(sessionId)`
3. Update `src/app/api/avatar/stream/route.ts` to import from `musetalk.service.ts`
4. Replace `HEYGEN_API_KEY` with `MUSETALK_API_URL` in `.env`
5. `useAvatarSession.ts`, `AvatarStream.tsx` — **no changes needed**

---

## ElevenLabs → Fish Speech (TTS)

**When:** Cost optimization or data privacy requirements.

**Steps:**
1. Deploy Fish Speech on your infrastructure
2. Create `src/features/voice/services/fish-speech.service.ts`:
   ```ts
   export async function synthesizeSpeech(
     text: string,
     options: SynthesizeOptions,
     signal?: AbortSignal
   ): Promise<ArrayBuffer> { ... }
   ```
3. Update `src/app/api/ai/text-to-speech/route.ts` to call Fish Speech endpoint
4. Replace `ELEVENLABS_API_KEY` with `FISH_SPEECH_API_URL`
5. `useTextToSpeech.ts` — **no changes needed**

---

## Groq → Self-hosted Llama (LLM)

**When:** Maximum privacy or enterprise deployment.

**Steps:**
1. Deploy llama.cpp or vLLM with OpenAI-compatible API
2. In `src/features/ai-tutor/services/llm.service.ts`:
   ```ts
   const groq = new Groq({
     apiKey: process.env.LLAMA_API_KEY ?? "not-needed",
     baseURL: process.env.LLAMA_BASE_URL, // e.g. http://localhost:8080/v1
   });
   ```
3. Change `GROQ_API_KEY` → `LLAMA_API_KEY` + `LLAMA_BASE_URL` in `.env`
4. All other code — **no changes needed** (OpenAI-compatible format)

---

## OpenAI Whisper → Self-hosted (STT)

**When:** Data privacy requirements (audio never leaves your servers).

**Steps:**
1. Deploy faster-whisper or whisper.cpp with an HTTP API
2. Update `src/app/api/ai/speech-to-text/route.ts` to call your endpoint
3. Replace `OPENAI_API_KEY` with `WHISPER_API_URL`
4. All voice hooks — **no changes needed**
