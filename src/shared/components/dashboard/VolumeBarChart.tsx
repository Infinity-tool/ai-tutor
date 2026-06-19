"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BarData {
  label: string;
  value: number;
  color?: "cyan" | "green";
}

interface VolumeBarChartProps {
  data: BarData[];
  title?: string;
}

export function VolumeBarChart({ data, title = "Haftalik Statistika" }: VolumeBarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">{title}</h3>

      <div className="flex-1 flex items-end gap-2 sm:gap-3 min-h-[140px] relative">
        {data.map((bar, i) => {
          const heightPct = (bar.value / max) * 100;
          const color = bar.color === "green" ? "#00FF66" : "#00E5FF";
          const isHovered = hovered === i;

          return (
            <div
              key={bar.label}
              className="flex-1 flex flex-col items-center gap-2 relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold"
                    style={{
                      background: "rgba(8,7,16,0.95)",
                      border: `1px solid ${color}55`,
                      color,
                      boxShadow: `0 0 16px ${color}33`,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {bar.value}%
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="w-full rounded-t-lg relative cursor-pointer"
                style={{
                  height: `${Math.max(heightPct, 8)}%`,
                  minHeight: "12px",
                  transformOrigin: "bottom",
                }}
                animate={{
                  boxShadow: isHovered
                    ? `0 0 24px ${color}66, inset 0 0 12px ${color}33`
                    : `0 0 8px ${color}22`,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* 3D cube effect */}
                <div
                  className="absolute inset-0 rounded-t-lg"
                  style={{
                    background: `linear-gradient(180deg, ${color}cc 0%, ${color}66 60%, ${color}33 100%)`,
                    border: `1px solid ${color}88`,
                    borderBottom: "none",
                  }}
                />
                <div
                  className="absolute -top-1 left-1 right-1 h-1 rounded-t-sm opacity-60"
                  style={{ background: color }}
                />
              </motion.div>

              <span className="text-[10px] text-[var(--text-muted)]">{bar.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
