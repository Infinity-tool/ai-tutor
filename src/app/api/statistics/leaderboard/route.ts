import { NextRequest } from "next/server";
import { auth } from "@/shared/lib/auth";
import { db } from "@/shared/lib/db";
import { ok, err, serverError } from "@/shared/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return err("Unauthorized", 401);
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "global";

    const topUsers = await db.userStatistics.findMany({
      orderBy: { total_points: "desc" },
      take: 50,
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    const streakMap = new Map<string, number>();
    const streaks = await db.userStreak.findMany({
      where: { user_id: { in: topUsers.map((u) => u.user_id) } },
      select: { user_id: true, current_streak: true },
    });
    streaks.forEach((s) => streakMap.set(s.user_id, s.current_streak));

    const leaderboard = topUsers.map((u, i) => ({
      rank: i + 1,
      user_id: u.user_id,
      name: u.user?.name ?? "Anonymous",
      image: u.user?.image ?? null,
      total_points: u.total_points,
      current_streak: streakMap.get(u.user_id) ?? 0,
      isCurrentUser: u.user_id === userId,
    }));

    return ok(leaderboard);
  } catch (error) {
    return serverError("GET /api/statistics/leaderboard", error);
  }
}
