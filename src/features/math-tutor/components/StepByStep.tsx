"use client";

import React, { useState, useEffect } from "react";
import { MathStep } from "../types/math.types";
import { MathRenderer } from "./MathRenderer";

interface StepByStepProps {
  steps: MathStep[];
  finalAnswer: string;
  latexAnswer: string;
}

export function StepByStep({ steps, finalAnswer, latexAnswer }: StepByStepProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  // Animate steps appearing one by one
  useEffect(() => {
    setVisibleCount(0);
    if (steps.length === 0) return;

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= steps.length + 1) clearInterval(timer); // +1 for final answer
    }, 350);

    return () => clearInterval(timer);
  }, [steps]);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.step_number}
          className="flex gap-4 animate-fade-in"
          style={{
            opacity: index < visibleCount ? 1 : 0,
            transform: index < visibleCount ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Step number badge */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(108,99,255,0.2)] border border-[rgba(108,99,255,0.4)] flex items-center justify-center text-xs font-bold text-[var(--accent-primary)]">
            {step.step_number}
          </div>

          {/* Step content */}
          <div className="flex-1 glass-card-static p-4 space-y-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {step.description}
            </p>

            {step.latex && (
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-glass)] overflow-x-auto">
                <MathRenderer latex={step.latex} display className="block text-center" />
              </div>
            )}

            <p className="text-sm text-[var(--text-secondary)]">{step.explanation}</p>
          </div>
        </div>
      ))}

      {/* Final Answer */}
      {visibleCount > steps.length && (
        <div
          className="flex gap-4 animate-fade-in"
          style={{ transition: "opacity 0.3s ease" }}
        >
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(0,230,118,0.2)] border border-[rgba(0,230,118,0.4)] flex items-center justify-center text-xs">
            ✓
          </div>
          <div className="flex-1 rounded-2xl p-4 bg-[rgba(0,230,118,0.06)] border border-[rgba(0,230,118,0.2)] space-y-2">
            <p className="text-sm font-bold text-[var(--accent-success)]">Final Answer</p>
            {latexAnswer && (
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-glass)] overflow-x-auto">
                <MathRenderer latex={latexAnswer} display className="block text-center" />
              </div>
            )}
            <p className="text-sm text-[var(--text-primary)]">{finalAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
