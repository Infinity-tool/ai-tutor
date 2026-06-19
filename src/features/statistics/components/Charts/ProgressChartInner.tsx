"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { WeeklyPoint } from "../../types/statistics.types";

const tooltipStyle = {
  contentStyle: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-glass)",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "12px",
  },
  itemStyle: { color: "var(--text-secondary)" },
};

interface ProgressChartInnerProps {
  data: WeeklyPoint[];
}

export function ProgressChartInner({ data }: ProgressChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="grammarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pronGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF66" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00FF66" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
        <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: "12px", color: "var(--text-secondary)" }} />
        <Line type="monotone" dataKey="grammar" name="Grammar %" stroke="#00E5FF" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="pronunciation" name="Pronunciation %" stroke="#00FF66" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
