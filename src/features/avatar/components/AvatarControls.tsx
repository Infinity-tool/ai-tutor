"use client";

import React from "react";
import { AvatarState } from "../types/avatar.types";

interface AvatarControlsProps {
  state: AvatarState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function AvatarControls({
  state,
  onConnect,
  onDisconnect,
}: AvatarControlsProps) {
  const isConnected =
    state.status === "connected" || state.status === "speaking";
  const isConnecting = state.status === "connecting";

  return (
    <div className="flex items-center gap-2 mt-3">
      {/* Status indicator */}
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background:
              state.status === "connected"
                ? "var(--accent-success)"
                : state.status === "speaking"
                ? "var(--accent-secondary)"
                : state.status === "connecting"
                ? "var(--accent-warning)"
                : state.status === "error"
                ? "var(--accent-danger)"
                : "var(--text-muted)",
            boxShadow:
              state.status === "speaking"
                ? "0 0 8px var(--accent-secondary)"
                : "none",
            animation:
              state.status === "speaking" ? "pulse 1s ease-in-out infinite" : "none",
          }}
        />
        <span className="text-xs text-[var(--text-muted)] capitalize">
          {state.status === "idle"
            ? "Avatar offline"
            : state.status === "connecting"
            ? "Connecting…"
            : state.status === "connected"
            ? "Avatar ready"
            : state.status === "speaking"
            ? "Speaking…"
            : state.status === "error"
            ? "Connection error"
            : "Disconnected"}
        </span>
      </div>

      <div className="flex-1" />

      {/* Action button */}
      {!isConnected && !isConnecting && (
        <button
          onClick={onConnect}
          className="text-xs px-3 py-1 rounded-lg bg-[rgba(108,99,255,0.15)] text-[var(--accent-primary)] border border-[rgba(108,99,255,0.3)] hover:bg-[rgba(108,99,255,0.25)] transition-colors"
        >
          Connect
        </button>
      )}
      {isConnecting && (
        <span className="text-xs text-[var(--text-muted)]">Please wait…</span>
      )}
      {isConnected && (
        <button
          onClick={onDisconnect}
          className="text-xs px-3 py-1 rounded-lg bg-[rgba(255,82,82,0.1)] text-[var(--accent-danger)] border border-[rgba(255,82,82,0.3)] hover:bg-[rgba(255,82,82,0.2)] transition-colors"
        >
          Disconnect
        </button>
      )}

      {/* Error message */}
      {state.error && (
        <span className="text-xs text-[var(--accent-danger)] truncate max-w-[140px]">
          {state.error}
        </span>
      )}
    </div>
  );
}
