"use client";

import React from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { RankCard } from "./RankCard";
import { LoadingSpinner } from "@/shared/components/feedback/LoadingSpinner";

export function LeaderboardTable() {
  const { data, isLoading, error, type, setType } = useLeaderboard();

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="flex gap-2">
        {(["global", "friends"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: type === t ? "var(--accent-primary)" : "var(--bg-card)",
              color: type === t ? "white" : "var(--text-secondary)",
              border: type === t ? "1px solid transparent" : "1px solid var(--border-glass)",
            }}
          >
            {t === "global" ? "🌐 Global" : "👥 Friends"}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading && <LoadingSpinner className="py-8" />}

      {error && (
        <div className="p-4 rounded-xl bg-[rgba(255,82,82,0.08)] border border-[rgba(255,82,82,0.3)] text-[var(--accent-danger)] text-sm">
          Failed to load leaderboard. Try again.
        </div>
      )}

      {data && (
        <div className="space-y-2">
          {data.map((entry) => (
            <RankCard key={entry.user_id} entry={entry} />
          ))}
          {data.length === 0 && (
            <p className="text-center text-[var(--text-muted)] py-8">
              {type === "friends" ? "No friends yet. Invite someone!" : "No data available."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
