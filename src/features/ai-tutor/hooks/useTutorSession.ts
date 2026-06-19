"use client";

import { useState, useCallback, useRef } from "react";
import { Subject, CEFRLevel } from "@/shared/types/global.types";
import { useSessionStore } from "@/shared/store/session.store";
import { generateId } from "@/shared/lib/utils";

interface UseTutorSessionReturn {
  isActive: boolean;
  sessionId: string | null;
  subject: Subject | null;
  level: CEFRLevel;
  elapsedSeconds: number;
  startSession: (subject: Subject, level: CEFRLevel) => void;
  endSession: () => Promise<void>;
  setLevel: (level: CEFRLevel) => void;
}

export function useTutorSession(): UseTutorSessionReturn {
  const { startSession: storeStart, endSession: storeEnd, isActive, sessionId, subject } =
    useSessionStore();
  const [level, setLevel] = useState<CEFRLevel>("A2");
  const [elapsedSeconds, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSession = useCallback(
    (subj: Subject, lvl: CEFRLevel) => {
      const id = generateId();
      storeStart(id, subj);
      setLevel(lvl);
      setElapsed(0);

      timerRef.current = setInterval(
        () => setElapsed((s) => s + 1),
        1000
      );
    },
    [storeStart]
  );

  const endSession = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Save session to DB
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: useSessionStore.getState().subject,
          duration: elapsedSeconds,
          messages: useSessionStore.getState().messages,
        }),
      });
    } catch (err) {
      console.error("[useTutorSession] Failed to save session:", err);
    }

    storeEnd();
    setElapsed(0);
  }, [storeEnd, elapsedSeconds]);

  return {
    isActive,
    sessionId,
    subject,
    level,
    elapsedSeconds,
    startSession,
    endSession,
    setLevel,
  };
}
