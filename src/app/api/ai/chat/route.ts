/**
 * POST /api/ai/chat
 *
 * Streams LLM response via SSE (text/event-stream).
 * Primary: Groq | Fallback: Together AI
 *
 * Request body: { messages, subject, level }
 * Response: SSE stream — data: { token: "..." } ... data: [DONE]
 */
import { NextRequest } from "next/server";
import { streamChat } from "@/features/ai-tutor/services/llm.service";
import { SUBJECTS } from "@/shared/types/global.types";
import { Lesson } from "@/shared/types/curriculum.types";

const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, subject, level, lesson } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!SUBJECTS.includes(subject)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid subject" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!VALID_LEVELS.includes(level)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid level" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = await streamChat({ messages, subject, level, lesson });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[api/ai/chat]", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "LLM error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
