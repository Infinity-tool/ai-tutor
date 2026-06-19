# Avatar Feature

Real-time AI avatar powered by **HeyGen Streaming API** via WebRTC.

## Main Components

| Component | Description |
|---|---|
| `AvatarStream.tsx` | Main video component. WebRTC stream → `<video>`. Glowing border when speaking. |
| `AvatarLoader.tsx` | Skeleton shown while connecting |
| `AvatarControls.tsx` | Status indicator + connect/disconnect buttons |

## Hooks

| Hook | Description |
|---|---|
| `useAvatarSession.ts` | Full session lifecycle: create → SDP handshake → speak → close. Auto token refresh at 55 min. |
| `useAvatarStream.ts` | Attaches `MediaStream` to `<video>` ref |

## External APIs

- **HeyGen Streaming API** — `https://api.heygen.com/v1/streaming.*`
- WebRTC: `RTCPeerConnection`, SDP offer/answer, ICE candidates

## Environment Variables

```bash
HEYGEN_API_KEY=your-heygen-api-key       # Server-side only, never NEXT_PUBLIC_
HEYGEN_AVATAR_ID=your-avatar-id          # Default avatar to use
```

## WebRTC Flow

```
Client                    Server (/api/avatar/stream)        HeyGen
  │                              │                              │
  │── POST { action: "create" } ──▶                              │
  │                              │── POST /streaming.new ───────▶│
  │                              │◀── { session_id, sdp, ice } ──│
  │◀── { session_id, sdp, ice } ──│                              │
  │                              │                              │
  │ setRemoteDescription(sdp)    │                              │
  │ createAnswer()               │                              │
  │── POST { action: "sdp", answer } ▶                          │
  │                              │── POST /streaming.sdp ───────▶│
  │                              │                              │
  │── POST { action: "ice", candidate } ▶                       │
  │                              │── POST /streaming.ice ───────▶│
  │                              │                              │
  │ [WebRTC connected — video streams directly HeyGen → Client] │
  │                              │                              │
  │── POST { action: "speak" } ──▶                              │
  │                              │── POST /streaming.task ──────▶│
  │ [avatar speaks in video]     │                              │
```

## Token Refresh

HeyGen sessions expire at **60 minutes**. `useAvatarSession` schedules a refresh at **55 minutes** using `setTimeout`, creating a new session transparently.

## Known Limitations

- Requires WebRTC support (all modern browsers)
- HeyGen free tier: limited concurrent sessions
- Safari on iOS may require user gesture before video plays

## Migration Path → MuseTalk

When moving to self-hosted MuseTalk:
1. Replace `heygen.service.ts` with `musetalk.service.ts` (same function signatures)
2. Update `HEYGEN_API_KEY` → `MUSETALK_API_URL` in `.env`
3. `useAvatarSession.ts` and `AvatarStream.tsx` stay unchanged

See `docs/MIGRATION.md` for full guide.
