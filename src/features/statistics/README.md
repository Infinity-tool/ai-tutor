# Statistics Feature

Tracks and visualizes all user learning activity: hours, streaks, scores, leaderboard.

## Main Components
- `Dashboard/StatsOverview.tsx` — 4 animated stat cards with trend indicators
- `Dashboard/StreakTracker.tsx` — Flame icon + last 7 days activity dots
- `Dashboard/SubjectBreakdown.tsx` — Per-subject tabbed stats
- `Charts/HeatmapChart.tsx` — GitHub-style 52-week activity heatmap
- `Charts/ProgressChart.tsx` — Grammar + pronunciation line chart (Recharts)
- `Leaderboard/LeaderboardTable.tsx` — Global/Friends tabs
- `Leaderboard/RankCard.tsx` — Individual rank card with avatar

## Hooks
- `useStatistics.ts` — React Query, 30s refresh, optimistic updates
- `useLeaderboard.ts` — Global / friends leaderboard query

## Services
- `statistics.service.ts` — Wraps `/api/statistics` and `/api/statistics/leaderboard`

## External APIs
- None (all data from PostgreSQL via Prisma, cached in Redis)

## Known Limitations
- Leaderboard "friends" tab shows same as global until friend system is built
- PDF report download is a placeholder (not yet implemented)
