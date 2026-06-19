# Setup Checklist — SuperTutor AI
# Quyidagi tartibda bajaring (~ 15 daqiqa)

## ☑ 1. npm install — BAJARILDI
## ☑ 2. npm run dev — ISHLAYAPTI (http://localhost:3000)

---

## ☐ 3. NEXTAUTH_SECRET yaratish (1 daqiqa)

Terminalda (Kiro terminal yoki Windows CMD):
```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Chiqadigan uzun stringni `.env.local` faylida:
```
NEXTAUTH_SECRET="shu_yerga_yozing"
```

---

## ☐ 4. PostgreSQL Database — Neon.tech (5 daqiqa, BEPUL)

1. https://neon.tech → "Sign Up" (GitHub bilan)
2. "New Project" → nom bering → "Create project"
3. Dashboard → "Connection string" → **kopiyalang**
   Ko'rinishi: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. `.env.local` faylida:
   ```
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
5. Server to'xtatib qayta ishga tushiring, keyin:
   ```
   npx prisma generate
   npx prisma db push
   ```
   ✓ "Your database is now in sync" ko'rsangiz tayyor!

---

## ☐ 5. Redis — Upstash (3 daqiqa, BEPUL)

1. https://console.upstash.com → "Create Database"
2. Nom bering, region: "US-East-1" → "Create"
3. "REST API" bo'limidan:
   - `UPSTASH_REDIS_REST_URL` → URL
   - `UPSTASH_REDIS_REST_TOKEN` → Token
4. `.env.local` ga qo'ying

---

## ☐ 6. Groq API — AI Chat (2 daqiqa, BEPUL)

1. https://console.groq.com → Sign up
2. "API Keys" → "Create API Key"
3. `.env.local`:
   ```
   GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxx"
   ```

---

## ☐ 7. OpenAI — Whisper STT (ovoz → matn)

1. https://platform.openai.com → API Keys
2. `.env.local`:
   ```
   OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"
   ```

---

## ☐ 8. ElevenLabs — TTS (matn → ovoz)

1. https://elevenlabs.io → Profile Settings → API Key
2. `.env.local`:
   ```
   ELEVENLABS_API_KEY="xxxxxxxxxxxxxxxx"
   ```

---

## ☐ 9. Google OAuth (ixtiyoriy — "Google bilan kirish" uchun)

1. https://console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth 2.0 Client
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. `.env.local`:
   ```
   GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-xxxx"
   ```

---

## ☐ 10. HeyGen Avatar (ixtiyoriy)

1. https://app.heygen.com → Settings → API Key
2. `.env.local`:
   ```
   HEYGEN_API_KEY="xxxxxxxx"
   HEYGEN_AVATAR_ID="xxxxxxxx"
   ```

---

## Minimal ishlash uchun ZARURIY kalitlar:
| Kalit | Maqsad | Bepulmi? |
|---|---|---|
| `NEXTAUTH_SECRET` | Login ishlashi | Ha (local) |
| `DATABASE_URL` | User saqlash | Ha (Neon) |
| `UPSTASH_REDIS_*` | Cache | Ha (Upstash) |
| `GROQ_API_KEY` | AI chat | Ha |
| `OPENAI_API_KEY` | Ovoz → Matn | To'lovli |
| `ELEVENLABS_API_KEY` | Matn → Ovoz | Bepul tier bor |

---

## Barcha kalitlar tayyor bo'lgandan keyin:
```bash
# Server to'xtatib qayta ishga tushiring
# Kiro terminaldagi jarayonni to'xtating, keyin:
npm run dev
```

Brauzerda: http://localhost:3000
