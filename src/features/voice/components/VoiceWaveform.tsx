"use client";

import React, { useEffect, useRef } from "react";

interface VoiceWaveformProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  color?: string;
  height?: number;
  width?: number;
}

/**
 * VoiceWaveform — Real-time audio waveform using Canvas + AnalyserNode.
 * Can be reused for both recording (mic) and playback visualization.
 */
export function VoiceWaveform({
  analyser,
  isActive,
  color = "#6C63FF",
  height = 60,
  width = 280,
}: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || !isActive) {
      // Clear canvas when not active
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw flat line
        ctx.beginPath();
        ctx.strokeStyle = `${color}40`;
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
      return;
    }

    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-hidden="true"
      style={{
        borderRadius: "8px",
        background: `${color}08`,
        opacity: isActive ? 1 : 0.4,
        transition: "opacity 0.3s",
      }}
    />
  );
}
