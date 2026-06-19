"use client";

import React from "react";
import Link from "next/link";

interface HologramRingProps {
  name?: string;
  isSpeaking?: boolean;
  status?: "ready" | "speaking" | "offline";
}

export function HologramRing({ name = "Alex", isSpeaking = false, status = "ready" }: HologramRingProps) {
  const statusColor = status === "ready" ? "#10b981" : status === "speaking" ? "#00d4aa" : "#475569";
  const statusLabel = status === "ready" ? "Tayyor" : status === "speaking" ? "Gapirmoqda..." : "Offline";

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[280px] select-none">

      {/* Ring 1 — outer slow */}
      <div
        className="absolute w-[220px] h-[220px] rounded-full animate-spin-slow pointer-events-none"
        style={{ border: "1px solid rgba(0,212,170,0.2)", borderTopColor: "rgba(0,212,170,0.7)" }}
      />
      {/* Ring 2 — middle reverse */}
      <div
        className="absolute w-[180px] h-[180px] rounded-full animate-spin-reverse pointer-events-none"
        style={{ border: "1px solid rgba(139,92,246,0.15)", borderBottomColor: "rgba(139,92,246,0.6)" }}
      />
      {/* Ring 3 — inner accent */}
      <div
        className="absolute w-[148px] h-[148px] rounded-full pointer-events-none"
        style={{
          border: "1px dashed rgba(0,212,170,0.15)",
          animation: "spin-slow 20s linear infinite",
        }}
      />

      {/* Core orb */}
      <div
        className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(0,212,170,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(10,10,15,0.9) 100%)",
          border: "1px solid rgba(0,212,170,0.4)",
          boxShadow: isSpeaking
            ? "0 0 40px rgba(0,212,170,0.6), 0 0 80px rgba(0,212,170,0.2)"
            : "0 0 24px rgba(0,212,170,0.3)",
          animation: isSpeaking ? "glow-pulse 1.2s ease-in-out infinite" : undefined,
        }}
      >
        {/* AI face silhouette */}
        <div className="text-4xl mb-0.5">🤖</div>

        {/* Scan line */}
        <div
          className="absolute inset-x-2 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.6), transparent)",
            animation: "scan 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Name + status */}
      <div className="mt-5 text-center space-y-1">
        <p className="font-bold text-[var(--text-primary)] tracking-wide">{name}</p>
        <p className="text-xs text-[var(--text-muted)]">AI O&apos;qituvchi</p>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
              animation: status === "speaking" ? "glow-pulse 1s ease-in-out infinite" : undefined,
            }}
          />
          <span className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>

      {/* CTA button */}
      <Link
        href="/tutor"
        className="mt-5 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(139,92,246,0.1))",
          border: "1px solid rgba(0,212,170,0.35)",
          color: "#00d4aa",
          boxShadow: "0 0 16px rgba(0,212,170,0.15)",
        }}
      >
        <span>▶</span> Suhbatni boshlash
      </Link>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 20%; opacity: 0; }
          50% { top: 78%; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
