import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/shared/lib/api-helpers";
import { buildQuizPrompt } from "@/features/ai-tutor/services/prompts/base.prompt";
import { SUBJECTS, CEFR_LEVELS } from "@/shared/types/global.types";
import { generateId } from "@/shared/lib/utils";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return err("GROQ_API_KEY not configured", 500);
    }

    const body = await req.json();
    const { subject, level, topic, count = 5 } = body;

    if (!SUBJECTS.includes(subject)) return err("Invalid subject", 400);
    if (!CEFR_LEVELS.includes(level)) return err("Invalid level", 400);
    if (!topic) return err("Topic is required", 400);

    const systemPrompt = buildQuizPrompt(subject, level, topic);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} different quiz questions about "${topic}". Return a JSON array of ${count} questions following the exact format specified.` },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    // Handle both { questions: [...] } and direct array
    const questionsRaw: unknown[] = Array.isArray(parsed)
      ? parsed
      : (parsed.questions ?? [parsed]);

    const questions = questionsRaw.map((q: unknown) => {
      const qObj = q as Record<string, unknown>;
      return {
        id: generateId(),
        question: String(qObj.question ?? ""),
        options: Array.isArray(qObj.options) ? qObj.options.map(String) : [],
        correct_index: Number(qObj.correct_index ?? 0),
        explanation: String(qObj.explanation ?? ""),
        explanation_uz: String(qObj.explanation_uz ?? ""),
        topic,
      };
    }).filter((q) => q.question && q.options.length === 4);

    if (questions.length === 0) {
      return err("Failed to generate valid questions", 500);
    }

    return ok(questions);
  } catch (error) {
    return serverError("api/ai/quiz", error);
  }
}
