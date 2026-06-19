# Design System

SuperTutor AI uses a **Dark Glassmorphism Premium** design language.

## Color Tokens

All defined as CSS variables in `src/app/globals.css`.

| Variable | Value | Usage |
|---|---|---|
| `--bg-primary` | `#080B14` | Page background |
| `--bg-secondary` | `#0D1117` | Sidebar, card backgrounds |
| `--bg-card` | `rgba(255,255,255,0.04)` | Glass card base |
| `--bg-card-hover` | `rgba(255,255,255,0.07)` | Card hover state |
| `--border-glass` | `rgba(255,255,255,0.08)` | Glass borders |
| `--accent-primary` | `#6C63FF` | Brand purple — buttons, active states |
| `--accent-secondary` | `#00D2FF` | Cyan — AI/voice indicators |
| `--accent-success` | `#00E676` | Green — correct answers |
| `--accent-warning` | `#FFB300` | Amber — streak/score |
| `--accent-danger` | `#FF5252` | Red — wrong answers, errors |
| `--text-primary` | `#F0F4FF` | Body text |
| `--text-secondary` | `#8892A4` | Muted labels |
| `--text-muted` | `#4A5568` | Placeholders, timestamps |

## Typography

| Font | Variable | Usage |
|---|---|---|
| Clash Display | `--font-clash` | Headings, hero text — `font-display` class |
| Inter | `--font-inter` | Body text — `font-body` class (default) |
| JetBrains Mono | `--font-jetbrains` | Code, math, data — `font-mono` class |

Fonts are self-hosted in `public/fonts/`. Download from:
- Clash Display: https://www.fontshare.com/fonts/clash-display
- JetBrains Mono: https://www.jetbrains.com/legalnotice/font/

## Glassmorphism Card

Apply `.glass-card` class (hover effect) or `.glass-card-static` (no hover).

```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 16px;
backdrop-filter: blur(20px);
box-shadow: 0 4px 24px rgba(0,0,0,0.3);
```

## Buttons

Use the `Button` component from `@/shared/components/ui/Button`.

| Variant | Usage |
|---|---|
| `primary` | Main CTA — purple |
| `secondary` | Secondary CTA — cyan |
| `ghost` | Tertiary — outlined |
| `danger` | Destructive actions |
| `gradient` | Landing page CTAs |

## Spacing

Consistent spacing: `4px` grid. Padding: `p-4` (16px), `p-5` (20px), `p-6` (24px).

## Animations

| Class | Effect |
|---|---|
| `.animate-fade-in` | Fade + slide up (messages, cards) |
| `.animate-avatar-glow` | Purple glow pulse (avatar when speaking) |
| `.skeleton` | Shimmer loading placeholder |
| `animate-pulse` | Built-in Tailwind pulse |
| `animate-bounce` | Built-in Tailwind bounce |
