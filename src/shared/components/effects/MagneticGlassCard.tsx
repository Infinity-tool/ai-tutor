"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "green" | "orange" | "none";
  onClick?: () => void;
}

const GLOW_MAP = {
  cyan: "neon-border-cyan hover:shadow-glow-cyan",
  green: "neon-border-green hover:shadow-glow-green",
  orange: "neon-border-orange hover:shadow-glow-orange",
  none: "",
};

export function MagneticGlassCard({
  children,
  className = "",
  glowColor = "none",
  onClick,
}: MagneticGlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setTransform({
      x: deltaX * 6,
      y: deltaY * 6,
      rotateX: -deltaY * 3,
      rotateY: deltaX * 3,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 800 }}
      className={onClick ? "cursor-pointer" : ""}
    >
      <motion.div
        animate={{
          x: transform.x,
          y: transform.y,
          rotateX: transform.rotateX,
          rotateY: transform.rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`glass-card ${GLOW_MAP[glowColor]} ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
