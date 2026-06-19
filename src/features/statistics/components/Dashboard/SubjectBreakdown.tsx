"use client";

import React, { useState } from "react";
import { SubjectStatRow } from "../../types/statistics.types";
import { SUBJECT_FLAGS, SUBJECT_LABELS, Subject } from "@/shared/types/global.types";

interface SubjectBreakdownProps {
  subjects: SubjectStatRow[];
}

export function SubjectBreakdown({ subjects }: SubjectBreakdownProps) {
  const [active, setActive] = useState<Subject>(subjects[0]?.subject ?? "english");
  const current = subjects.find((s) => s.subject === active);

  return (
    <div className="glass-card-static p-5 space-y-4">
      <h3 className="font-display font-semibold text-[var(--text-primary)]">Subject Progress</h3>

      {/* Subject tabs */}
      <div className="flex gap-2 flex-wrap">
        {subjects.map((s) => (
          <button
            key={s.subject}
            onClick={() => setActive(s.subject)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: active === s.subject ? "var(--accent-primary)" : "var(--bg-secondary)",
              color: active === s.subject ? "white" : "var(--text-secondary)",
              border: active === s.subject ? "1px solid transparent" : "1px solid var(--border-glass)",
            }}
          >
            {SUBJECT_FLAGS[s.subject]} {SUBJECT_LABELS[s.subject]}
          </button>
        ))}
      </div>

      {/* Stats for selected subject */}
      {current && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Level", value: current.current_level, color: "var(--accent-primary)" },
            { label: "Sessions", value: String(current.session_count), color: "var(--accent-secondary)" },
            { label: "Minutes", value: String(Math.round(current.total_minutes)), color: "var(--text-primary)" },
            { label: "Grammar", value: current.grammar_score ? `${current.grammar_score.toFixed(0)}%` : "—", color: "var(--accent-success)" },
            { label: "Pronunciation", value: current.pronunciation_score ? `${current.pronunciation_score.toFixed(0)}%` : "—", color: "var(--accent-success)" },
            { label: "Accuracy", value: `${current.accuracy.toFixed(0)}%`, color: "var(--accent-warning)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-glass)]">
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
              <p className="font-bold text-lg mt-0.5" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
