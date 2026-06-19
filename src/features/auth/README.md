# Auth Feature

Handles user registration, login, and session management.

## Main Components
- `LoginForm.tsx` — Glassmorphism card with Google OAuth + email/password
- `RegisterForm.tsx` — Registration form with Zod validation

## Hooks
- `useAuth.ts` — Login, register, logout actions with error state

## External APIs
- NextAuth.js v5 (`/api/auth/[...nextauth]`)
- Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
- Custom register endpoint (`/api/auth/register`)

## Environment Variables
```bash
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
```

## Known Limitations
- Password reset flow not yet implemented
- Email verification not yet implemented
