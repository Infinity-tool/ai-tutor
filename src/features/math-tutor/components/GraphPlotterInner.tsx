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
} from "recharts";
import { GraphData } from "../types/math.types";

interface GraphPlotterInnerProps {
  data: GraphData;
}

export function GraphPlotterInner({ data }: GraphPlotterInnerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.points} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="x"
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 10 }}
          tickCount={11}
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fill: "var(--text-muted)", fontSize: 10 }}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-glass)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            fontSize: "12px",
          }}
          formatter={(value) => [Number(value).toFixed(3), "y"]}
          labelFormatter={(label) => `x = ${label}`}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="var(--accent-cyan)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
