"use client";

import React, { useEffect, useRef } from "react";
import { ErrorBoundary } from "@/shared/components/feedback/ErrorBoundary";

interface MathRendererProps {
  latex: string;
  display?: boolean; // true = block, false = inline
  className?: string;
}

/**
 * MathRenderer — renders LaTeX using KaTeX.
 * Dynamically imports KaTeX to avoid SSR issues.
 */
function MathRendererInner({ latex, display = false, className }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !latex) return;

    import("katex").then((katex) => {
      try {
        katex.default.render(latex, containerRef.current!, {
          displayMode: display,
          throwOnError: false,
          errorColor: "var(--accent-danger)",
          output: "html",
        });
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.textContent = latex;
        }
      }
    });
  }, [latex, display]);

  return (
    <span
      ref={containerRef}
      className={className}
      aria-label={`Math: ${latex}`}
    />
  );
}

export function MathRenderer(props: MathRendererProps) {
  return (
    <ErrorBoundary fallback={<code className="text-[var(--accent-primary)] font-mono text-sm">{props.latex}</code>}>
      <MathRendererInner {...props} />
    </ErrorBoundary>
  );
}
