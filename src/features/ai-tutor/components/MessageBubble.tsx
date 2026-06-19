"use client";

import React from "react";
import { ChatMessage } from "@/shared/types/global.types";
import { FeedbackPanel } from "./FeedbackPanel";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
      aria-label={`${isUser ? "You" : "AI Tutor"}: ${message.content}`}
    >
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {/* Avatar label */}
        <span className="text-[10px] text-[var(--text-muted)] px-1">
          {isUser ? "You" : "AI Tutor"}
        </span>

        {/* Bubble */}
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={{
            background: isUser
              ? "var(--accent-primary)"
              : "var(--bg-card)",
            color: isUser ? "white" : "var(--text-primary)",
            border: isUser ? "none" : "1px solid var(--border-glass)",
            borderBottomRightRadius: isUser ? "4px" : "16px",
            borderBottomLeftRadius: isUser ? "16px" : "4px",
          }}
        >
          {message.content}
          {/* Streaming cursor */}
          {isStreaming && (
            <span
              aria-hidden="true"
              className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse"
            />
          )}
        </div>

        {/* Feedback panel for AI messages */}
        {!isUser && message.feedback && (
          <div className="w-full">
            <FeedbackPanel feedback={message.feedback as any} />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-[var(--text-muted)] px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
