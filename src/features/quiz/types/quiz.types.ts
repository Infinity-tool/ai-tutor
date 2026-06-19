import { Subject, CEFRLevel } from "@/shared/types/global.types";

export interface QuizConfig {
  subject: Subject;
  level: CEFRLevel;
  topic: string;
  count: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  explanation_uz: string;
  topic: string;
}

export interface QuizResult {
  question_id: string;
  selected_index: number;
  is_correct: boolean;
  time_taken_ms: number;
}

export interface QuizSession {
  id: string;
  config: QuizConfig;
  questions: QuizQuestion[];
  results: QuizResult[];
  started_at: number;
  finished_at: number | null;
  score: number;
}

export const QUIZ_TOPICS: Record<Subject, string[]> = {
  english: ["Present Simple", "Past Simple", "Future Tenses", "Articles", "Prepositions", "Vocabulary", "Phrasal Verbs", "Conditionals", "Passive Voice", "Modal Verbs"],
  russian: ["Падежи", "Глаголы движения", "Виды глагола", "Числительные", "Прилагательные", "Местоимения", "Предлоги", "Лексика"],
  german:  ["Artikel", "Kasus", "Verben", "Adjektive", "Präpositionen", "Modalverben", "Perfekt", "Wortschatz"],
  turkish: ["Fiil çekimi", "Hal ekleri", "Soru cümleleri", "Sayılar", "Sıfatlar", "Zarflar", "Kelime bilgisi"],
  math:    ["Algebra", "Geometry", "Arithmetic", "Fractions", "Percentages", "Statistics", "Calculus Basics", "Trigonometry"],
};
