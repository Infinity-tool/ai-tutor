"use client";

import React, { useState } from "react";
import { FlashcardDeck } from "@/features/flashcards/components/FlashcardDeck";
import {
  Subject,
  SUBJECTS,
  SUBJECT_FLAGS,
  SUBJECT_LABELS_UZ,
  CEFRLevel,
  CEFR_LEVELS,
  Flashcard,
} from "@/shared/types/global.types";
import { LESSONS, Lesson } from "@/shared/types/curriculum.types";
import { QUIZ_TOPICS } from "@/features/quiz/types/quiz.types";
import { generateId } from "@/shared/lib/utils";
import { Layers, Loader2, Gamepad2, BookOpen, Shuffle, RefreshCcw } from "lucide-react";
import { GlowCard } from "@/shared/components/ui/GlowCard";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [subject, setSubject] = useState<Subject>("english");
  const [level, setLevel] = useState<CEFRLevel>("A1");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lessons = LESSONS[subject]?.[level] || [];

  const handleGenerateFromLesson = async () => {
    if (!selectedLesson) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          level,
          topic: selectedLesson.topics[0] || "",
          count: 8,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const generated: Flashcard[] = data.data.map((c: Record<string, string>) => ({
        id: generateId(),
        subject,
        front: c.front,
        back: c.back,
        back_uz: c.back_uz,
        topic: selectedLesson.topics[0] || "",
        mastered: false,
        next_review: new Date().toISOString(),
        review_count: 0,
      }));
      setCards(generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromTopic = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, level, topic, count: 8 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const generated: Flashcard[] = data.data.map((c: Record<string, string>) => ({
        id: generateId(),
        subject,
        front: c.front,
        back: c.back,
        back_uz: c.back_uz,
        topic,
        mastered: false,
        next_review: new Date().toISOString(),
        review_count: 0,
      }));
      setCards(generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (s: Subject) => {
    setSubject(s);
    setSelectedLesson(null);
    setCards([]);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
          <Layers size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Flashcardlar bilan o'qiling</h2>
        <p className="text-white/70 max-w-lg mx-auto">
          Lug'atlar, tushunchalar va formullarni eslab qolish uchun interaktiv kartochkalar.
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="space-y-6">
          {/* Subject & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlowCard glow="cyan" className="p-6">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={14} /> Fan tanlang
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSubjectChange(s)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      subject === s
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/25"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{SUBJECT_FLAGS[s]}</span>
                    {SUBJECT_LABELS_UZ[s]}
                  </button>
                ))}
              </div>
            </GlowCard>

            <GlowCard glow="purple" className="p-6">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Gamepad2 size={14} /> Daraja tanlang
              </p>
              <div className="flex flex-wrap gap-2">
                {CEFR_LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLevel(l);
                      setSelectedLesson(null);
                      setCards([]);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      level === l
                        ? "bg-purple-500/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/25"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </GlowCard>
          </div>

          {/* Lessons or Topics */}
          <div className="space-y-4">
            {/* Lessons */}
            {lessons.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                    Dars bo'yicha kartochkalar
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="group">
                      <GlowCard
                        glow={idx % 2 === 0 ? "cyan" : "purple"}
                        className={`p-5 cursor-pointer transition-all hover:-translate-y-1 ${
                          selectedLesson?.id === lesson.id
                            ? "ring-2 ring-white/30"
                            : ""
                        }`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold"
                              style={{
                                background:
                                  idx % 2 === 0
                                    ? "rgba(6, 182, 212, 0.2)"
                                    : "rgba(168, 85, 247, 0.2)",
                                color: idx % 2 === 0 ? "#06b6d4" : "#a855f7",
                                border: `1px solid ${
                                  idx % 2 === 0
                                    ? "rgba(6, 182, 212, 0.3)"
                                    : "rgba(168, 85, 247, 0.3)"
                                }`,
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                {lesson.title_uz || lesson.title}
                              </h4>
                              <p className="text-xs text-white/60 line-clamp-1">
                                {lesson.description_uz || lesson.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </GlowCard>
                    </div>
                  ))}
                </div>
                {selectedLesson && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handleGenerateFromLesson}
                      disabled={isLoading}
                      className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          Tayyorlanmoqda...
                        </>
                      ) : (
                        <>
                          <Shuffle size={24} />
                          Kartochkalar yaratish
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Topics */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                Mavzu bo'yicha kartochkalar
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {QUIZ_TOPICS[subject].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleGenerateFromTopic(topic)}
                    disabled={isLoading}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-medium hover:bg-white/10 disabled:opacity-50 transition-all truncate"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setCards([]);
                setSelectedLesson(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
            >
              <RefreshCcw size={18} />
              Yangi kartochkalar
            </button>
            {selectedLesson && (
              <span className="text-sm text-white/50">
                {selectedLesson.title_uz || selectedLesson.title}
              </span>
            )}
          </div>
          <FlashcardDeck
            cards={cards}
            onMastered={(id) =>
              setCards((prev) =>
                prev.map((c) => (c.id === id ? { ...c, mastered: true } : c))
              )
            }
            onNeedsReview={(id) =>
              setCards((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, review_count: c.review_count + 1 } : c
                )
              )
            }
          />
        </div>
      )}
    </div>
  );
}
