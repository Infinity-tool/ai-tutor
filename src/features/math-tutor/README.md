# Math Tutor Feature

Solves math problems step-by-step with KaTeX rendering and optional function graph plotting.

## Main Components
- `MathSolver.tsx` — Input + solve button + results
- `StepByStep.tsx` — Animated step-by-step solution reveal with KaTeX
- `MathRenderer.tsx` — KaTeX rendering wrapper (dynamic import, SSR-safe)
- `GraphPlotter.tsx` — Recharts line chart for function visualization

## Hooks
- `useMathSession.ts` — Problem → API call → solution state

## Services
- `math.service.ts` — Math.js direct eval + Groq LLM for explanations

## External APIs
- Groq API (`GROQ_API_KEY`) — JSON-mode response for structured steps
- Math.js — Local computation (no API needed)

## Environment Variables
```bash
GROQ_API_KEY=
```

## Known Limitations
- Graph plotter only supports single-variable functions of x
- Very complex symbolic algebra (e.g. differential equations) may produce incomplete steps
- KaTeX requires browser environment — MathRenderer uses dynamic import
