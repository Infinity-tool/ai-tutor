"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlowCard } from "@/shared/components/ui/GlowCard";
import { Subject, CEFRLevel, SUBJECTS, SUBJECT_FLAGS, SUBJECT_LABELS_UZ, CEFR_LEVELS } from "@/shared/types/global.types";
import { LESSONS, Lesson } from "@/shared/types/curriculum.types";
import { TutorChat } from "@/features/ai-tutor/components/TutorChat";
import { BookOpen, Play, Lock, ChevronLeft, CheckCircle2 } from "lucide-react";

export function TutorClient() {
  const searchParams = useSearchParams();
  const initialSubject = (searchParams.get("subject") as Subject) || "english";

  const [selectedSubject, setSelectedSubject] = useState<Subject>(initialSubject);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("A1");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Darslar ro'yxatini olish
  const lessons = LESSONS[selectedSubject]?.[selectedLevel] || [];

  // Dars tanlashni bekor qilish
  const handleBack = () => setSelectedLesson(null);

  // Agar dars tanlangan bo'lsa, TutorChat-ni ko'rsat
  if (selectedLesson) {
    return (
      <div className="h-full flex flex-col">
        {/* Dars sarlavhasi orqa tugma bilan */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl border border-[var(--border-glass)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <ChevronLeft size={18} className="text-[var(--text-secondary)]" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {selectedLesson.title_uz || selectedLesson.title}
            </h2>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              {SUBJECT_FLAGS[selectedLesson.subject]} {SUBJECT_LABELS_UZ[selectedLesson.subject]} · {selectedLesson.level} · {selectedLesson.duration_minutes} daqiqa
            </p>
          </div>
        </div>
        <div className="flex-1">
          <TutorChat
            initialSubject={selectedSubject}
            initialLevel={selectedLevel}
            lesson={selectedLesson}
          />
        </div>
      </div>
    );
  }

  // Darslar ro'yxatini ko'rsat
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Sarlavha */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d2ff] to-[#3a7bd5] flex items-center justify-center mx-auto">
          <BookOpen size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Darslar</h2>
        <p className="text-sm text-[var(--text-secondary)]">Siz uchun tayyorlangan darslarni tanlang</p>
      </div>

      {/* Fan tanlash */}
      <GlowCard glow="cyan" className="p-5">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Fan</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedSubject(s);
                setSelectedLesson(null);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{
                background: selectedSubject === s ? "rgba(0,210,255,0.15)" : "transparent",
                borderColor: selectedSubject === s ? "#00d2ff" : "var(--border-glass)",
                color: selectedSubject === s ? "#00d2ff" : "var(--text-muted)",
              }}
            >
              {SUBJECT_FLAGS[s]} {SUBJECT_LABELS_UZ[s]}
            </button>
          ))}
        </div>
      </GlowCard>

      {/* Daraja tanlash */}
      <GlowCard glow="purple" className="p-5">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Daraja</p>
        <div className="flex flex-wrap gap-2">
          {CEFR_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => {
                setSelectedLevel(l);
                setSelectedLesson(null);
              }}
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

      {/* Darslar ro'yxati */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            {selectedLevel} darajasidagi darslar ({lessons.length} ta)
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <p>Bu daraja uchun darslar hozircha mavjud emas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="group"
              >
                <GlowCard
                  glow={index === 0 ? "cyan" : "purple"}
                  className="p-5 cursor-pointer hover:-translate-y-0.5 transition-all"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{
                          background: index === 0 ? "rgba(0,210,255,0.2)" : "rgba(139,92,246,0.2)",
                          color: index === 0 ? "#00d2ff" : "#8b5cf6",
                          border: `1px solid ${index === 0 ? "#00d2ff40" : "#8b5cf640"}`,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[#00d2ff] transition-colors">
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
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,210,255,0.1)] text-[#00d2ff] flex items-center gap-1">
                            <ClockIcon size={10} /> {lesson.duration_minutes} daq
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-xl bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
                      >
                        <Play size={16} />
                      </button>
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

function ClockIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
