"use client";

import { useEffect, useRef } from "react";

interface UseAvatarStreamOptions {
  stream: MediaStream | null;
}

/**
 * useAvatarStream
 * Attaches a MediaStream to a <video> element ref.
 * Returns videoRef to attach to your <video> element.
 */
export function useAvatarStream({ stream }: UseAvatarStreamOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch((err) => {
        // Autoplay may be blocked — user gesture required
        console.warn("[useAvatarStream] Autoplay blocked:", err.message);
      });
    } else {
      video.srcObject = null;
    }
  }, [stream]);

  return { videoRef };
}
