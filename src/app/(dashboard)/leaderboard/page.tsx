import type { Metadata } from "next";
import { LeaderboardTable } from "@/features/statistics/components/Leaderboard/LeaderboardTable";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">🏆 Leaderboard</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">See how you rank against other learners</p>
      </div>
      <LeaderboardTable />
    </div>
  );
}
