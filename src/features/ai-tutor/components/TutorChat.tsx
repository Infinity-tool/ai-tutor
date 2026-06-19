"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStreamingChat } from "../hooks/useStreamingChat";
import { useTutorSession } from "../hooks/useTutorSession";
import { useSpeechToText } from "@/features/voice/hooks/useSpeechToText";
import { useTextToSpeech } from "@/features/voice/hooks/useTextToSpeech";
import { MessageBubble } from "./MessageBubble";
import { SubjectSelector } from "./SubjectSelector";
import { LevelBadge } from "./LevelBadge";

import { Subject, CEFRLevel, SUBJECT_LABELS } from "@/shared/types/global.types";
import { Lesson } from "@/shared/types/curriculum.types";
import { formatDuration } from "@/shared/lib/utils";
import { Send, StopCircle, Clock, BookOpen, Award, Mic } from "lucide-react";

// Dynamic import — AvatarStream, no SSR
const AvatarStream = dynamic(
  () => import("@/features/avatar/components/AvatarStream").then((m) => m.AvatarStream),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[3/4] rounded-2xl skeleton flex items-center justify-center bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-white/10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto animate-pulse text-2xl">
            📚
          </div>
          <p className="text-sm text-white/70 font-medium">Dars uchun tayyorlanmoqda...</p>
        </div>
      </div>
    ),
  }
);

interface TutorChatProps {
  initialSubject?: Subject;
  initialLevel?: CEFRLevel;
  lesson?: Lesson;
}

export function TutorChat({
  initialSubject = "english",
  initialLevel = "A2",
  lesson,
}: TutorChatProps) {
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [level, setLevel] = useState<CEFRLevel>(initialLevel);
  const [textInput, setTextInput] = useState("");
  const [lastAiText, setLastAiText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isActive, elapsedSeconds, startSession, endSession } = useTutorSession();
  const { messages, isStreaming, sendMessage, clearMessages } = useStreamingChat({
    subject,
    level,
    lesson,
    onComplete: (text) => setLastAiText(text),
  });

  const { transcript, isTranscribing, startListening, stopListening, reset: resetTranscript } = useSpeechToText({
    language: subject === "math" ? "en" : subject,
  });
  const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-start lesson when component mounts
  useEffect(() => {
    if (messages.length === 0 && lesson) {
      const introMessage = lesson.title_uz || lesson.title;
      sendMessage(
        `Salom! Bugungi darsimiz "${introMessage}". Keling, birgalikda o'rganaylik! Mavzuga qisqa kirish qilib, keyin mashqlar qilamiz.`
      );
    }
  }, [lesson, sendMessage, messages.length]);

  // Auto-send transcript when available
  useEffect(() => {
    if (transcript) {
      sendMessage(transcript);
      resetTranscript();
    }
  }, [transcript, sendMessage, resetTranscript]);

  const handleSend = async () => {
    const trimmed = textInput.trim();
    if (!trimmed || isStreaming) return;
    setTextInput("");
    await sendMessage(trimmed);
  };

  const toggleListening = () => {
    if (isTranscribing) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleEndSession = async () => {
    stopSpeaking();
    await endSession();
    clearMessages();
  };

  const isDisabled = isStreaming || isTranscribing || isSpeaking;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
      {/* ── LEFT PANEL: Avatar & Lesson Info ────────────────────────────────────────── */}
      <div className="w-full lg:w-96 flex flex-col gap-4 flex-shrink-0">
        {/* Avatar Component */}
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-xl shadow-2xl">
          <AvatarStream autoConnect={true} speakText={lastAiText} />
        </div>

        {/* Lesson Details Card */}
        {lesson && (
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  {lesson.title_uz || lesson.title}
                </h3>
                <p className="text-xs text-white/60">
                  {SUBJECT_LABELS[subject]} · {level}
                </p>
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                O'quv maqsadlar
              </p>
              <ul className="space-y-1">
                {(lesson.objectives_uz || lesson.objectives).map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-orange-400" />
                <span className="text-sm font-mono text-orange-400">
                  {formatDuration(elapsedSeconds)}
                </span>
              </div>
              <button
                onClick={handleEndSession}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all border border-red-500/20"
              >
                <StopCircle size={16} />
                Darsni tugatish
              </button>
            </div>
          </div>
        )}

        {/* Subject/Level Selector (only if no lesson) */}
        {!lesson && (
          <div className="space-y-3">
            <div className="sm:block">
              <SubjectSelector
                value={subject}
                onChange={setSubject}
                disabled={isActive && messages.length > 0}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <LevelBadge level={level} />
              {isActive && (
                <span className="flex items-center gap-1 text-xs font-mono text-orange-400">
                  <Clock size={12} />
                  {formatDuration(elapsedSeconds)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL: Chat & Interaction ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">👨‍🏫</span>
              O'qituvchi bilan suhbat
            </h2>
            {lesson && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <Award size={14} className="text-green-400" />
                <span className="text-xs font-medium text-green-400">
                  Dars davom etmoqda
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar min-h-0">
          {messages.length === 0 && !lesson && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="text-7xl animate-bounce">🎓</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {SUBJECT_LABELS[subject]} darsini boshlashga tayyormisiz?
                </h3>
                <p className="text-white/70 max-w-md">
                  O'z savollaringizni yozing yoki mikrofon tugmasini bosib gapiring.
                  O'qituvchi sizga yordam beradi!
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={
                isStreaming &&
                i === messages.length - 1 &&
                msg.role === "assistant"
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              disabled={isDisabled}
              className={`p-4 rounded-2xl transition-all shadow-lg ${
                isTranscribing
                  ? "bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700 animate-pulse shadow-red-500/25"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-blue-500/25"
              }`}
            >
              <Mic size={20} />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Savolingizni yoki xabaringizni yozing..."
                disabled={isDisabled}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={isDisabled || !textInput.trim()}
              className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
