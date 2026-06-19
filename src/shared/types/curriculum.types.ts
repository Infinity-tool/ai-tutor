import { Subject, CEFRLevel } from "./global.types";

export interface Lesson {
  id: string;
  title: string;
  title_uz?: string;
  description: string;
  description_uz?: string;
  duration_minutes: number;
  objectives: string[];
  objectives_uz?: string[];
  topics: string[];
  order: number;
  level: CEFRLevel;
  subject: Subject;
  completed?: boolean;
  locked?: boolean;
}

// ── Ingliz tili darslari (A1-B2) ────────────────────────────────────────────────
export const ENGLISH_LESSONS: Record<CEFRLevel, Lesson[]> = {
  "A1": [
    {
      id: "en-a1-1",
      title: "Alphabet & Greetings",
      title_uz: "Alifbo va salomlashishlar",
      description: "Learn the English alphabet and basic greetings like Hello, Hi, Goodbye.",
      description_uz: "Ingliz alifbosini va salomlashishlarni o'rganing (Hello, Hi, Goodbye kabi).",
      duration_minutes: 20,
      objectives: ["Recognize all English letters", "Say hello and goodbye", "Introduce yourself"],
      objectives_uz: ["Ingliz harflarini taniy olish", "Salomlashish va xayrlashish", "O'zingizni tanishtirish"],
      topics: ["Alphabet", "Greetings", "Basic Phrases"],
      order: 1,
      level: "A1",
      subject: "english"
    },
    {
      id: "en-a1-2",
      title: "Numbers 1-20",
      title_uz: "1-20 gacha sonlar",
      description: "Count from 1 to 20 and say your age.",
      description_uz: "1 dan 20 gacha sanab o'ting va yoshingizni aytib bering.",
      duration_minutes: 25,
      objectives: ["Count 1-20", "Say your age", "Ask about someone's age"],
      objectives_uz: ["1-20 gacha sanab o'tish", "Yoshingizni aytish", "Birovning yoshini so'rash"],
      topics: ["Numbers", "Age", "How old...?"],
      order: 2,
      level: "A1",
      subject: "english"
    },
    {
      id: "en-a1-3",
      title: "Days & Months",
      title_uz: "Kunlar va oylar",
      description: "Learn the days of the week and months of the year.",
      description_uz: "Hafta kunlari va yil oylarini o'rganing.",
      duration_minutes: 30,
      objectives: ["Say all days", "Say all months", "Ask 'What day is today?'"],
      objectives_uz: ["Hamma kunlarni aytish", "Hamma oylarni aytish", "Bugun qaysi kun? deb so'rash"],
      topics: ["Days", "Months", "Calendar"],
      order: 3,
      level: "A1",
      subject: "english"
    }
  ],
  "A2": [
    {
      id: "en-a2-1",
      title: "Present Simple Tense",
      title_uz: "Present Simple zamani",
      description: "Learn how to talk about daily routines and habits.",
      description_uz: "Kundalik tartib va odatlar haqida gapirishni o'rganing.",
      duration_minutes: 35,
      objectives: ["Make positive sentences", "Make negative sentences", "Ask questions"],
      objectives_uz: ["Musbat jumla tuzish", "Manfiy jumla tuzish", "Savollar berish"],
      topics: ["Present Simple", "Daily Routine", "Adverbs of Frequency"],
      order: 1,
      level: "A2",
      subject: "english"
    }
  ],
  "B1": [],
  "B2": [],
  "C1": [],
  "C2": []
};

// ── Rus tili darslari (A1-B2) ───────────────────────────────────────────────────
export const RUSSIAN_LESSONS: Record<CEFRLevel, Lesson[]> = {
  "A1": [
    {
      id: "ru-a1-1",
      title: "Алфавит и Приветствия",
      title_uz: "Alifbo va salomlashishlar",
      description: "Изучите русский алфавит и простые приветствия.",
      description_uz: "Rus alifbosini va oddiy salomlashishlarni o'rganing.",
      duration_minutes: 20,
      objectives: ["Узнать русский алфавит", "Сказать привет и пока"],
      objectives_uz: ["Rus alifbosini bilish", "Salom va xayr aytish"],
      topics: ["Алфавит", "Приветствия", "Фразы"],
      order: 1,
      level: "A1",
      subject: "russian"
    }
  ],
  "A2": [],
  "B1": [],
  "B2": [],
  "C1": [],
  "C2": []
};

