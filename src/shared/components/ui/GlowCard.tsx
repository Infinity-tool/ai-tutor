"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

type GlowColor = "cyan" | "orange" | "purple" | "green" | "blue" | "none";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: GlowColor;
  tilt?: boolean;
  leftBorder?: boolean;
}

const GLOW_STYLES: Record<GlowColor, { border: string; shadow: string; bg: string }> = {
  cyan:   { border: "rgba(0,212,170,0.4)",   shadow: "0 0 24px rgba(0,212,170,0.25)",   bg: "rgba(0,212,170,0.04)"   },
  orange: { border: "rgba(255,107,53,0.4)",   shadow: "0 0 24px rgba(255,107,53,0.25)",  bg: "rgba(255,107,53,0.04)"  },
  purple: { border: "rgba(139,92,246,0.4)",   shadow: "0 0 24px rgba(139,92,246,0.25)",  bg: "rgba(139,92,246,0.04)"  },
  green:  { border: "rgba(16,185,129,0.4)",   shadow: "0 0 24px rgba(16,185,129,0.25)",  bg: "rgba(16,185,129,0.04)"  },
  blue:   { border: "rgba(59,130,246,0.4)",   shadow: "0 0 24px rgba(59,130,246,0.25)",  bg: "rgba(59,130,246,0.04)"  },
  none:   { border: "rgba(255,255,255,0.10)", shadow: "0 4px 24px rgba(0,0,0,0.4)",      bg: "rgba(255,255,255,0.05)" },
};

export function GlowCard({
  className,
  glow = "none",
  tilt = false,
  leftBorder = false,
  children,
  style,
  ...props
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`);
  };

  const handleMouseLeave = () => setTransform("");

  const g = GLOW_STYLES[glow];

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl backdrop-blur-xl transition-all duration-200", className)}
      style={{
        background: g.bg,
        border: `1px solid ${g.border}`,
        boxShadow: g.shadow,
        borderLeft: leftBorder ? `3px solid ${g.border.replace("0.4", "0.9")}` : undefined,
        transform: transform || undefined,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}
