"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Bot, Calculator,
  BarChart3, Trophy, GraduationCap,
  ChevronLeft, ChevronRight, LogOut,
  Brain, Layers,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  labelUz: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",   icon: <LayoutDashboard size={20} />, label: "Dashboard",   labelUz: "Bosh sahifa"   },
  { href: "/tutor",       icon: <Bot size={20} />,             label: "AI Tutor",    labelUz: "AI O'qituvchi" },
  { href: "/quiz",        icon: <Brain size={20} />,           label: "Quiz",        labelUz: "Quiz"          },
  { href: "/flashcards",  icon: <Layers size={20} />,          label: "Flashcards",  labelUz: "Flashcard-lar" },
  { href: "/math",        icon: <Calculator size={20} />,      label: "Math",        labelUz: "Matematika"    },
  { href: "/progress",    icon: <BarChart3 size={20} />,       label: "Progress",    labelUz: "Progress"      },
  { href: "/leaderboard", icon: <Trophy size={20} />,          label: "Leaderboard", labelUz: "Reyting"       },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-[rgba(0,229,255,0.12)] bg-[rgba(8,7,16,0.85)] backdrop-blur-[20px] transition-all duration-300 z-40 flex-shrink-0"
      style={{ width: collapsed ? "72px" : "216px" }}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(0,229,255,0.1)] overflow-hidden flex-shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-cyan"
          style={{ background: "linear-gradient(135deg, #00E5FF, #00FF66)" }}>
          <GraduationCap size={18} className="text-[#080710]" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-sm text-[var(--text-primary)] whitespace-nowrap">
            Super<span className="text-[var(--accent-cyan)]">Tutor</span> AI
          </span>
        )}
      </div>

      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(({ href, icon, labelUz }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? labelUz : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative overflow-hidden"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(0,255,102,0.05) 100%)"
                  : "transparent",
                color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                borderLeft: `2px solid ${isActive ? "var(--accent-cyan)" : "transparent"}`,
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {!isActive && (
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[rgba(0,229,255,0.04)]" />
              )}
              <span
                className="flex-shrink-0 transition-all group-hover:scale-110"
                style={{ color: isActive ? "var(--accent-cyan)" : "var(--text-muted)" }}
              >
                {icon}
              </span>
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{labelUz}</span>
              )}
              {isActive && !collapsed && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2.5 border-t border-[rgba(0,229,255,0.1)] space-y-2 flex-shrink-0">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--accent-cyan)] transition-all"
          aria-label={collapsed ? "Kengaytirish" : "Yig'ish"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {session?.user && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-card)] border border-[rgba(0,229,255,0.15)]">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-[#080710] text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #00E5FF, #00FF66)" }}>
              {session.user.image ? (
                <Image src={session.user.image} alt="" width={32} height={32} className="object-cover" />
              ) : (
                session.user.name?.charAt(0).toUpperCase() ?? "U"
              )}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {session.user.name ?? "Foydalanuvchi"}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">{session.user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex-shrink-0 p-1 text-[var(--text-muted)] hover:text-[var(--accent-danger)] transition-colors"
                  aria-label="Chiqish"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
