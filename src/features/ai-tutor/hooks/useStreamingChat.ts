"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, Subject, CEFRLevel } from "@/shared/types/global.types";
import { Lesson } from "@/shared/types/curriculum.types";
import { FeedbackData } from "../types/tutor.types";
import { generateId } from "@/shared/lib/utils";

interface UseStreamingChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

interface UseStreamingChatOptions {
  subject: Subject;
  level: CEFRLevel;
  lesson?: Lesson;
  onToken?: (token: string) => void;
  onComplete?: (fullText: string, feedback: FeedbackData | null) => void;
}

/** Parse <feedback>...</feedback> block from LLM response */
function parseFeedback(text: string): {
  clean: string;
  feedback: FeedbackData | null;
} {
  const match = text.match(/<feedback>([\s\S]*?)<\/feedback>/);
  if (!match) return { clean: text.trim(), feedback: null };

  const clean = text.replace(/<feedback>[\s\S]*?<\/feedback>/, "").trim();
  const block = match[1];

  const getNum = (key: string) => {
    const m = block.match(new RegExp(`${key}:\\s*(\\d+)`));
    return m ? parseInt(m[1], 10) : 0;
  };
  const getList = (key: string): string[] => {
    const m = block.match(new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`));
    if (!m) return [];
    return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
  };

  return {
    clean,
    feedback: {
      pronunciation_score: getNum("pronunciation_score"),
      grammar_score: getNum("grammar_score"),
      errors: getList("errors"),
      suggestions: getList("suggestions"),
    },
  };
}

export function useStreamingChat({
  subject,
  level,
  lesson,
  onToken,
  onComplete,
}: UseStreamingChatOptions): UseStreamingChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;
      setError(null);

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      const assistantId = generateId();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            subject,
            level,
            lesson,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? "Chat request failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") break;

            try {
              const { token } = JSON.parse(raw) as { token: string };
              fullText += token;
              onToken?.(token);

              // Update assistant message in real-time
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullText } : m
                )
              );
            } catch {
              // Skip malformed chunk
            }
          }
        }

        // Parse feedback tags from final text
        const { clean, feedback } = parseFeedback(fullText);

        // Update message with clean text + feedback
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: clean, feedback: feedback ?? undefined }
              : m
          )
        );

        onComplete?.(clean, feedback);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        // Remove the empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, subject, level, lesson, isStreaming, onToken, onComplete]
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, error, sendMessage, clearMessages };
}
