"use client";

import { useState, useCallback, useRef } from "react";
import { QuizQuestion, QuizSession, QuizResult, QuizConfig } from "../types/quiz.types";
import { generateId } from "@/shared/lib/utils";

interface UseQuizReturn {
  session: QuizSession | null;
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  isLoading: boolean;
  isFinished: boolean;
  error: string | null;
  startQuiz: (config: QuizConfig) => Promise<void>;
  answerQuestion: (selectedIndex: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export function useQuiz(): UseQuizReturn {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionStartTime = useRef<number>(Date.now());

  const startQuiz = useCallback(async (config: QuizConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Failed to generate quiz");

      const newSession: QuizSession = {
        id: generateId(),
        config,
        questions: data.data,
        results: [],
        started_at: Date.now(),
        finished_at: null,
        score: 0,
      };

      setSession(newSession);
      setCurrentIndex(0);
      questionStartTime.current = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quiz generation failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const answerQuestion = useCallback((selectedIndex: number) => {
    if (!session) return;

    const question = session.questions[currentIndex];
    const timeTaken = Date.now() - questionStartTime.current;
    const isCorrect = selectedIndex === question.correct_index;

    const result: QuizResult = {
      question_id: question.id,
      selected_index: selectedIndex,
      is_correct: isCorrect,
      time_taken_ms: timeTaken,
    };

    setSession((prev) => {
      if (!prev) return prev;
      const newResults = [...prev.results, result];
      const score = Math.round(
        (newResults.filter((r) => r.is_correct).length / prev.questions.length) * 100
      );
      return { ...prev, results: newResults, score };
    });
  }, [session, currentIndex]);

  const nextQuestion = useCallback(() => {
    if (!session) return;

    if (currentIndex >= session.questions.length - 1) {
      setSession((prev) =>
        prev ? { ...prev, finished_at: Date.now() } : prev
      );
    } else {
      setCurrentIndex((i) => i + 1);
      questionStartTime.current = Date.now();
    }
  }, [session, currentIndex]);

  const resetQuiz = useCallback(() => {
    setSession(null);
    setCurrentIndex(0);
    setError(null);
  }, []);

  const currentQuestion = session?.questions[currentIndex] ?? null;
  const isFinished = !!(session?.finished_at);

  return {
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
  };
}
