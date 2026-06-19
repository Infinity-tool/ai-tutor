/**
 * Session Store — Zustand
 * Tracks the current active tutoring session.
 */
import { create } from "zustand";
import { ChatMessage, Subject } from "@/shared/types/global.types";

interface SessionState {
  sessionId: string | null;
  subject: Subject | null;
  isActive: boolean;
  startTime: number | null; // Date.now() timestamp
  messages: ChatMessage[];
  isMuted: boolean;

  startSession: (sessionId: string, subject: Subject) => void;
  endSession: () => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  toggleMute: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  sessionId: null,
  subject: null,
  isActive: false,
  startTime: null,
  messages: [],
  isMuted: false,

  startSession: (sessionId, subject) =>
    set({
      sessionId,
      subject,
      isActive: true,
      startTime: Date.now(),
      messages: [],
    }),

  endSession: () =>
    set({
      sessionId: null,
      subject: null,
      isActive: false,
      startTime: null,
    }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  clearMessages: () => set({ messages: [] }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
