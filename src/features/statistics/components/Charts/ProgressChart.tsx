"use client";

import React from "react";
import dynamic from "next/dynamic";
import { WeeklyPoint } from "../../types/statistics.types";

const ProgressChartInner = dynamic(
  () => import("./ProgressChartInner").then((m) => m.ProgressChartInner),
  { ssr: false }
);

interface ProgressChartProps {
  data: WeeklyPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="glass-card-static p-5 space-y-4">
      <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm">
        Haftalik Progress
      </h3>
      <div className="h-64">
        <ProgressChartInner data={data} />
      </div>
    </div>
  );
}
