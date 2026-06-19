# API Routes Reference

All routes return `{ success: boolean, data?: T, error?: string }` unless noted.

## Auth

| Method | Route | Description |
|---|---|---|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js handlers |
| POST | `/api/auth/register` | Create new account |

### POST /api/auth/register
**Body:** `{ name, email, password, confirmPassword }`
**Returns:** `{ id, email, name }`

---

## AI

| Method | Route | Description |
|---|---|---|
| POST | `/api/ai/chat` | Stream LLM response (SSE) |
| POST | `/api/ai/speech-to-text` | Transcribe audio (Whisper) |
| POST | `/api/ai/text-to-speech` | Synthesize speech (ElevenLabs) |
| POST | `/api/ai/math` | Solve math problem step-by-step |

### POST /api/ai/chat
**Body:** `{ messages: [{role, content}], subject, level }`
**Response:** `text/event-stream` — `data: { token: "..." }` ... `data: [DONE]`

### POST /api/ai/speech-to-text
**Body:** `multipart/form-data` — `audio` (Blob), `language` (optional)
**Returns:** `{ transcript: string }`

### POST /api/ai/text-to-speech
**Body:** `{ text, language?, voice_id? }`
**Response:** `audio/mpeg` stream

### POST /api/ai/math
**Body:** `{ problem: string }`
**Returns:** `{ steps, final_answer, latex_answer, graph_data? }`

---

## Avatar

| Method | Route | Description |
|---|---|---|
| POST | `/api/avatar/stream` | HeyGen session actions |
| DELETE | `/api/avatar/stream` | Close session |

### POST /api/avatar/stream
**Body:** `{ action: "create" | "sdp" | "ice" | "speak", ...params }`

| action | Extra params | Returns |
|---|---|---|
| `create` | `avatar_id?` | `{ session_id, sdp, ice_servers, expires_at }` |
| `sdp` | `session_id, sdp` | `{ ok: true }` |
| `ice` | `session_id, candidate` | `{ ok: true }` |
| `speak` | `session_id, text` | `{ ok: true }` |

---

## Statistics

| Method | Route | Description |
|---|---|---|
| GET | `/api/statistics` | Get full user stats (Redis cached 30s) |
| POST | `/api/statistics` | Update stats after session |
| GET | `/api/statistics/leaderboard?type=global\|friends` | Leaderboard |

---

## Sessions

| Method | Route | Description |
|---|---|---|
| GET | `/api/sessions?limit=&subject=` | List recent sessions |
| POST | `/api/sessions` | Save completed session |

### POST /api/sessions
**Body:** `{ subject, duration, messages, feedback? }`
**Returns:** `{ id }` (201)
