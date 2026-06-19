"use client";

import { useState, useCallback } from "react";
import { MathSolution, MathSessionState } from "../types/math.types";
import { Lesson } from "@/shared/types/curriculum.types";

interface UseMathSessionReturn {
  state: MathSessionState;
  solve: (problem: string) => Promise<void>;
  reset: () => void;
  explainDifferently: () => Promise<void>;
}

export function useMathSession(lesson?: Lesson): UseMathSessionReturn {
  const [state, setState] = useState<MathSessionState>({
    problem: "",
    solution: null,
    isLoading: false,
    error: null,
    history: [],
  });

  const solve = useCallback(async (problem: string) => {
    setState((s) => ({ ...s, problem, isLoading: true, error: null, solution: null }));

    try {
      const res = await fetch("/api/ai/math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, lesson }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Failed to solve");

      const solution: MathSolution = data.data;
      setState((s) => ({
        ...s,
        solution,
        isLoading: false,
        history: [solution, ...s.history].slice(0, 10),
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to solve problem",
      }));
    }
  }, [lesson]);

  const explainDifferently = useCallback(async () => {
    if (!state.problem) return;
    await solve(`Explain differently: ${state.problem}`);
  }, [state.problem, solve]);

  const reset = useCallback(() => {
    setState({ problem: "", solution: null, isLoading: false, error: null, history: [] });
  }, []);

  return { state, solve, reset, explainDifferently };
}
