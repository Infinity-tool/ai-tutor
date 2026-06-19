"use client";

import React, { useEffect } from "react";
import { useAvatarSession } from "../hooks/useAvatarSession";
import { useAvatarStream } from "../hooks/useAvatarStream";
import { AvatarLoader } from "./AvatarLoader";
import { AvatarControls } from "./AvatarControls";

interface AvatarStreamProps {
  /** Auto-connect when mounted */
  autoConnect?: boolean;
  /** Text to speak (changes trigger avatar to speak) */
  speakText?: string | null;
  /** Callback when connected */
  onConnected?: () => void;
  /** Callback when error */
  onError?: (error: string) => void;
}

/**
 * AvatarStream — Main avatar video component.
 * Uses WebRTC (HeyGen Streaming API) to show a live AI avatar.
 * Dynamically imported with SSR:false from parent pages.
 */
export function AvatarStream({
  autoConnect = false,
  speakText,
  onConnected,
  onError,
}: AvatarStreamProps) {
  const { state, remoteStream, createSession, speak, disconnect } =
    useAvatarSession();
  const { videoRef } = useAvatarStream({ stream: remoteStream });

  // Auto-connect
  useEffect(() => {
    if (autoConnect && state.status === "idle") {
      createSession();
    }
  }, [autoConnect]); // eslint-disable-line react-hooks/exhaustive-deps

  // Speak when text changes
  useEffect(() => {
    if (speakText && state.status === "connected") {
      speak(speakText);
    }
  }, [speakText]); // eslint-disable-line react-hooks/exhaustive-deps

  // Callbacks
  useEffect(() => {
    if (state.status === "connected") onConnected?.();
    if (state.status === "error" && state.error) onError?.(state.error);
  }, [state.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSpeaking = state.status === "speaking";
  const isConnected = state.status === "connected" || isSpeaking;
  const isLoading = state.status === "connecting";

  return (
    <div className="flex flex-col w-full">
      {/* Video container */}
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--bg-secondary)]">
        {/* Loading state */}
        {isLoading && <AvatarLoader />}

        {/* Video element — always mounted, hidden when not connected */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          className="w-full h-full object-cover"
          style={{ display: isConnected ? "block" : "none" }}
          aria-label="AI Avatar video stream"
        />

        {/* Idle / offline placeholder */}
        {!isConnected && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              {/* Rotating rings */}
              <div className="absolute inset-0 w-24 h-24 rounded-full animate-spin-slow" style={{ border: "1px solid rgba(0,212,170,0.25)", borderTopColor: "rgba(0,212,170,0.7)" }} />
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl"
                style={{ background: "radial-gradient(circle at 35% 35%, rgba(0,212,170,0.2), rgba(10,10,15,0.9))", border: "1px solid rgba(0,212,170,0.35)", boxShadow: "0 0 24px rgba(0,212,170,0.2)" }}>
                🤖
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[var(--text-primary)]">Alex</p>
              <div className="flex items-center gap-1.5 justify-center mt-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" style={{ boxShadow: "0 0 6px #10b981" }} />
                <span className="text-xs text-[#10b981] font-medium">Tayyor</span>
              </div>
            </div>
          </div>
        )}

        {/* Glowing border — pulses when speaking */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: `2px solid ${
              isSpeaking
                ? "rgba(108,99,255,0.8)"
                : isConnected
                ? "rgba(108,99,255,0.3)"
                : "transparent"
            }`,
            boxShadow: isSpeaking
              ? "0 0 32px rgba(108,99,255,0.5), inset 0 0 32px rgba(108,99,255,0.1)"
              : "none",
            animation: isSpeaking ? "avatar-glow 2s ease-in-out infinite" : "none",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        />

        {/* Speaking indicator badge */}
        {isSpeaking && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(108,99,255,0.9)] text-white text-xs font-medium">
            <span
              className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
              aria-hidden="true"
            />
            Speaking
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(8,11,20,0.8) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Controls below video */}
      <AvatarControls
        state={state}
        onConnect={createSession}
        onDisconnect={disconnect}
      />
    </div>
  );
}
