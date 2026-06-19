import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/shared/lib/api-helpers";
import { buildFlashcardPrompt } from "@/features/ai-tutor/services/prompts/base.prompt";
import { SUBJECTS, CEFR_LEVELS } from "@/shared/types/global.types";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) return err("GROQ_API_KEY not configured", 500);

    const body = await req.json();
    const { subject, level, topic, count = 6 } = body;

    if (!SUBJECTS.includes(subject)) return err("Invalid subject", 400);
    if (!CEFR_LEVELS.includes(level)) return err("Invalid level", 400);
    if (!topic) return err("Topic is required", 400);

    const systemPrompt = buildFlashcardPrompt(subject, level, topic, Math.min(count, 12));

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} flashcards for "${topic}" at ${level} level in ${subject}.` },
      ],
      temperature: 0.6,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const cards: unknown[] = Array.isArray(parsed)
      ? parsed
      : (parsed.flashcards ?? parsed.cards ?? []);

    if (!cards.length) return err("Failed to generate flashcards", 500);

    return ok(cards);
  } catch (error) {
    return serverError("api/ai/flashcards", error);
  }
}
