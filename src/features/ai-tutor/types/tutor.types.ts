import { ChatMessage, Subject, CEFRLevel } from "@/shared/types/global.types";

export interface TutorSession {
  id: string;
  subject: Subject;
  level: CEFRLevel;
  startedAt: number;
  messages: ChatMessage[];
}

export interface StreamingState {
  isStreaming: boolean;
  partialMessage: string;
  error: string | null;
}

export interface FeedbackData {
  pronunciation_score: number;
  grammar_score: number;
  errors: string[];
  suggestions: string[];
}

export interface TutorChatRequest {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  subject: Subject;
  level: CEFRLevel;
}
