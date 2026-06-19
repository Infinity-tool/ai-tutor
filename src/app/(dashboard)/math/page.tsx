"use client";

import React, { useState } from "react";
import { CEFRLevel, SUBJECT_FLAGS, SUBJECT_LABELS_UZ } from "@/shared/types/global.types";
import { LESSONS, Lesson } from "@/shared/types/curriculum.types";
import { MathSolver } from "@/features/math-tutor/components/MathSolver";
import { GlowCard } from "@/shared/components/ui/GlowCard";
import { BookOpen, Calculator, ChevronLeft, Gamepad2, Target, Lightbulb } from "lucide-react";

export default function MathPage() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("A1");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [view, setView] = useState<'lessons' | 'game' | 'solver'>('lessons');

  const lessons = LESSONS.math[selectedLevel] || [];

  const quickMathProblems = [
    { id: 1, problem: "2 + 2", answer: "4", level: "A1" },
    { id: 2, problem: "5 × 6", answer: "30", level: "A1" },
    { id: 3, problem: "10 - 4", answer: "6", level: "A1" },
    { id: 4, problem: "15 ÷ 3", answer: "5", level: "A1" },
    { id: 5, problem: "x + 5 = 12, x = ?", answer: "7", level: "A2" },
  ];

  const [gameScore, setGameScore] = useState(0);
  const [gameProblem, setGameProblem] = useState<typeof quickMathProblems[0] | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  const startGame = () => {
    const available = quickMathProblems.filter((p) => p.level === selectedLevel);
    if (available.length > 0) {
      setGameProblem(available[Math.floor(Math.random() * available.length)]);
    } else {
      setGameProblem(quickMathProblems[0]);
    }
    setUserAnswer("");
    setGameMessage(null);
  };

  const checkGameAnswer = () => {
    if (!gameProblem) return;
    if (userAnswer.trim() === gameProblem.answer) {
      setGameScore((s) => s + 10);
      setGameMessage("To'g'ri! 🎉");
      setTimeout(() => {
        startGame();
      }, 1000);
    } else {
      setGameMessage("Noto'g'ri, qayta urinib ko'ring!");
    }
  };

  if (selectedLesson && view === 'solver') {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedLesson(null)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={20} className="text-white/70" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedLesson.title_uz || selectedLesson.title}
            </h2>
            <p className="text-sm text-white/60">
              {selectedLesson.description_uz || selectedLesson.description}
            </p>
          </div>
        </div>
        <MathSolver lesson={selectedLesson} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
          <Calculator size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Matematika</h2>
        <p className="text-white/70 max-w-lg mx-auto">
          Masalalarni yeching, o'yinlar o'ynang va bilimlaringizni mustahkamlANG!
        </p>
      </div>

      {/* View Selector */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setView('lessons')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
            view === 'lessons'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/25'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <BookOpen size={18} />
          Darslar
        </button>
        <button
          onClick={() => {
            setView('game');
            if (!gameProblem) startGame();
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
            view === 'game'
              ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/25'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Gamepad2 size={18} />
          O'yin
        </button>
      </div>

      {view === 'lessons' ? (
        <div className="space-y-6">
          {/* Level Selector */}
          <GlowCard glow="purple" className="p-6">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target size={14} /> Daraja tanlang
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
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/25'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </GlowCard>

          {/* Lessons List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                {selectedLevel} darajasidagi darslar
              </p>
            </div>
            {lessons.length === 0 ? (
              <div className="text-center py-10 text-white/60">
                Bu daraja uchun darslar hozircha mavjud emas
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="group">
                    <GlowCard
                      glow={idx % 2 === 0 ? "cyan" : "purple"}
                      className="p-6 cursor-pointer transition-all hover:-translate-y-1"
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setView('solver');
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                            style={{
                              background: idx % 2 === 0 ? "rgba(6, 182, 212, 0.2)" : "rgba(168, 85, 247, 0.2)",
                              color: idx % 2 === 0 ? "#06b6d4" : "#a855f7",
                              border: `1px solid ${idx % 2 === 0 ? "rgba(6, 182, 212, 0.3)" : "rgba(168, 85, 247, 0.3)"}`,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {lesson.title_uz || lesson.title}
                            </h4>
                            <p className="text-sm text-white/60">
                              {lesson.description_uz || lesson.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {lesson.topics.map((topic) => (
                                <span
                                  key={topic}
                                  className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-white/60"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover:bg-white/10 transition-all">
                          <ChevronLeft size={20} className="rotate-180" />
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <GlowCard glow="green" className="p-8 text-center">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                  <Trophy size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/60 uppercase tracking-wider">
                    Your Score
                  </p>
                  <p className="text-3xl font-bold text-white">{gameScore}</p>
                </div>
              </div>
              <button
                onClick={startGame}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all"
              >
                <RefreshCcw size={20} />
              </button>
            </div>

            {gameProblem && (
              <div className="space-y-6">
                <div className="text-4xl font-bold text-white py-8">
                  {gameProblem.problem}
                </div>

                <div className="flex items-center gap-3 max-w-md mx-auto">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") checkGameAnswer();
                    }}
                    placeholder="Javobingizni kiriting..."
                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-lg text-center focus:outline-none focus:border-green-500/50 transition-all"
                  />
                  <button
                    onClick={checkGameAnswer}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
                  >
                    Yuborish
                  </button>
                </div>

                {gameMessage && (
                  <p className={`text-lg font-semibold ${gameMessage.includes('To\'g\'ri') ? 'text-green-400' : 'text-orange-400'}`}>
                    {gameMessage}
                  </p>
                )}
              </div>
            )}
          </GlowCard>
        </div>
      )}
    </div>
  );
}

// Missing components
function Trophy({ size, className }: { size: number; className?: string }) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function RefreshCcw({ size, className }: { size: number; className?: string }) {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
