"use client";

import React from "react";
import { Subject, SUBJECTS, SUBJECT_LABELS, SUBJECT_FLAGS } from "@/shared/types/global.types";

interface SubjectSelectorProps {
  value: Subject;
  onChange: (subject: Subject) => void;
  disabled?: boolean;
}

export function SubjectSelector({ value, onChange, disabled }: SubjectSelectorProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap" role="radiogroup" aria-label="Select subject">
      {SUBJECTS.map((subject) => {
        const isActive = value === subject;
        return (
          <button
            key={subject}
            role="radio"
            aria-checked={isActive}
            onClick={() => !disabled && onChange(subject)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isActive
                ? "var(--accent-primary)"
                : "var(--bg-card)",
              color: isActive ? "white" : "var(--text-secondary)",
              border: isActive
                ? "1px solid transparent"
                : "1px solid var(--border-glass)",
              boxShadow: isActive ? "0 0 16px rgba(108,99,255,0.4)" : "none",
            }}
          >
            <span aria-hidden="true">{SUBJECT_FLAGS[subject]}</span>
            {SUBJECT_LABELS[subject]}
          </button>
        );
      })}
    </div>
  );
}
