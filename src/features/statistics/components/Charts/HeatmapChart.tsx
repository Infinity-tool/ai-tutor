"use client";

import React, { useMemo } from "react";

interface HeatmapChartProps {
  activityLog: Record<string, boolean>;
}

function getIntensity(active: boolean): string {
  if (!active) return "#1a1a2e";
  return "#6C63FF";
}

export function HeatmapChart({ activityLog }: HeatmapChartProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const result: Array<Array<{ date: string; active: boolean; label: string }>> = [];
    let week: typeof result[0] = [];

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

      week.push({ date: key, active: !!activityLog[key], label });

      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    }
    if (week.length > 0) result.push(week);
    return result;
  }, [activityLog]);

  const months = useMemo(() => {
    const labels: Array<{ label: string; colIndex: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const month = new Date(week[0].date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: new Date(week[0].date).toLocaleDateString("en", { month: "short" }), colIndex: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="glass-card-static p-5 space-y-3 overflow-x-auto">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm">Activity Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>Less</span>
          {["#1a1a2e", "#3d3580", "#5449c2", "#6C63FF"].map((c) => (
            <span key={c} className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: "28px" }}>
          {months.map(({ label, colIndex }) => (
            <span
              key={`${label}-${colIndex}`}
              className="text-[9px] text-[var(--text-muted)] absolute"
              style={{ left: `${28 + colIndex * 14}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-0.5 mt-4">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i} className="text-[9px] text-[var(--text-muted)] h-3 leading-3 w-6 text-right">{d}</span>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="w-3 h-3 rounded-sm transition-all hover:opacity-80 cursor-default"
                  style={{ background: getIntensity(day.active) }}
                  title={`${day.label}: ${day.active ? "Active" : "No activity"}`}
                  role="img"
                  aria-label={`${day.label}: ${day.active ? "practiced" : "no practice"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
