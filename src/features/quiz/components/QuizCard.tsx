"use client";

import React, { useState } from "react";
import { QuizQuestion, QuizResult } from "../types/quiz.types";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  result?: QuizResult;
  onAnswer: (index: number) => void;
  onNext: () => void;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  result,
  onAnswer,
  onNext,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const answered = result !== undefined;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    onAnswer(index);
    setTimeout(() => setShowExplanation(true), 300);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return selected === index
        ? "border-[var(--accent-primary)] bg-[rgba(108,99,255,0.15)]"
        : "border-[var(--border-glass)] bg-[var(--bg-card)] hover:border-[rgba(108,99,255,0.4)] hover:bg-[rgba(108,99,255,0.05)]";
    }
    if (index === question.correct_index) {
      return "border-[var(--accent-success)] bg-[rgba(0,230,118,0.1)] text-[var(--accent-success)]";
    }
    if (index === result?.selected_index && !result.is_correct) {
      return "border-[var(--accent-danger)] bg-[rgba(255,82,82,0.1)] text-[var(--accent-danger)]";
    }
    return "border-[var(--border-glass)] bg-[var(--bg-card)] opacity-40";
  };

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Question {questionNumber} / {totalQuestions}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-1.5 rounded-full transition-all"
              style={{
                background: i < questionNumber - 1
                  ? "var(--accent-success)"
                  : i === questionNumber - 1
                  ? "var(--accent-primary)"
                  : "var(--border-glass)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-glass)]">
        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={answered}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${getOptionStyle(index)}`}
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 border"
              style={{
                background: answered && index === question.correct_index
                  ? "var(--accent-success)"
                  : answered && index === result?.selected_index && !result.is_correct
                  ? "var(--accent-danger)"
                  : "var(--bg-card)",
                borderColor: "var(--border-glass)",
                color: answered && (index === question.correct_index || (index === result?.selected_index && !result.is_correct))
                  ? "white"
                  : "var(--text-muted)",
              }}
            >
              {optionLetters[index]}
            </span>
            <span className="text-sm flex-1">{option}</span>
            {answered && index === question.correct_index && (
              <CheckCircle size={18} className="text-[var(--accent-success)] flex-shrink-0" />
            )}
            {answered && index === result?.selected_index && !result.is_correct && (
              <XCircle size={18} className="text-[var(--accent-danger)] flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="p-4 rounded-xl border space-y-2 animate-fade-in"
          style={{
            background: result?.is_correct ? "rgba(0,230,118,0.06)" : "rgba(255,82,82,0.06)",
            borderColor: result?.is_correct ? "rgba(0,230,118,0.25)" : "rgba(255,82,82,0.25)",
          }}
        >
          <p className="text-xs font-semibold" style={{ color: result?.is_correct ? "var(--accent-success)" : "var(--accent-danger)" }}>
            {result?.is_correct ? "✓ Correct!" : "✗ Incorrect"}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">{question.explanation}</p>
          {question.explanation_uz && (
            <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border-glass)] pt-2 mt-2">
              🇺🇿 {question.explanation_uz}
            </p>
          )}

          <button
            onClick={onNext}
            className="flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {questionNumber === totalQuestions ? "See Results" : "Next Question"}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
