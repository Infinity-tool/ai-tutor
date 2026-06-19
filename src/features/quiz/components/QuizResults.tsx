"use client";

import React from "react";
import { QuizSession } from "../types/quiz.types";
import { SUBJECT_LABELS_UZ } from "@/shared/types/global.types";
import { Trophy, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuizResultsProps {
  session: QuizSession;
  onRetry: () => void;
}

export function QuizResults({ session, onRetry }: QuizResultsProps) {
  const correct = session.results.filter((r) => r.is_correct).length;
  const total = session.questions.length;
  const score = Math.round((correct / total) * 100);
  const avgTime = Math.round(
    session.results.reduce((acc, r) => acc + r.time_taken_ms, 0) / total / 1000
  );

  const grade =
    score >= 90 ? { label: "A'lo!", color: "var(--accent-success)", emoji: "🏆" } :
    score >= 70 ? { label: "Yaxshi!", color: "var(--accent-primary)", emoji: "⭐" } :
    score >= 50 ? { label: "O'rtacha", color: "var(--accent-warning)", emoji: "💪" } :
                  { label: "Ko'proq mashq qiling", color: "var(--accent-danger)", emoji: "📚" };

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      {/* Score circle */}
      <div className="relative w-36 h-36 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-glass)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke={grade.color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 327} 327`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: grade.color }}>{score}%</span>
          <span className="text-xs text-[var(--text-muted)]">{correct}/{total} to'g'ri</span>
        </div>
      </div>

      {/* Grade */}
      <div>
        <p className="text-4xl mb-2">{grade.emoji}</p>
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">{grade.label}</h3>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {SUBJECT_LABELS_UZ[session.config.subject]} · {session.config.level} · {session.config.topic}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "To'g'ri", value: `${correct}/${total}`, color: "var(--accent-success)" },
          { label: "Ball", value: `${score}%`, color: "var(--accent-primary)" },
          { label: "Vaqt", value: `~${avgTime}s`, color: "var(--accent-secondary)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-glass)]">
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Wrong answers review */}
      {session.results.some((r) => !r.is_correct) && (
        <div className="text-left space-y-2">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Noto'g'ri javoblar</p>
          {session.questions.map((q, i) => {
            const r = session.results[i];
            if (!r || r.is_correct) return null;
            return (
              <div key={q.id} className="p-3 rounded-xl bg-[rgba(255,82,82,0.06)] border border-[rgba(255,82,82,0.2)] text-sm">
                <p className="text-[var(--text-primary)] font-medium">{q.question}</p>
                <p className="text-[var(--accent-success)] mt-1">✓ {q.options[q.correct_index]}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">🇺🇿 {q.explanation_uz}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border-glass)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors text-sm font-medium"
        >
          <RotateCcw size={16} />
          Qaytadan
        </button>
        <Link
          href="/tutor"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Darslarga o'tish
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
