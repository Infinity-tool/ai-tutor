/**
 * Statistics Service (client-side)
 * Wraps API calls to /api/statistics
 */
import { UserStatsResponse, LeaderboardEntry } from "../types/statistics.types";

export async function fetchUserStats(): Promise<UserStatsResponse> {
  const res = await fetch("/api/statistics");
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Failed to fetch stats");
  return data.data;
}

export async function updateStatsAfterSession(sessionData: {
  subject: string;
  duration: number;
  pronunciation_score?: number;
  grammar_score?: number;
  points_earned: number;
}): Promise<void> {
  await fetch("/api/statistics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData),
  });
}

export async function fetchLeaderboard(
  type: "global" | "friends" = "global"
): Promise<LeaderboardEntry[]> {
  const res = await fetch(`/api/statistics/leaderboard?type=${type}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Failed to fetch leaderboard");
  return data.data;
}
