"use client";

import React from "react";
import { useStatistics } from "@/features/statistics/hooks/useStatistics";
import { StatsOverview } from "@/features/statistics/components/Dashboard/StatsOverview";
import { HeatmapChart } from "@/features/statistics/components/Charts/HeatmapChart";
import { ProgressChart } from "@/features/statistics/components/Charts/ProgressChart";
import { SubjectBreakdown } from "@/features/statistics/components/Dashboard/SubjectBreakdown";
import { StreakTracker } from "@/features/statistics/components/Dashboard/StreakTracker";
import { LoadingSpinner } from "@/shared/components/feedback/LoadingSpinner";

export default function ProgressPage() {
  const { data: stats, isLoading, error } = useStatistics();

  if (isLoading) return <LoadingSpinner className="py-20" />;
  if (error || !stats)
    return (
      <div className="p-4 rounded-xl bg-[rgba(255,82,82,0.08)] border border-[rgba(255,82,82,0.3)] text-[var(--accent-danger)] text-sm max-w-md">
        Failed to load progress data.
      </div>
    );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Your Progress</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Track your learning journey</p>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart data={stats.weekly_data} />
        </div>
        <StreakTracker stats={stats} />
      </div>

      <HeatmapChart activityLog={stats.activity_log} />

      {stats.subject_stats.length > 0 && (
        <SubjectBreakdown subjects={stats.subject_stats} />
      )}

      {/* PDF Report */}
      <div className="glass-card-static p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Download Progress Report</p>
          <p className="text-sm text-[var(--text-secondary)]">Get a detailed PDF summary of your learning</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          📄 Download PDF
        </button>
      </div>
    </div>
  );
}
