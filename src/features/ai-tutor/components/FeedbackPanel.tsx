"use client";

import React from "react";
import { FeedbackData } from "../types/tutor.types";

interface FeedbackPanelProps {
  feedback: FeedbackData;
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span style={{ color }} className="font-bold">{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--border-glass)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const hasErrors = feedback.errors.length > 0;
  const hasSuggestions = feedback.suggestions.length > 0;

  return (
    <div className="mt-2 p-3 rounded-xl bg-[rgba(108,99,255,0.06)] border border-[rgba(108,99,255,0.15)] space-y-3 animate-fade-in">
      {/* Score bars */}
      <div className="grid grid-cols-2 gap-3">
        <ScoreBar
          label="Pronunciation"
          score={feedback.pronunciation_score}
          color={feedback.pronunciation_score >= 80 ? "var(--accent-success)" : feedback.pronunciation_score >= 60 ? "var(--accent-warning)" : "var(--accent-danger)"}
        />
        <ScoreBar
          label="Grammar"
          score={feedback.grammar_score}
          color={feedback.grammar_score >= 80 ? "var(--accent-success)" : feedback.grammar_score >= 60 ? "var(--accent-warning)" : "var(--accent-danger)"}
        />
      </div>

      {/* Errors */}
      {hasErrors && (
        <div>
          <p className="text-[10px] font-semibold text-[var(--accent-warning)] uppercase tracking-wide mb-1">
            Corrections
          </p>
          <ul className="space-y-0.5">
            {feedback.errors.map((e, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                <span className="text-[var(--accent-danger)] mt-0.5" aria-hidden="true">✗</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {hasSuggestions && (
        <div>
          <p className="text-[10px] font-semibold text-[var(--accent-success)] uppercase tracking-wide mb-1">
            Better phrasing
          </p>
          <ul className="space-y-0.5">
            {feedback.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                <span className="text-[var(--accent-success)] mt-0.5" aria-hidden="true">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
