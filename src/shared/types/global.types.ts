/**
 * Global shared TypeScript types — SuperTutor AI
 */

// ── Subjects ──────────────────────────────────────────────────────────────────
export type Subject = "english" | "math" | "russian" | "german" | "turkish";

export const SUBJECTS: Subject[] = ["english", "russian", "german", "turkish", "math"];

export const SUBJECT_LABELS: Record<Subject, string> = {
  english: "English",
  math:    "Mathematics",
  russian: "Русский",
  german:  "Deutsch",
  turkish: "Türkçe",
};

export const SUBJECT_LABELS_UZ: Record<Subject, string> = {
  english: "Ingliz tili",
  math:    "Matematika",
  russian: "Rus tili",
  german:  "Nemis tili",
  turkish: "Turk tili",
};

export const SUBJECT_FLAGS: Record<Subject, string> = {
  english: "🇬🇧",
  math:    "📐",
  russian: "🇷🇺",
  german:  "🇩🇪",
  turkish: "🇹🇷",
};

export const SUBJECT_COLORS: Record<Subject, { primary: string; bg: string; border: string }> = {
  english: { primary: "#6C63FF", bg: "rgba(108,99,255,0.1)",  border: "rgba(108,99,255,0.3)"  },
  russian: { primary: "#FF5252", bg: "rgba(255,82,82,0.1)",   border: "rgba(255,82,82,0.3)"   },
  german:  { primary: "#FFB300", bg: "rgba(255,179,0,0.1)",   border: "rgba(255,179,0,0.3)"   },
  turkish: { primary: "#00E676", bg: "rgba(0,230,118,0.1)",   border: "rgba(0,230,118,0.3)"   },
  math:    { primary: "#00D2FF", bg: "rgba(0,210,255,0.1)",   border: "rgba(0,210,255,0.3)"   },
};

// ── CEFR Levels ───────────────────────────────────────────────────────────────
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const CEFR_LABELS_UZ: Record<CEFRLevel, string> = {
  A1: "Boshlang'ich",
  A2: "Elementar",
  B1: "O'rta",
  B2: "O'rta-yuqori",
  C1: "Yuqori",
  C2: "Malakali",
};

// ── Chat Messages ─────────────────────────────────────────────────────────────
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  feedback?: MessageFeedback;
}

export interface MessageFeedback {
  pronunciation_score?: number;
  grammar_score?: number;
  fluency_score?: number;
  errors?: string[];
  suggestions?: string[];
  uzbek_explanation?: string;
}

// ── User Profile ──────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
  preferred_language?: "uz" | "en" | "ru";
}

// ── Statistics ────────────────────────────────────────────────────────────────
export interface UserStats {
  total_hours: number;
  total_sessions: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  subject_stats: SubjectStatSummary[];
  activity_log: Record<string, boolean>;
  weekly_data: WeeklyDataPoint[];
}

export interface SubjectStatSummary {
  subject: Subject;
  total_minutes: number;
  session_count: number;
  current_level: CEFRLevel;
  pronunciation_score: number | null;
  grammar_score: number | null;
  fluency_score: number | null;
  problems_solved: number;
  correct_answers: number;
  weak_topics: string[];
}

export interface WeeklyDataPoint {
  date: string;
  grammar: number;
  pronunciation: number;
  fluency: number;
  sessions: number;
}

// ── Session ───────────────────────────────────────────────────────────────────
export interface SessionData {
  id: string;
  subject: Subject;
  duration: number;
  messages: ChatMessage[];
  feedback: SessionFeedback | null;
  created_at: string;
}

export interface SessionFeedback {
  pronunciation_score: number;
  grammar_score: number;
  fluency_score: number;
  errors: string[];
  improvement_areas: string[];
  points_earned: number;
}

// ── Quiz & Flashcard ──────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  subject: Subject;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  explanation_uz: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export interface Flashcard {
  id: string;
  subject: Subject;
  front: string;
  back: string;
  back_uz?: string;
  topic: string;
  mastered: boolean;
  next_review: string;
  review_count: number;
}

// ── Learning Path ─────────────────────────────────────────────────────────────
export interface LearningPathStep {
  id: string;
  title: string;
  title_uz: string;
  description: string;
  subject: Subject;
  level: CEFRLevel;
  type: "lesson" | "quiz" | "practice" | "milestone";
  completed: boolean;
  locked: boolean;
  xp_reward: number;
}
