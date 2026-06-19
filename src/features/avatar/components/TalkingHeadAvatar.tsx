"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

// Dynamic import for TalkingHead.js to avoid SSR issues
declare global {
  interface Window {
    TalkingHead: any;
    THREE: any;
  }
}

interface TalkingHeadAvatarProps {
  modelUrl?: string;
  onReady?: () => void;
  onSpeakEnd?: () => void;
  onSpeakStart?: () => void;
}

export interface TalkingHeadAvatarRef {
  speak: (text: string) => void;
  speakAudio: (arrayBuffer: ArrayBuffer) => void;
  stop: () => void;
}

/**
 * TalkingHeadAvatar — 3D avatar with lip-sync using TalkingHead.js
 */
export const TalkingHeadAvatar = forwardRef<TalkingHeadAvatarRef, TalkingHeadAvatarProps>(
  ({ modelUrl = "https://models.readyplayer.me/64bfa15d03050458e50c0d92.glb", onReady, onSpeakEnd, onSpeakStart }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      speak: (text: string) => {
        if (headRef.current) {
          try {
            onSpeakStart?.();
            headRef.current.speakText(text, {
              onEnded: () => onSpeakEnd?.(),
            });
          } catch (e) {
            console.error("Failed to speak text:", e);
          }
        }
      },
      speakAudio: (arrayBuffer: ArrayBuffer) => {
        if (headRef.current) {
          try {
            onSpeakStart?.();
            headRef.current.speakAudio(arrayBuffer, {
              onEnded: () => onSpeakEnd?.(),
            });
          } catch (e) {
            console.error("Failed to speak audio:", e);
          }
        }
      },
      stop: () => {
        if (headRef.current) {
          try {
            headRef.current.stop();
            onSpeakEnd?.();
          } catch (e) {
            console.error("Failed to stop speaking:", e);
          }
        }
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      let isMounted = true;
      let head: any = null;

      const loadScript = async () => {
        // Load Three.js first
        if (!window.THREE) {
          const threeScript = document.createElement("script");
          threeScript.src = "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js";
          threeScript.async = true;
          await new Promise((resolve) => (threeScript.onload = resolve));
          document.head.appendChild(threeScript);
        }

        // Load TalkingHead.js
        const thScript = document.createElement("script");
        thScript.src = "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@main/modules/talkinghead.min.js";
        thScript.async = true;
        await new Promise((resolve) => (thScript.onload = resolve));
        document.head.appendChild(thScript);

        // Wait for TalkingHead to be available
        await new Promise<void>((resolve) => {
          const check = () => {
            if (window.TalkingHead) resolve();
            else setTimeout(check, 100);
          };
          check();
        });

        if (!isMounted) return;

        try {
          const node = containerRef.current;
          if (!node) return;

          head = new window.TalkingHead(node, {
            cameraView: "upper",
            avatarMood: "happy",
            avatarIdleHeadMove: 0.5,
            avatarIdleEyeContact: 0.8,
            lightAmbientIntensity: 0.5,
            lightDirectIntensity: 0.8,
          });

          // Load a test ReadyPlayerMe avatar
          await head.showAvatar({ url: modelUrl });

          if (isMounted) {
            headRef.current = head;
            setIsLoading(false);
            onReady?.();
          }
        } catch (error) {
          console.error("Failed to initialize TalkingHead:", error);
          if (isMounted) setError("Failed to load avatar");
        }
      };

      loadScript();

      return () => {
        isMounted = false;
        if (head) {
          try {
            head.dispose?.();
          } catch (e) {
            //
          }
        }
      };
    }, [modelUrl]);

    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-glass)]">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[var(--bg-secondary)]">
            <div className="relative">
              <div className="absolute inset-0 w-24 h-24 rounded-full animate-spin-slow" style={{ border: "1px solid rgba(108,99,255,0.25)", borderTopColor: "rgba(108,99,255,0.7)" }} />
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl"
                style={{ background: "radial-gradient(circle at 35% 35%, rgba(108,99,255,0.2), rgba(10,10,15,0.9))", border: "1px solid rgba(108,99,255,0.35)", boxShadow: "0 0 24px rgba(108,99,255,0.2)" }}>
                👤
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] animate-pulse">3D Avatar Loading...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[var(--bg-secondary)]">
            <div className="text-4xl">❌</div>
            <p className="text-sm text-[var(--accent-danger)]">{error}</p>
          </div>
        )}

        {/* The container for the 3D avatar */}
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ display: isLoading || error ? "none" : "block" }}
        />
      </div>
    );
  }
);

TalkingHeadAvatar.displayName = "TalkingHeadAvatar";