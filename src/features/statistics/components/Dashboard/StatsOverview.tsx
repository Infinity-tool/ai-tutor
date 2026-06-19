"use client";

import React, { useEffect, useRef, useState } from "react";
import { UserStatsResponse } from "../../types/statistics.types";

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  unit: string;
  trend?: number;
  color: string;
}

function useCountUp(target: number, duration = 1200): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startVal = useRef(0);

  useEffect(() => {
    startVal.current = 0;
    startRef.current = null;

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(startVal.current + (target - startVal.current) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return current;
}

function StatCard({ icon, label, value, unit, trend, color }: StatCardProps) {
  const animatedValue = useCountUp(value);

  return (
    <div className="glass-card p-5 space-y-3" role="figure" aria-label={`${label}: ${value} ${unit}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-[rgba(0,230,118,0.1)] text-[var(--accent-success)]" : "bg-[rgba(255,82,82,0.1)] text-[var(--accent-danger)]"}`}>
            {trend >= 0 ? "+" : ""}{trend.toFixed(0)}%
          </span>
        )}
      </div>
      <div>
        <div className="flex items-end gap-1">
          <span className="font-display text-3xl font-bold" style={{ color }}>{animatedValue}</span>
          <span className="text-sm text-[var(--text-muted)] mb-1">{unit}</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  stats: UserStatsResponse;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const avgScore = stats.subject_stats.length > 0
    ? stats.subject_stats.reduce((acc, s) => acc + ((s.grammar_score ?? 0) + (s.pronunciation_score ?? 0)) / 2, 0) / stats.subject_stats.length
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon="⏱" label="Total Study Hours" value={Math.round(stats.total_hours)} unit="hrs" trend={stats.trend.hours_change_pct} color="var(--accent-primary)" />
      <StatCard icon="📚" label="Sessions Completed" value={stats.total_sessions} unit="sessions" trend={stats.trend.sessions_change_pct} color="var(--accent-secondary)" />
      <StatCard icon="🎯" label="Avg. Accuracy" value={Math.round(avgScore)} unit="%" trend={stats.trend.score_change_pct} color="var(--accent-success)" />
      <StatCard icon="🔥" label="Day Streak" value={stats.current_streak} unit="days" color="var(--accent-warning)" />
    </div>
  );
}
