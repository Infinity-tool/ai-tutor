"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface VoiceRecorderProps {
  /** Called with the recorded audio Blob when recording stops */
  onRecordingComplete: (audioBlob: Blob) => void;
  /** Whether the recorder is disabled (e.g. while transcribing) */
  disabled?: boolean;
}

type RecorderState = "idle" | "recording" | "processing";

/**
 * VoiceRecorder
 *
 * Large circular button with animated ring while recording.
 * Real-time waveform visualization using Web Audio API AnalyserNode.
 * Displays recording duration.
 */
export function VoiceRecorder({
  onRecordingComplete,
  disabled = false,
}: VoiceRecorderProps) {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [duration, setDuration] = useState(0); // seconds

  // Refs for Web Audio and MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Canvas ref for waveform
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── Waveform drawing ───────────────────────────────────────────────────────

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "rgba(30, 30, 46, 0.0)";
    ctx.fillRect(0, 0, width, height);

    // Waveform line
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#89b4fa";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#89b4fa";
    ctx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const stopWaveform = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // ─── Start recording ────────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    if (disabled || recorderState !== "idle") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });

      streamRef.current = stream;

      // Set up Web Audio API for waveform
      const AudioContextClass =
        window.AudioContext ?? (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      // Note: do NOT connect analyser to destination — we don't want to hear ourselves

      // Choose best supported MIME type
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        setRecorderState("idle");
        onRecordingComplete(blob);
      };

      mediaRecorder.start(100); // collect data every 100ms
      setRecorderState("recording");
      setDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Start waveform animation
      drawWaveform();
    } catch (err) {
      console.error("[VoiceRecorder] Failed to start:", err);
      setRecorderState("idle");
    }
  }, [disabled, recorderState, drawWaveform, onRecordingComplete]);

  // ─── Stop recording ─────────────────────────────────────────────────────────

  const stopRecording = useCallback(() => {
    if (recorderState !== "recording") return;

    setRecorderState("processing");

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop waveform
    stopWaveform();

    // Stop MediaRecorder
    mediaRecorderRef.current?.stop();

    // Stop all tracks
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Close AudioContext
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    setDuration(0);
  }, [recorderState, stopWaveform]);

  // ─── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopWaveform();
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, [stopWaveform]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isRecording = recorderState === "recording";
  const isProcessing = recorderState === "processing";

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing && !disabled) {
      startRecording();
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        userSelect: "none",
      }}
    >
      {/* Waveform canvas — shown while recording */}
      <canvas
        ref={canvasRef}
        width={280}
        height={60}
        aria-hidden="true"
        style={{
          borderRadius: "0.5rem",
          opacity: isRecording ? 1 : 0,
          transition: "opacity 0.3s",
          background: "rgba(137,180,250,0.05)",
        }}
      />

      {/* Outer animated ring + button */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pulsing ring animation when recording */}
        {isRecording && (
          <>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                border: "3px solid rgba(243,139,168,0.6)",
                animation: "pulse-ring 1.2s ease-out infinite",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "112px",
                height: "112px",
                borderRadius: "50%",
                border: "2px solid rgba(243,139,168,0.3)",
                animation: "pulse-ring 1.2s ease-out 0.4s infinite",
              }}
            />
          </>
        )}

        {/* Main button */}
        <button
          onClick={handleClick}
          disabled={disabled || isProcessing}
          aria-label={isRecording ? "Yozishni to'xtatish" : "Ovozli xabar yuborish"}
          aria-pressed={isRecording}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "none",
            cursor: disabled || isProcessing ? "not-allowed" : "pointer",
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s, background 0.2s",
            transform: isRecording ? "scale(1.05)" : "scale(1)",
            background: isRecording
              ? "linear-gradient(135deg, #f38ba8, #e64553)"
              : disabled || isProcessing
              ? "rgba(137,180,250,0.2)"
              : "linear-gradient(135deg, #89b4fa, #74c7ec)",
            boxShadow: isRecording
              ? "0 0 24px rgba(243,139,168,0.5)"
              : "0 4px 20px rgba(0,0,0,0.3)",
            color: "#1e1e2e",
          }}
          onMouseDown={(e) => {
            if (!disabled && !isProcessing) {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
            }
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = isRecording
              ? "scale(1.05)"
              : "scale(1)";
          }}
        >
          {isProcessing ? "⏳" : isRecording ? "⏹" : "🎙️"}
        </button>
      </div>

      {/* Duration + status text */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: isRecording
            ? "var(--error, #f38ba8)"
            : "var(--text-muted, rgba(205,214,244,0.6))",
          minHeight: "1.5rem",
          letterSpacing: "0.05em",
        }}
      >
        {isRecording
          ? `● Yozilmoqda — ${formatDuration(duration)}`
          : isProcessing
          ? "Qayta ishlanmoqda..."
          : "Bosib turing va gapiring"}
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          80% { opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the best supported MIME type for MediaRecorder in the current browser.
 */
function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return ""; // browser default
}
