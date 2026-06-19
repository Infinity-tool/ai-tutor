# Voice Pipeline

Complete voice interaction system for the AI Tutor application.  
Covers microphone capture → Whisper transcription → ElevenLabs TTS → Web Audio playback.

---

## ⚠️ HTTPS Requirement

> **The voice pipeline will NOT work without HTTPS (or `localhost`).**

`navigator.mediaDevices` is a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) API.  
Browsers block microphone access on plain HTTP. Ensure your deployment uses TLS.

| Environment | Works? |
|---|---|
| `https://your-domain.com` | ✅ Yes |
| `http://localhost:3000` | ✅ Yes (localhost exception) |
| `http://192.168.x.x:3000` | ❌ No — use `https://` or a tunnel (ngrok, cloudflared) |
| `http://your-domain.com` | ❌ No |

---

## Browser Compatibility

| Browser | Microphone | MediaRecorder | Web Audio API |
|---|---|---|---|
| Chrome 74+ | ✅ | ✅ webm/opus | ✅ |
| Firefox 75+ | ✅ | ✅ ogg/opus | ✅ |
| Safari 14.1+ | ✅ | ✅ mp4 | ✅ (webkit prefix) |
| Edge 79+ | ✅ | ✅ webm/opus | ✅ |
| Mobile Chrome | ✅ | ✅ | ✅ |
| Mobile Safari | ✅ | ⚠️ mp4 only | ✅ |

**Note:** Safari requires user gesture (button tap) before `AudioContext` can resume.  
`useTextToSpeech` handles this automatically via `audioContext.resume()`.

---

## Architecture

```
User speaks
    │
    ▼
useMicrophone          — MediaDevices API, permission handling
    │
    ▼  (MediaStream)
VoiceRecorder          — MediaRecorder + Web Audio AnalyserNode waveform
    │
    ▼  (Blob)
useSpeechToText        — POST /api/ai/speech-to-text
    │                    (multipart/form-data)
    ▼
/api/ai/speech-to-text — OpenAI Whisper API
    │
    ▼  (transcript string)
[Chat / AI processing]
    │
    ▼  (AI response text)
useTextToSpeech        — POST /api/ai/text-to-speech
    │                    (JSON)
    ▼
/api/ai/text-to-speech — ElevenLabs API (streaming)
    │
    ▼  (audio/mpeg stream)
Web Audio API          — decodeAudioData + AudioBufferSourceNode
    │
    ▼
User hears response
```

---

## Permission Flow

1. User opens voice feature → `VoicePermission` component shown
2. User clicks "Allow" → `useMicrophone.startRecording()` called
3. Browser shows native permission dialog
4. **Granted** → `MediaStream` returned, recording begins
5. **Denied** → `VoicePermission` shows fix instructions (NOT_ALLOWED error)
6. **No device** → `VoicePermission` shows device-not-found message (NOT_FOUND error)
7. **Unsupported browser** → `VoicePermission` shows browser recommendation (NOT_SUPPORTED)

---

## Environment Variables

Create a `.env.local` file in your project root:

```bash
# OpenAI — required for speech-to-text (Whisper)
OPENAI_API_KEY=sk-...

# ElevenLabs — required for text-to-speech
ELEVENLABS_API_KEY=...
ELEVENLABS_DEFAULT_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # optional, defaults to "Rachel"

# Optional per-language voice overrides
ELEVENLABS_UZ_VOICE_ID=...   # Uzbek voice ID
ELEVENLABS_RU_VOICE_ID=...   # Russian voice ID
```

---

## File Structure

```
src/features/voice/
├── components/
│   ├── VoicePermission.tsx    # Permission request / denied UI
│   └── VoiceRecorder.tsx      # Animated button + waveform visualizer
├── hooks/
│   ├── useMicrophone.ts       # MediaStream + permission handling
│   ├── useSpeechToText.ts     # Audio blob → transcript
│   └── useTextToSpeech.ts     # Text → ElevenLabs → Web Audio playback
└── README.md

src/app/api/ai/
├── speech-to-text/
│   └── route.ts               # OpenAI Whisper endpoint
└── text-to-speech/
    └── route.ts               # ElevenLabs streaming endpoint
```

---

## Quick Usage Example

```tsx
"use client";

import { useState } from "react";
import { useMicrophone } from "@/features/voice/hooks/useMicrophone";
import { useSpeechToText } from "@/features/voice/hooks/useSpeechToText";
import { useTextToSpeech } from "@/features/voice/hooks/useTextToSpeech";
import { VoicePermission } from "@/features/voice/components/VoicePermission";
import { VoiceRecorder } from "@/features/voice/components/VoiceRecorder";

export function VoiceChat() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { error, errorMessage, startRecording } = useMicrophone();
  const { transcribe, isTranscribing } = useSpeechToText({ language: "uz" });
  const { speak, isSpeaking, stop } = useTextToSpeech();

  const handleAllow = async () => {
    await startRecording();
    setPermissionGranted(true);
  };

  const handleRecordingComplete = async (blob: Blob) => {
    const transcript = await transcribe(blob);
    if (transcript) {
      // Send to AI, get response, then speak it
      const aiResponse = await sendToAI(transcript);
      await speak(aiResponse, "uz");
    }
  };

  if (!permissionGranted || error) {
    return (
      <VoicePermission
        onAllow={handleAllow}
        error={error}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <VoiceRecorder
      onRecordingComplete={handleRecordingComplete}
      disabled={isTranscribing || isSpeaking}
    />
  );
}
```

---

## Limits & Quotas

| Service | Limit |
|---|---|
| OpenAI Whisper | 25 MB per request, ~0.006 USD/min |
| ElevenLabs TTS | 5000 chars per request; quota varies by plan |
| MediaRecorder | Browser RAM limited; stop at ~5 min for safety |

---

## Security Notes

- API keys are server-side only (`route.ts`) — never exposed to the client
- Audio is sent directly to OpenAI/ElevenLabs and not stored by this app
- All API routes validate input before forwarding to external services
