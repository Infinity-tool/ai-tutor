"use client";

import React, { useEffect, useRef } from "react";

const FORMULAS = ["∫ f(x)dx", "E=mc²", "a²+b²=c²", "lim x→∞", "∑n=1", "f(x)=x²"];
const LETTERS = ["A", "B", "C", "X", "Y", "Z"];

interface ParallaxBackgroundProps {
  className?: string;
}

export function ParallaxBackground({ className = "" }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      container.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "1");
        el.style.transform = `translate(${x * speed * 12}px, ${y * speed * 12}px)`;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
    >
      {/* Cosmic gradient orbs */}
      <div
        className="absolute top-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[140px]"
        style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }}
        data-parallax="0.3"
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
        style={{ background: "radial-gradient(circle, #00FF66 0%, transparent 70%)" }}
        data-parallax="0.5"
      />
      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[100px]"
        style={{ background: "radial-gradient(circle, #FF5A00 0%, transparent 70%)" }}
        data-parallax="0.2"
      />

      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute w-0.5 h-0.5 rounded-full bg-white"
          style={{
            left: `${(i * 17 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            opacity: 0.1 + (i % 5) * 0.1,
            animation: `star-twinkle ${2 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
          data-parallax={`${0.1 + (i % 3) * 0.15}`}
        />
      ))}

      {/* Floating letters */}
      {LETTERS.map((letter, i) => (
        <span
          key={`letter-${letter}`}
          className="absolute font-display font-bold select-none"
          style={{
            left: `${10 + i * 14}%`,
            top: `${15 + (i % 3) * 25}%`,
            fontSize: `${28 + (i % 3) * 12}px`,
            color: i % 2 === 0 ? "rgba(0,229,255,0.12)" : "rgba(0,255,102,0.12)",
            animation: `letter-float ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
          data-parallax={`${0.8 + i * 0.2}`}
        >
          {letter}
        </span>
      ))}

      {/* Floating formulas */}
      {FORMULAS.map((formula, i) => (
        <span
          key={`formula-${i}`}
          className="absolute font-mono text-xs select-none"
          style={{
            right: `${5 + (i % 4) * 20}%`,
            top: `${20 + i * 12}%`,
            color: "rgba(0,229,255,0.1)",
            animation: `letter-float ${6 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
          data-parallax={`${1 + i * 0.15}`}
        >
          {formula}
        </span>
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
