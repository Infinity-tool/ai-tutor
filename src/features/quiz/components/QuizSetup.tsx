"use client";

import React, { useState } from "react";
import { Subject, SUBJECTS, SUBJECT_LABELS_UZ, SUBJECT_FLAGS, CEFRLevel, CEFR_LEVELS, CEFR_LABELS_UZ } from "@/shared/types/global.types";
import { QuizConfig, QUIZ_TOPICS } from "../types/quiz.types";
import { Brain, Play } from "lucide-react";

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

export function QuizSetup({ onStart, isLoading }: QuizSetupProps) {
  const [subject, setSubject] = useState<Subject>("english");
  const [level, setLevel] = useState<CEFRLevel>("A2");
  const [topic, setTopic] = useState(QUIZ_TOPICS["english"][0]);
  const [count, setCount] = useState(5);

  const topics = QUIZ_TOPICS[subject];

  const handleSubjectChange = (s: Subject) => {
    setSubject(s);
    setTopic(QUIZ_TOPICS[s][0]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(108,99,255,0.4)]">
          <Brain size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Quiz boshlash</h2>
        <p className="text-[var(--text-secondary)] text-sm">Fan va mavzuni tanlang</p>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Fan</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => handleSubjectChange(s)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
              style={{
                background: subject === s ? "rgba(108,99,255,0.15)" : "var(--bg-card)",
                borderColor: subject === s ? "var(--accent-primary)" : "var(--border-glass)",
                color: subject === s ? "var(--accent-primary)" : "var(--text-secondary)",
              }}
            >
              <span className="text-xl">{SUBJECT_FLAGS[s]}</span>
              <span className="text-[10px] font-medium">{SUBJECT_LABELS_UZ[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Daraja</label>
        <div className="flex flex-wrap gap-2">
          {CEFR_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
              style={{
                background: level === l ? "rgba(108,99,255,0.15)" : "var(--bg-card)",
                borderColor: level === l ? "var(--accent-primary)" : "var(--border-glass)",
                color: level === l ? "var(--accent-primary)" : "var(--text-secondary)",
              }}
            >
              {l} <span className="text-xs opacity-70">— {CEFR_LABELS_UZ[l]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Mavzu</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="px-3 py-1.5 rounded-lg border text-sm transition-all"
              style={{
                background: topic === t ? "rgba(108,99,255,0.1)" : "transparent",
                borderColor: topic === t ? "var(--accent-primary)" : "var(--border-glass)",
                color: topic === t ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Question count */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
          Savollar soni: <span className="text-[var(--accent-primary)]">{count}</span>
        </label>
        <input
          type="range" min={3} max={10} value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-[var(--accent-primary)]"
        />
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>3</span><span>10</span>
        </div>
      </div>

      <button
        onClick={() => onStart({ subject, level, topic, count })}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition-all disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Play size={18} />
        )}
        {isLoading ? "Savollar tayyorlanmoqda..." : "Quizni boshlash"}
      </button>
    </div>
  );
}
