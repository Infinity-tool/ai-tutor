"use client";

import React from "react";
import dynamic from "next/dynamic";
import { GraphData } from "../types/math.types";

const GraphPlotterInner = dynamic(
  () => import("./GraphPlotterInner").then((m) => m.GraphPlotterInner),
  { ssr: false }
);

interface GraphPlotterProps {
  data: GraphData;
}

export function GraphPlotter({ data }: GraphPlotterProps) {
  return (
    <div className="glass-card-static p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">📈</span>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Grafik:{" "}
          <code className="text-[var(--accent-cyan)] font-mono text-xs">
            {data.expression}
          </code>
        </p>
      </div>
      <div className="h-64">
        <GraphPlotterInner data={data} />
      </div>
    </div>
  );
}
