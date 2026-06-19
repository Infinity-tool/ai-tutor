"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({
  to,
  duration = 1500,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  style,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observerRef.current.observe(containerRef.current);
    return () => observerRef.current?.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    startRef.current = null;

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else setValue(to);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, to, duration, decimals]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span ref={containerRef} className={className} style={style}>
      {prefix}{display}{suffix}
    </span>
  );
}
