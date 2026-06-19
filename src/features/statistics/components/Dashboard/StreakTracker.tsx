"use client";

import React from "react";
import { UserStatsResponse } from "../../types/statistics.types";

interface StreakTrackerProps {
  stats: UserStatsResponse;
}

export function StreakTracker({ stats }: StreakTrackerProps) {
  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return { key, active: !!stats.activity_log[key], label: d.toLocaleDateString("en", { weekday: "short" }) };
  });

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🔥</span>
        <div>
          <p className="font-display font-bold text-2xl text-[var(--accent-warning)]">
            {stats.current_streak}
            <span className="text-sm font-normal text-[var(--text-secondary)] ml-1">day streak</span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">Best: {stats.longest_streak} days</p>
        </div>
      </div>

      {/* Last 7 days dots */}
      <div className="flex items-center gap-2">
        {last7.map(({ key, active, label }) => (
          <div key={key} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full aspect-square rounded-lg transition-all"
              style={{
                background: active ? "var(--accent-warning)" : "var(--bg-secondary)",
                border: `1px solid ${active ? "rgba(255,179,0,0.4)" : "var(--border-glass)"}`,
                boxShadow: active ? "0 0 8px rgba(255,179,0,0.3)" : "none",
              }}
              title={`${label}: ${active ? "Active" : "No activity"}`}
              aria-label={`${label}: ${active ? "practiced" : "no practice"}`}
            />
            <span className="text-[9px] text-[var(--text-muted)]">{label.slice(0, 1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
