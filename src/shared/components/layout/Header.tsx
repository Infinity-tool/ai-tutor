"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useUserStore } from "@/shared/store/user.store";
import { Flame, Star, LogOut, GraduationCap } from "lucide-react";

const PAGE_TITLES: Record<string, { en: string; uz: string }> = {
  "/dashboard":   { en: "Dashboard",  uz: "Bosh sahifa"   },
  "/tutor":       { en: "AI Tutor",   uz: "AI O'qituvchi" },
  "/math":        { en: "Math Tutor", uz: "Matematika"    },
  "/progress":    { en: "Progress",   uz: "Progress"      },
  "/leaderboard": { en: "Leaderboard",uz: "Reyting"       },
  "/quiz":        { en: "Quiz",       uz: "Quiz"          },
  "/flashcards":  { en: "Flashcards", uz: "Flashcard-lar" },
  "/settings":    { en: "Settings",   uz: "Sozlamalar"    },
};

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { points, streak } = useUserStore();
  const pageInfo = PAGE_TITLES[pathname];

  return (
    <header className="h-14 sm:h-16 border-b border-[rgba(0,229,255,0.12)] bg-[rgba(8,7,16,0.85)] backdrop-blur-[20px] flex items-center px-3 sm:px-6 gap-3 sticky top-0 z-30">
      <Link href="/dashboard" className="lg:hidden flex-shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-glow-cyan"
          style={{ background: "linear-gradient(135deg, #00E5FF, #00FF66)" }}>
          <GraduationCap size={16} className="text-[#080710]" />
        </div>
      </Link>

      {pageInfo && (
        <div className="hidden sm:block">
          <h1 className="font-display font-bold text-base text-[var(--text-primary)] leading-tight">
            {pageInfo.uz}
          </h1>
          <p className="text-[10px] text-[var(--text-muted)] leading-none">{pageInfo.en}</p>
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[rgba(255,90,0,0.08)] border border-[rgba(255,90,0,0.2)]">
        <Flame size={14} className="text-[var(--accent-orange)]" />
        <span className="text-sm font-bold font-display text-[var(--accent-orange)]">{streak}</span>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.2)]">
        <Star size={14} className="text-[var(--accent-cyan)]" />
        <span className="text-sm font-bold font-display text-[var(--accent-cyan)]">
          {points >= 1000 ? `${(points / 1000).toFixed(1)}K` : points}
        </span>
      </div>

      {session?.user && (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-danger)] hover:bg-[rgba(255,51,102,0.08)] transition-all"
          aria-label="Chiqish"
        >
          <LogOut size={16} />
        </button>
      )}
    </header>
  );
}
