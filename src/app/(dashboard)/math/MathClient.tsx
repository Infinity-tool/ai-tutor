"use client";

import React, { useState } from "react";
import { CEFRLevel, SUBJECT_FLAGS, SUBJECT_LABELS_UZ } from "@/shared/types/global.types";
import { LESSONS, Lesson } from "@/shared/types/curriculum.types";
import { MathSolver } from "@/features/math-tutor/components/MathSolver";
import { GlowCard } from "@/shared/components/ui/GlowCard";
import { ChevronLeft } from "lucide-react";

export function MathClient() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("A1");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons = LESSONS.math[selectedLevel] || [];

  if (selectedLesson) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSelectedLesson(null)}
            className="p-2 rounded-xl border border-[var(--border-glass)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <ChevronLeft size={18} className="text-[var(--text-secondary)]" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {selectedLesson.title_uz || selectedLesson.title}
            </h2>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              {SUBJECT_FLAGS.math} {SUBJECT_LABELS_UZ.math} · {selectedLesson.level} · {selectedLesson.duration_minutes} daqiqa
            </p>
          </div>
        </div>
        <div className="flex-1">
          <MathSolver lesson={selectedLesson} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3a7bd5] flex items-center justify-center mx-auto text-3xl">
          ∑
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Matematika</h2>
        <p className="text-sm text-[var(--text-secondary)]">Darslar tanlang va AI yordamida o'rganing</p>
      </div>

      <GlowCard glow="purple" className="p-5">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Daraja</p>
        <div className="flex flex-wrap gap-2">
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLevel(l as CEFRLevel)}
              className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{
                background: selectedLevel === l ? "rgba(139,92,246,0.15)" : "transparent",
                borderColor: selectedLevel === l ? "#8b5cf6" : "var(--border-glass)",
                color: selectedLevel === l ? "#8b5cf6" : "var(--text-muted)",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </GlowCard>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            {selectedLevel} darajadagi darslar ({lessons.length} ta)
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <p>Bu daraja uchun darslar hozircha mavjud emas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="group">
                <GlowCard
                  glow={index === 0 ? "purple" : "cyan"}
                  className="p-5 cursor-pointer hover:-translate-y-0.5 transition-all"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{
                          background: index === 0 ? "rgba(139,92,246,0.2)" : "rgba(0,210,255,0.2)",
                          color: index === 0 ? "#8b5cf6" : "#00d2ff",
                          border: `1px solid ${index === 0 ? "#8b5cf640" : "#00d2ff40"}`,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[#8b5cf6] transition-colors">
                          {lesson.title_uz || lesson.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {lesson.description_uz || lesson.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {lesson.topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--border-glass)] text-[var(--text-muted)]"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
