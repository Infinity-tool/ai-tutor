/**
 * GET  /api/statistics  → Fetch authenticated user's full stats
 * POST /api/statistics  → Update stats after a session ends
 */
import { NextRequest } from "next/server";
import { auth } from "@/shared/lib/auth";
import { db } from "@/shared/lib/db";
import { redis, CACHE_TTL } from "@/shared/lib/redis";
import { ok, err, serverError } from "@/shared/lib/api-helpers";
import { todayKey } from "@/shared/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return err("Unauthorized", 401);

    const userId = session.user.id;
    const cacheKey = `stats:${userId}`;

    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return ok(cached);

    // Fetch from DB
    const [userStats, subjectStats, streak, recentSessions] = await Promise.all([
      db.userStatistics.findUnique({ where: { user_id: userId } }),
      db.subjectStats.findMany({ where: { user_id: userId } }),
      db.userStreak.findUnique({ where: { user_id: userId } }),
      db.session.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        take: 30,
      }),
    ]);

    // Build weekly data (last 7 sessions per day)
    const weeklyMap = new Map<string, { grammar: number[]; pronunciation: number[] }>();
    recentSessions.forEach((s) => {
      const day = s.created_at.toLocaleDateString("en", { weekday: "short" });
      const fb = s.feedback as Record<string, number> | null;
      if (!weeklyMap.has(day)) weeklyMap.set(day, { grammar: [], pronunciation: [] });
      if (fb?.grammar_score) weeklyMap.get(day)!.grammar.push(fb.grammar_score);
      if (fb?.pronunciation_score) weeklyMap.get(day)!.pronunciation.push(fb.pronunciation_score);
    });

    const weekly_data = Array.from(weeklyMap.entries()).map(([date, scores]) => ({
      date,
      grammar: scores.grammar.length ? Math.round(scores.grammar.reduce((a, b) => a + b, 0) / scores.grammar.length) : 0,
      pronunciation: scores.pronunciation.length ? Math.round(scores.pronunciation.reduce((a, b) => a + b, 0) / scores.pronunciation.length) : 0,
      sessions: scores.grammar.length,
    }));

    const data = {
      total_hours: userStats?.total_hours ?? 0,
      total_sessions: userStats?.total_sessions ?? 0,
      total_points: userStats?.total_points ?? 0,
      current_streak: streak?.current_streak ?? 0,
      longest_streak: streak?.longest_streak ?? 0,
      subject_stats: subjectStats.map((s) => ({
        subject: s.subject,
        total_minutes: s.total_minutes,
        session_count: s.session_count,
        current_level: s.current_level,
        pronunciation_score: s.pronunciation_score,
        grammar_score: s.grammar_score,
        problems_solved: s.problems_solved,
        correct_answers: s.correct_answers,
        accuracy: s.problems_solved > 0 ? Math.round((s.correct_answers / s.problems_solved) * 100) : 0,
      })),
      activity_log: (streak?.activity_log as Record<string, boolean>) ?? {},
      weekly_data,
      trend: { hours_change_pct: 0, sessions_change_pct: 0, score_change_pct: 0 },
    };

    // Cache result
    await redis.setex(cacheKey, CACHE_TTL.STATS, JSON.stringify(data));
    return ok(data);
  } catch (error) {
    return serverError("GET /api/statistics", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return err("Unauthorized", 401);

    const userId = session.user.id;
    const body = await req.json();
    const { subject, duration, pronunciation_score, grammar_score, points_earned = 0 } = body;

    const hours = duration / 3600;

    await db.$transaction(async (tx) => {
      // Update global stats
      await tx.userStatistics.upsert({
        where: { user_id: userId },
        create: { user_id: userId, total_hours: hours, total_sessions: 1, total_points: points_earned },
        update: {
          total_hours: { increment: hours },
          total_sessions: { increment: 1 },
          total_points: { increment: points_earned },
        },
      });

      // Update subject-specific stats
      if (subject) {
        await tx.subjectStats.upsert({
          where: { user_id_subject: { user_id: userId, subject } },
          create: {
            user_id: userId, subject,
            total_minutes: duration / 60,
            session_count: 1,
            pronunciation_score: pronunciation_score ?? null,
            grammar_score: grammar_score ?? null,
          },
          update: {
            total_minutes: { increment: duration / 60 },
            session_count: { increment: 1 },
            pronunciation_score: pronunciation_score ?? undefined,
            grammar_score: grammar_score ?? undefined,
          },
        });
      }

      // Update streak
      const today = todayKey();
      const streakRecord = await tx.userStreak.findUnique({ where: { user_id: userId } });
      const log = (streakRecord?.activity_log as Record<string, boolean>) ?? {};
      log[today] = true;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().split("T")[0];

      const wasActiveYesterday = !!log[yKey];
      const newStreak = wasActiveYesterday
        ? (streakRecord?.current_streak ?? 0) + 1
        : 1;

      await tx.userStreak.upsert({
        where: { user_id: userId },
        create: { user_id: userId, current_streak: 1, longest_streak: 1, last_active: new Date(), activity_log: log },
        update: {
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streakRecord?.longest_streak ?? 0),
          last_active: new Date(),
          activity_log: log,
        },
      });
    });

    // Invalidate cache
    await redis.del(`stats:${userId}`);
    return ok({ updated: true });
  } catch (error) {
    return serverError("POST /api/statistics", error);
  }
}
