"use client";

import React from "react";
import { CEFRLevel } from "@/shared/types/global.types";

interface LevelBadgeProps {
  level: CEFRLevel;
  onClick?: () => void;
  interactive?: boolean;
}

const levelColors: Record<CEFRLevel, { bg: string; text: string; border: string }> = {
  A1: { bg: "rgba(0,230,118,0.1)", text: "#00E676", border: "rgba(0,230,118,0.3)" },
  A2: { bg: "rgba(0,230,118,0.15)", text: "#00E676", border: "rgba(0,230,118,0.4)" },
  B1: { bg: "rgba(0,210,255,0.1)", text: "#00D2FF", border: "rgba(0,210,255,0.3)" },
  B2: { bg: "rgba(0,210,255,0.15)", text: "#00D2FF", border: "rgba(0,210,255,0.4)" },
  C1: { bg: "rgba(108,99,255,0.15)", text: "#6C63FF", border: "rgba(108,99,255,0.4)" },
  C2: { bg: "rgba(108,99,255,0.2)", text: "#6C63FF", border: "rgba(108,99,255,0.5)" },
};

export function LevelBadge({ level, onClick, interactive }: LevelBadgeProps) {
  const colors = levelColors[level];

  return (
    <button
      onClick={onClick}
      disabled={!interactive}
      style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold tracking-wide disabled:cursor-default transition-all hover:enabled:scale-105"
      aria-label={`Current level: ${level}`}
    >
      <span aria-hidden="true">🎯</span>
      {level}
    </button>
  );
}
