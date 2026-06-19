"use client";

import React from "react";

export function AvatarLoader() {
  return (
    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-glass)] flex flex-col items-center justify-center gap-4">
      {/* Skeleton shimmer */}
      <div className="absolute inset-0 skeleton" />

      {/* Icon */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-[rgba(108,99,255,0.15)] border border-[rgba(108,99,255,0.3)] flex items-center justify-center">
          <span className="text-2xl animate-pulse">🤖</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <p className="text-[var(--text-muted)] text-xs">Connecting avatar…</p>
      </div>
    </div>
  );
}
