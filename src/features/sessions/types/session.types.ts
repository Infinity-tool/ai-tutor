import { Subject, ChatMessage } from "@/shared/types/global.types";

export interface SessionRecord {
  id: string;
  subject: Subject;
  duration: number;
  feedback: SessionFeedback | null;
  created_at: string;
}

export interface SessionFeedback {
  pronunciation_score: number;
  grammar_score: number;
  errors: string[];
  points_earned: number;
}
