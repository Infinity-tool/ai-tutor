"use client";

import React, { useState } from "react";
import { Flashcard } from "@/shared/types/global.types";
import { RotateCcw, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

interface FlashcardDeckProps {
  cards: Flashcard[];
  onMastered: (id: string) => void;
  onNeedsReview: (id: string) => void;
}

export function FlashcardDeck({ cards, onMastered, onNeedsReview }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = cards[currentIndex];
  if (!card || done) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-4xl">🎉</p>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Kartochkalar tugadi!</h3>
        <p className="text-[var(--text-secondary)] text-sm">Barcha kartochkalarni ko'rib chiqdingiz</p>
        <button
          onClick={() => { setCurrentIndex(0); setIsFlipped(false); setDone(false); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold"
        >
          <RefreshCw size={16} /> Qaytadan boshlash
        </button>
      </div>
    );
  }

  const handleNext = (mastered: boolean) => {
    if (mastered) onMastered(card.id);
    else onNeedsReview(card.id);

    if (currentIndex >= cards.length - 1) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{currentIndex + 1} / {cards.length}</span>
        <div className="flex-1 mx-4 h-1.5 bg-[var(--border-glass)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
        <span>{card.topic}</span>
      </div>

      {/* Card */}
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: "1000px", minHeight: "220px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "220px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs text-[var(--text-muted)] mb-4 uppercase tracking-wide">Ko'ring (bosing)</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{card.front}</p>
            <div className="mt-4 flex items-center gap-1.5 text-[var(--text-muted)] text-xs">
              <RotateCcw size={12} /> Javobni ko'rish uchun bosing
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-[rgba(108,99,255,0.3)] bg-[rgba(108,99,255,0.06)] flex flex-col items-center justify-center p-8 text-center gap-3"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xl font-semibold text-[var(--text-primary)]">{card.back}</p>
            {card.back_uz && (
              <p className="text-sm text-[var(--text-muted)] border-t border-[var(--border-glass)] pt-3 w-full">
                🇺🇿 {card.back_uz}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions — only show when flipped */}
      {isFlipped && (
        <div className="flex gap-3 animate-fade-in">
          <button
            onClick={() => handleNext(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.3)] text-[var(--accent-danger)] font-medium text-sm hover:bg-[rgba(255,82,82,0.15)] transition-colors"
          >
            <ThumbsDown size={16} /> Bilmadim
          </button>
          <button
            onClick={() => handleNext(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.3)] text-[var(--accent-success)] font-medium text-sm hover:bg-[rgba(0,230,118,0.15)] transition-colors"
          >
            <ThumbsUp size={16} /> Bildim!
          </button>
        </div>
      )}
    </div>
  );
}