// ── Nemis tili darslari (A1-B2) ────────────────────────────────────────────────
export const GERMAN_LESSONS: Record<CEFRLevel, Lesson[]> = {
  "A1": [
    {
      id: "de-a1-1",
      title: "Alphabet & Begrüßungen",
      title_uz: "Alifbo va salomlashishlar",
      description: "Lerne das deutsche Alphabet und einfache Begrüßungen.",
      description_uz: "Nemis alifbosini va oddiy salomlashishlarni o'rganing.",
      duration_minutes: 20,
      objectives: ["Deutsches Alphabet", "Begrüßungen lernen"],
      objectives_uz: ["Nemis alifbosi", "Salomlashishlarni o'rganish"],
      topics: ["Alphabet", "Begrüßungen"],
      order: 1,
      level: "A1",
      subject: "german"
    }
  ],
  "A2": [],
  "B1": [],
  "B2": [],
  "C1": [],
  "C2": []
};

// ── Turk tili darslari (A1-B2) ─────────────────────────────────────────────────
export const TURKISH_LESSONS: Record<CEFRLevel, Lesson[]> = {
  "A1": [
    {
      id: "tr-a1-1",
      title: "Alfabe ve Selamlar",
      title_uz: "Alifbo va salomlashishlar",
      description: "Türk alfabesini ve basit selamlamaları öğrenin.",
      description_uz: "Turk alifbosini va oddiy salomlashishlarni o'rganing.",
      duration_minutes: 20,
      objectives: ["Türk alfabesini bilmek", "Selamlamak"],
      objectives_uz: ["Turk alifbosini bilish", "Salomlashish"],
      topics: ["Alfabe", "Selamlar"],
      order: 1,
      level: "A1",
      subject: "turkish"
    }
  ],
  "A2": [],
  "B1": [],
  "B2": [],
  "C1": [],
  "C2": []
};

// ── Matematika darslari (Boshlang'ich) ─────────────────────────────────────────
export const MATH_LESSONS: Record<CEFRLevel, Lesson[]> = {
  "A1": [
    {
      id: "math-a1-1",
      title: "Numbers & Counting (1-100)",
      title_uz: "Sonlar va sanash (1-100)",
      description: "Learn numbers from 1 to 100 and basic counting.",
      description_uz: "1 dan 100 gacha sonlarni va oddiy sanashni o'rganing.",
      duration_minutes: 20,
      objectives: ["Count to 100", "Identify numbers", "Compare numbers"],
      objectives_uz: ["100 gacha sanash", "Sonlarni aniqlash", "Sonlarni solishtirish"],
      topics: ["Numbers", "Counting", "Comparison"],
      order: 1,
      level: "A1",
      subject: "math"
    },
    {
      id: "math-a1-2",
      title: "Addition & Subtraction",
      title_uz: "Qo'shish va ayirish",
      description: "Learn basic addition and subtraction.",
      description_uz: "Oddiy qo'shish va ayirishni o'rganing.",
      duration_minutes: 30,
      objectives: ["Add numbers", "Subtract numbers", "Word problems"],
      objectives_uz: ["Sonlarni qo'shish", "Sonlarni ayirish", "Matnli misollar"],
      topics: ["Addition", "Subtraction"],
      order: 2,
      level: "A1",
      subject: "math"
    }
  ],
  "A2": [
    {
      id: "math-a2-1",
      title: "Multiplication & Division",
      title_uz: "Ko'paytirish va bo'lish",
      description: "Learn multiplication tables and basic division.",
      description_uz: "Ko'paytirish jadvalini va oddiy bo'lishni o'rganing.",
      duration_minutes: 35,
      objectives: ["Learn tables 1-12", "Multiply numbers", "Divide numbers"],
      objectives_uz: ["1-12 gacha jadvalni o'rganish", "Ko'paytirish", "Bo'lish"],
      topics: ["Multiplication", "Division"],
      order: 1,
      level: "A2",
      subject: "math"
    }
  ],
  "B1": [],
  "B2": [],
  "C1": [],
  "C2": []
};

// Barcha darslarni bitta obyektga yig'ish
export const LESSONS: Record<Subject, Record<CEFRLevel, Lesson[]>> = {
  english: ENGLISH_LESSONS,
  russian: RUSSIAN_LESSONS,
  german: GERMAN_LESSONS,
  turkish: TURKISH_LESSONS,
  math: MATH_LESSONS
};
