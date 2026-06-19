"use client";

import React from "react";
import Link from "next/link";
import { Bot } from "lucide-react";

interface HolographicAvatarProps {
  userName?: string;
  isSpeaking?: boolean;
}

export function HolographicAvatar({ userName = "Alex", isSpeaking = false }: HolographicAvatarProps) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[280px]">
      {/* Outer orbital rings */}
      <div className="absolute w-[260px] h-[260px] rounded-full border border-[rgba(0,229,255,0.15)] animate-[spin_20s_linear_infinite]" />
      <div className="absolute w-[220px] h-[220px] rounded-full border border-[rgba(0,255,102,0.1)] animate-[spin_15s_linear_infinite_reverse]" />

      {/* Main holographic orb */}
      <div className="relative animate-float">
        <div
          className="relative w-44 h-44 rounded-full animate-orb-glow overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(0,229,255,0.25) 0%, rgba(0,255,102,0.1) 40%, rgba(8,7,16,0.8) 70%)",
            border: "1px solid rgba(0,229,255,0.4)",
          }}
        >
          {/* Inner glow layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,229,255,0.2)] via-transparent to-[rgba(0,255,102,0.15)]" />
          <div className="absolute inset-4 rounded-full border border-[rgba(255,255,255,0.08)]" />

          {/* AI Avatar silhouette */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-1"
              style={{
                background: "linear-gradient(135deg, rgba(0,229,255,0.3), rgba(0,255,102,0.2))",
                border: "1px solid rgba(0,229,255,0.5)",
                boxShadow: "0 0 30px rgba(0,229,255,0.4)",
              }}
            >
              <Bot size={36} className="text-[#00E5FF]" />
            </div>
            <span className="text-xs font-display font-semibold text-[#00E5FF] tracking-wider">
              {userName}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">AI Tutor</span>
          </div>

          {/* Scan line effect */}
          <div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-40"
            style={{ animation: "scan 3s ease-in-out infinite", top: "50%" }}
          />
        </div>

        {/* Audio waveform rings */}
        {(isSpeaking) && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  background: i % 2 === 0 ? "#00E5FF" : "#00FF66",
                  animation: `waveform ${0.4 + (i % 5) * 0.1}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                  height: "100%",
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <Link
        href="/tutor"
        className="mt-10 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,255,102,0.1))",
          border: "1px solid rgba(0,229,255,0.4)",
          color: "#00E5FF",
          boxShadow: "0 0 20px rgba(0,229,255,0.2)",
        }}
      >
        Suhbatni boshlash →
      </Link>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 20%; opacity: 0; }
          50% { top: 80%; opacity: 0.6; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
