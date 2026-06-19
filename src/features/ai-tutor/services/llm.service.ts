/**
 * LLM Service — server-side only
 * Primary: Groq (llama-3.1-70b-versatile) — ultra-fast inference
 * Fallback: Together AI (llama-3.1-70b) — on Groq rate limit / error
 *
 * Called from: /api/ai/chat/route.ts
 */
import Groq from "groq-sdk";
import { buildTutorPrompt } from "./prompts/base.prompt";
import { Subject, CEFRLevel } from "@/shared/types/global.types";
import { Lesson } from "@/shared/types/curriculum.types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamChatOptions {
  messages: LLMMessage[];
  subject: Subject;
  level: CEFRLevel;
  lesson?: Lesson;
  userLanguage?: string;
}

/**
 * Stream chat response via Groq (primary) with Together AI fallback.
 * Returns a ReadableStream of text tokens.
 */
export async function streamChat(
  options: StreamChatOptions
): Promise<ReadableStream<Uint8Array>> {
  const { messages, subject, level, lesson, userLanguage } = options;
  const systemPrompt = buildTutorPrompt(subject, level, userLanguage !== "en", lesson);

  const allMessages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const encoder = new TextEncoder();

  try {
    // ── Primary: Groq ──────────────────────────────────────────
    const groqStream = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: allMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of groqStream) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  } catch (groqError) {
    // ── Fallback: Together AI ──────────────────────────────────
    console.warn("[llm.service] Groq failed, falling back to Together AI:", groqError);

    if (!process.env.TOGETHER_AI_API_KEY) {
      throw new Error("Both Groq and Together AI are unavailable.");
    }

    const togetherRes = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!togetherRes.ok || !togetherRes.body) {
      throw new Error(`Together AI error: ${togetherRes.status}`);
    }

    const reader = togetherRes.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            const lines = text.split("\n").filter((l) => l.startsWith("data: "));

            for (const line of lines) {
              const raw = line.slice(6).trim();
              if (raw === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                break;
              }
              try {
                const parsed = JSON.parse(raw);
                const token = parsed.choices?.[0]?.delta?.content ?? "";
                if (token) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  }
}
