import { CEFRLevel } from "@/shared/types/global.types";

/**
 * English-specific tutor prompts with CEFR-aware conversation starters.
 */
export const ENGLISH_STARTERS: Record<CEFRLevel, string[]> = {
  A1: [
    "Hello! My name is Alex. What is your name?",
    "Hi! How are you today?",
    "Let's practice! Can you tell me about your family?",
  ],
  A2: [
    "Great to meet you! What do you like to do on weekends?",
    "Let's chat! Tell me about your daily routine.",
    "Hi! What's your favorite food? Let's talk about it!",
  ],
  B1: [
    "Let's have a conversation! What are your plans for the future?",
    "I'd love to know — what's a topic you're passionate about?",
    "Let's discuss! What do you think about learning languages?",
  ],
  B2: [
    "Let's explore some ideas! What's your opinion on the impact of technology on education?",
    "I'd like to discuss — how has your city changed over the past decade?",
    "Tell me about a book or film that had a significant impact on you.",
  ],
  C1: [
    "Let's debate! Do you think artificial intelligence will ultimately benefit or harm society?",
    "I'm curious — how do you think globalization has shaped modern identity?",
    "Discuss the role of empathy in effective leadership.",
  ],
  C2: [
    "Let's explore the nuances of language acquisition — what do you think separates truly fluent speakers from advanced learners?",
    "How do you reconcile the tension between linguistic prescriptivism and descriptivism?",
    "Analyze the socioeconomic factors that influence multilingualism.",
  ],
};

export function getEnglishStarter(level: CEFRLevel): string {
  const starters = ENGLISH_STARTERS[level];
  return starters[Math.floor(Math.random() * starters.length)];
}
