"use client";

import React, { useState } from "react";
import { useMathSession } from "../hooks/useMathSession";
import { StepByStep } from "./StepByStep";
import { GraphPlotter } from "./GraphPlotter";
import { LoadingSpinner } from "@/shared/components/feedback/LoadingSpinner";
import { Lesson } from "@/shared/types/curriculum.types";

interface MathSolverProps {
  lesson?: Lesson;
}

export function MathSolver({ lesson }: MathSolverProps) {
  const [input, setInput] = useState("");
  const { state, solve, explainDifferently, reset } = useMathSession(lesson);

  const handleSolve = async () => {
    const trimmed = input.trim();
    if (!trimmed || state.isLoading) return;
    await solve(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSolve();
    }
  };

  const examples = [
    "2x² + 5x - 3 = 0",
    "∫(x² + 2x) dx",
    "Derivative of f(x) = x³ - 4x",
    "sin(30°) + cos(60°)",
  ];

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="glass-card-static p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
          📐 Math Problem Solver
        </h2>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your math problem… e.g. 2x² + 5x - 3 = 0"
          rows={4}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
          aria-label="Math problem input"
        />

        {/* Examples */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[var(--text-muted)]">Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              className="text-xs px-2.5 py-1 rounded-lg bg-[rgba(108,99,255,0.1)] text-[var(--accent-primary)] border border-[rgba(108,99,255,0.2)] hover:bg-[rgba(108,99,255,0.2)] transition-colors font-mono"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSolve}
            disabled={state.isLoading || !input.trim()}
            className="px-6 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all"
          >
            {state.isLoading ? "Solving…" : "Solve"}
          </button>

          <kbd className="text-xs text-[var(--text-muted)] hidden sm:block">
            ⌘ + Enter to solve
          </kbd>

          {state.solution && (
            <>
              <button
                onClick={explainDifferently}
                disabled={state.isLoading}
                className="text-sm px-4 py-2.5 rounded-xl border border-[var(--border-glass)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors disabled:opacity-40"
              >
                Explain differently
              </button>
              <button
                onClick={reset}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading */}
      {state.isLoading && (
        <div className="flex items-center gap-3 p-6 glass-card-static">
          <LoadingSpinner size="md" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Solving your problem…</p>
            <p className="text-xs text-[var(--text-muted)]">Generating step-by-step explanation</p>
          </div>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div role="alert" className="p-4 rounded-xl bg-[rgba(255,82,82,0.08)] border border-[rgba(255,82,82,0.3)] text-[var(--accent-danger)] text-sm">
          ⚠️ {state.error}
        </div>
      )}

      {/* Solution */}
      {state.solution && !state.isLoading && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">
              Solution
            </h3>
            <StepByStep
              steps={state.solution.steps}
              finalAnswer={state.solution.final_answer}
              latexAnswer={state.solution.latex_answer}
            />
          </div>

          {state.solution.graph_data && (
            <GraphPlotter data={state.solution.graph_data} />
          )}
        </div>
      )}
    </div>
  );
}
