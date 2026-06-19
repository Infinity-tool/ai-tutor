"use client";

import React, { useState } from "react";
import { useQuiz } from "@/features/quiz/hooks/useQuiz";
import { QuizSetup } from "@/features/quiz/components/QuizSetup";
import { QuizCard } from "@/features/quiz/components/QuizCard";
import { QuizResults } from "@/features/quiz/components/QuizResults";
import { Subject, CEFRLevel, SUBJECTS, SUBJECT_LABELS_UZ, SUBJECT_FLAGS } from "@/shared/types/global.types";
import { LESSONS, Lesson } from "@/shared/types/curriculum.types";
import { GlowCard } from "@/shared/components/ui/GlowCard";
import { BookOpen, Target, Trophy, Play, RotateCcw, ChevronLeft } from "lucide-react";

export default function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>("english");
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("A1");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const {
    session,
    currentQuestion,
    currentIndex,
    isLoading,
    isFinished,
    error,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
  } = useQuiz();

  const lessons = LESSONS[selectedSubject]?.[selectedLevel] || [];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
          <Target size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Bilimingizni sinab ko'ring</h2>
        <p className="text-white/70 max-w-lg mx-auto">
          Fan, daraja va dars tanlab, o'zingizni sinab ko'ring. Har to'g'ri javob uchun ball oling!
        </p>
      </div>

      {/* Lesson Selection (if no active session) */}
      {!session && !isFinished && (
        <div className="space-y-6">
          {/* Subject & Level Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Subject */}
            <GlowCard glow="cyan" className="p-6">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={14} /> Fan tanlang
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => {
                      setSelectedSubject(subj);
                      setSelectedLesson(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedSubject === subj
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/25"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{SUBJECT_FLAGS[subj]}</span>
                    {SUBJECT_LABELS_UZ[subj]}
                  </button>
                ))}
              </div>
            </GlowCard>

            {/* Level */}
            <GlowCard glow="purple" className="p-6">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Trophy size={14} /> Daraja tanlang
              </p>
              <div className="flex flex-wrap gap-2">
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevel(lvl as CEFRLevel);
                      setSelectedLesson(null);
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedLevel === lvl
                        ? "bg-purple-500/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/25"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </GlowCard>
          </div>

          {/* Lessons List */}
          {lessons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                  {selectedLevel} darajasidagi darslar
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      <div className="flex items-start justify-between gap-4">
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
                            <p className="text-xs text-white/60 line-clamp-2">
                              {lesson.description_uz || lesson.description}
                            </p>
                          </div>
                        </div>
                        {selectedLesson?.id === lesson.id && (
                          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                            <CheckCircle2 size={20} />
                          </div>
                        )}
                      </div>
                    </GlowCard>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          {selectedLesson && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() =>
                  startQuiz({
                    subject: selectedSubject,
                    level: selectedLevel,
                    topic: selectedLesson.topics[0] || "",
                    count: 5,
                  })
                }
                disabled={isLoading}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-xl shadow-green-500/30 hover:shadow-green-500/40"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Tayyorlanmoqda...
                  </>
                ) : (
                  <>
                    <Play size={24} fill="currentColor" />
                    Testni boshlash
                  </>
                )}
              </button>
            </div>
          )}

          {/* Or use the original setup */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-sm text-white/50 mb-4">
              Yoki dars tanlamasdan, mavzu bo'yicha test yarating
            </p>
            <QuizSetup onStart={startQuiz} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Active Quiz Session */}
      {session && !isFinished && currentQuestion && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={18} />
              Orqaga
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-sm text-white/70">
                {currentIndex + 1} / {session.questions.length}
              </span>
            </div>
          </div>
          <QuizCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={session.questions.length}
            result={session.results[currentIndex]}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center space-y-3">
          <p className="text-lg font-medium">⚠️ Xato yuz berdi</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 mx-auto transition-all"
          >
            <RotateCcw size={16} />
            Qayta urinish
          </button>
        </div>
      )}

      {/* Quiz Results */}
      {session && isFinished && (
        <div className="space-y-6">
          <QuizResults session={session} onRetry={resetQuiz} />
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSession(null);
                setSelectedLesson(null);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={18} />
              Boshqa test tanlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Missing component import fix
function CheckCircle2({ size, className }: { size: number; className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
