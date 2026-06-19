import { Subject, CEFRLevel } from "@/shared/types/global.types";

export interface UserStatsResponse {
  total_hours: number;
  total_sessions: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  subject_stats: SubjectStatRow[];
  activity_log: Record<string, boolean>;
  weekly_data: WeeklyPoint[];
  trend: StatTrend;
}

export interface SubjectStatRow {
  subject: Subject;
  total_minutes: number;
  session_count: number;
  current_level: CEFRLevel;
  pronunciation_score: number | null;
  grammar_score: number | null;
  problems_solved: number;
  correct_answers: number;
  accuracy: number;
}

export interface WeeklyPoint {
  date: string;
  grammar: number;
  pronunciation: number;
  sessions: number;
}

export interface StatTrend {
  hours_change_pct: number;
  sessions_change_pct: number;
  score_change_pct: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  image: string | null;
  total_points: number;
  current_streak: number;
  isCurrentUser: boolean;
}
