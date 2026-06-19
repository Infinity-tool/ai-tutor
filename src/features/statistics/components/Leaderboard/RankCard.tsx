"use client";

import React from "react";
import Image from "next/image";
import { LeaderboardEntry } from "../../types/statistics.types";

interface RankCardProps {
  entry: LeaderboardEntry;
}

const rankColors: Record<number, string> = {
  1: "#FFB300",
  2: "#8892A4",
  3: "#CD7F32",
};

export function RankCard({ entry }: RankCardProps) {
  const rankColor = rankColors[entry.rank] ?? "var(--text-muted)";
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl border transition-all"
      style={{
        background: entry.isCurrentUser
          ? "rgba(108,99,255,0.08)"
          : "var(--bg-card)",
        borderColor: entry.isCurrentUser
          ? "rgba(108,99,255,0.3)"
          : "var(--border-glass)",
      }}
      aria-current={entry.isCurrentUser ? "true" : undefined}
    >
      {/* Rank */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{
          background: isTop3 ? `${rankColor}20` : "var(--bg-secondary)",
          color: rankColor,
          border: `1px solid ${isTop3 ? `${rankColor}40` : "var(--border-glass)"}`,
        }}
        aria-label={`Rank ${entry.rank}`}
      >
        {isTop3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-glass)] flex-shrink-0">
        {entry.image ? (
          <Image src={entry.image} alt={entry.name} width={40} height={40} className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            {entry.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-[var(--text-primary)] truncate">
          {entry.name}
          {entry.isCurrentUser && (
            <span className="ml-2 text-[10px] text-[var(--accent-primary)] font-normal">(you)</span>
          )}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          🔥 {entry.current_streak} day streak
        </p>
      </div>

      {/* Points */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-sm text-[var(--accent-warning)]">
          {entry.total_points.toLocaleString()}
        </p>
        <p className="text-[10px] text-[var(--text-muted)]">points</p>
      </div>
    </div>
  );
}
