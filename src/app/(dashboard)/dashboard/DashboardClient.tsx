"use client";

import React from "react";
import Link from "next/link";
import { GlowCard } from "@/shared/components/ui/GlowCard";
import { AnimatedCounter } from "@/shared/components/ui/AnimatedCounter";
import { HologramRing } from "@/shared/components/ui/HologramRing";
import { useStatistics } from "@/features/statistics/hooks/useStatistics";
import {
  Clock, BookOpen, Target, Flame,
  Zap, Brain, Layers, BarChart3, Trophy,
  ArrowRight, Play, MessageCircle,
} from "lucide-react";

// ── Mock data (API bo'lmaguncha) ──────────────────────────────────────────────
const MOCK_STATS = {
  hours: 24.5, sessions: 47, accuracy: 87, streak: 12, bestStreak: 18,
  weekly: [
    { day: "Dush", min: 45 }, { day: "Sesh", min: 62 }, { day: "Chor", min: 38 },
    { day: "Pay",  min: 75 }, { day: "Jum",  min: 90 }, { day: "Sha",  min: 55 },
    { day: "Yak",  min: 30 },
  ],
};

const SKILLS = [
  { id: "A1", done: true,    active: false, x: 12, y: 78 },
  { id: "A2", done: true,    active: true,  x: 30, y: 58 },
  { id: "B1", done: false,   active: false, x: 50, y: 42 },
  { id: "B2", done: false,   active: false, x: 68, y: 28 },
  { id: "C1", done: false,   active: false, x: 83, y: 16 },
];
const LINKS = [["A1","A2"],["A2","B1"],["B1","B2"],["B2","C1"]];

// ── Fan kartalari ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { href: "/tutor?subject=english", flag: "🇬🇧", label: "Ingliz",   glow: "#3b82f6", sessions: 18 },
  { href: "/tutor?subject=russian", flag: "🇷🇺", label: "Rus",      glow: "#ef4444", sessions: 12 },
  { href: "/tutor?subject=german",  flag: "🇩🇪", label: "Nemis",    glow: "#f59e0b", sessions: 8  },
  { href: "/tutor?subject=turkish", flag: "🇹🇷", label: "Turk",     glow: "#ec4899", sessions: 5  },
  { href: "/math",                  flag: "∑",   label: "Matematika", glow: "#8b5cf6", sessions: 4 },
];

const FEATURES = [
  { href: "/quiz",        Icon: Brain,    label: "Quiz",         sub: "Bilimingizni sinab ko'ring",    howto: "Fan → Daraja → Mavzu → Boshlash",         color: "#00d4aa" },
  { href: "/flashcards",  Icon: Layers,   label: "Flashcard",    sub: "Kartochkalar bilan o'rganing",  howto: "Fan → Mavzu → Ayirish",                   color: "#8b5cf6" },
  { href: "/progress",    Icon: BarChart3, label: "Statistika",  sub: "Haftalik progress va streak",   howto: "Har darsdan so'ng avtomatik yangilanadi",  color: "#10b981" },
  { href: "/leaderboard", Icon: Trophy,   label: "Reyting",      sub: "Boshqalar bilan solishtiring",  howto: "Ball yig'ing → Reytingda ko'taring",       color: "#ff6b35" },
];

// ── Weekly mini bar chart (CSS only) ─────────────────────────────────────────
function WeeklyChart() {
  const max = Math.max(...MOCK_STATS.weekly.map(d => d.min));
  const total = MOCK_STATS.weekly.reduce((a, b) => a + b.min, 0);

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Haftalik Analitika</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(0,212,170,0.15)] text-[#00d4aa] font-semibold">
          Bu hafta: {(total / 60).toFixed(1)} soat
        </span>
      </div>
      <div className="flex-1 flex items-end gap-2 min-h-[120px]">
        {MOCK_STATS.weekly.map(({ day, min }) => {
          const pct = (min / max) * 100;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex flex-col justify-end" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-125 relative overflow-hidden"
                  style={{ height: `${Math.max(pct, 8)}%`, background: "linear-gradient(to top, rgba(0,212,170,0.8), rgba(0,212,170,0.2))" }}
                >
                  {/* Top glow line */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-[#00d4aa] rounded" />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f0f1a] border border-[rgba(0,212,170,0.3)] text-xs text-[#00d4aa] px-2 py-0.5 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                  {min} daq
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Skills Tree (SVG) ─────────────────────────────────────────────────────────
function SkillsTree() {
  const nodeMap = Object.fromEntries(SKILLS.map(n => [n.id, n]));
  return (
    <div className="space-y-3 h-full flex flex-col">
      <h3 className="text-sm font-bold text-[var(--text-primary)]">CEFR Ko&apos;nikmalar</h3>
      <div className="flex-1 relative min-h-[180px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {LINKS.map(([from, to]) => {
            const a = nodeMap[from], b = nodeMap[to];
            if (!a || !b) return null;
            return (
              <line key={`${from}-${to}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={a.done && b.done ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.08)"}
                strokeWidth="0.5"
                strokeDasharray={a.done && b.done ? "none" : "2,2"}
              />
            );
          })}
        </svg>

        {SKILLS.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 group-hover:scale-110"
              style={{
                background: node.done
                  ? node.active ? "rgba(0,212,170,0.25)" : "rgba(0,212,170,0.12)"
                  : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${node.active ? "#00d4aa" : node.done ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.1)"}`,
                color: node.done ? "#00d4aa" : "var(--text-muted)",
                boxShadow: node.active ? "0 0 16px rgba(0,212,170,0.5)" : "none",
                animation: node.active ? "glow-pulse 2s ease-in-out infinite" : undefined,
              }}
            >
              {node.id}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f0f1a] border border-[rgba(0,212,170,0.3)] text-[10px] text-[var(--text-primary)] px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none">
              {node.done ? (node.active ? "Hozirgi daraja ✓" : "Bajarildi ✓") : "3 ta dars qoldi 🔒"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function DashboardClient({ userName }: { userName: string }) {
  const { data: stats } = useStatistics();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Xayrli tong" : hour < 17 ? "Xayrli kun" : "Xayrli kech";

  // Use real stats if available, else mock
  const hours    = stats ? Math.round(stats.total_hours * 10) / 10 : MOCK_STATS.hours;
  const sessions = stats?.total_sessions ?? MOCK_STATS.sessions;
  const streak   = stats?.current_streak ?? MOCK_STATS.streak;
  const avgScore = stats && stats.subject_stats.length > 0
    ? Math.round(stats.subject_stats.reduce((a, s) => a + ((s.grammar_score ?? 0) + (s.pronunciation_score ?? 0)) / 2, 0) / stats.subject_stats.length)
    : MOCK_STATS.accuracy;

  return (
    <div className="relative z-10 space-y-6 max-w-7xl mx-auto animate-fade-in pb-8">

      {/* ── GREETING ────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-[#00d4aa] uppercase tracking-widest mb-1">SuperTutor AI</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {greeting}, <span className="gradient-text">{userName}</span> 👋
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Bugun ham yangi bilim olishga tayyormisiz?</p>
        </div>
        <GlowCard glow="orange" className="px-4 py-3 flex items-center gap-3">
          <Flame size={20} style={{ color: "#ff6b35" }} className="animate-flame" />
          <div>
            <AnimatedCounter to={streak} suffix=" kun" className="text-xl font-bold text-[#ff6b35]" />
            <p className="text-[10px] text-[var(--text-muted)]">ketma-ket streak 🔥</p>
          </div>
        </GlowCard>
      </div>

      {/* ── STATS ROW ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { Icon: Clock,    label: "Soat o'qilgan",   to: hours,    suffix: " soat", decimals: 1, glow: "cyan"   as const, color: "#00d4aa" },
          { Icon: BookOpen, label: "Darslar soni",     to: sessions, suffix: " ta",   decimals: 0, glow: "purple" as const, color: "#8b5cf6" },
          { Icon: Target,   label: "O'rtacha aniqlik", to: avgScore, suffix: "%",     decimals: 0, glow: "green"  as const, color: "#10b981" },
          { Icon: Flame,    label: "Rekord streak",    to: MOCK_STATS.bestStreak, suffix: " kun", decimals: 0, glow: "orange" as const, color: "#ff6b35" },
        ].map(({ Icon, label, to, suffix, decimals, glow, color }) => (
          <GlowCard key={label} glow={glow} leftBorder className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Icon size={18} style={{ color }} />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Bu oy</span>
            </div>
            <AnimatedCounter
              to={to} suffix={suffix} decimals={decimals}
              className="text-3xl font-bold block"
              style={{ color } as React.CSSProperties}
            />
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
          </GlowCard>
        ))}
      </div>

      {/* ── BENTO — Avatar + Chart + Skills ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Avatar */}
        <div className="md:col-span-4">
          <GlowCard glow="cyan" className="p-5 h-full min-h-[320px]">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">AI Avatar</p>
            <HologramRing name="Alex" status="ready" />
          </GlowCard>
        </div>

        {/* Chart */}
        <div className="md:col-span-5">
          <GlowCard glow="cyan" className="p-5 h-full min-h-[280px]">
            <WeeklyChart />
          </GlowCard>
        </div>

        {/* Skills tree */}
        <div className="md:col-span-3">
          <GlowCard glow="purple" className="p-5 h-full min-h-[280px]">
            <SkillsTree />
          </GlowCard>
        </div>
      </div>

      {/* ── FAN KARTALARI ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} className="text-[#00d4aa]" />
          <p className="text-sm font-bold text-[var(--text-primary)]">Fanlar — Darsni boshlash</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBJECTS.map(({ href, flag, label, glow, sessions }) => (
            <Link key={href} href={href} className="group">
              <div
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 active:scale-95 cursor-pointer"
                style={{ background: `${glow}08`, borderColor: `${glow}25` }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 8px 32px ${glow}35`;
                  el.style.borderColor = `${glow}55`;
                  el.style.background = `${glow}12`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = "none";
                  el.style.borderColor = `${glow}25`;
                  el.style.background = `${glow}08`;
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${glow}15`, border: `1px solid ${glow}30` }}
                >
                  {flag}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[var(--text-primary)]">{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: glow }}>{sessions} dars ✓</p>
                </div>
                <span
                  className="text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: glow }}
                >
                  <Play size={9} /> Davom ettirish
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── XIZMATLAR ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={14} className="text-[#8b5cf6]" />
          <p className="text-sm font-bold text-[var(--text-primary)]">O&apos;rganish vositalari</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ href, Icon, label, sub, howto, color }) => (
            <Link key={href} href={href} className="group">
              <div
                className="flex flex-col gap-4 p-5 rounded-2xl border h-full transition-all duration-300 hover:-translate-y-1.5 active:scale-95"
                style={{ background: `${color}06`, borderColor: `${color}20` }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 12px 40px ${color}25`;
                  el.style.borderColor = `${color}45`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = "none";
                  el.style.borderColor = `${color}20`;
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="font-bold text-[var(--text-primary)]">{label}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{sub}</p>
                </div>
                <div className="flex items-start gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                  <MessageCircle size={10} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{howto}</p>
                </div>
                <span className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                  <ArrowRight size={12} /> Ochish
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── YORDAM BANNER ───────────────────────────────────────── */}
      <GlowCard glow="cyan" className="p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,170,0.15)] border border-[rgba(0,212,170,0.3)] flex items-center justify-center flex-shrink-0">
            <MessageCircle size={18} style={{ color: "#00d4aa" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[var(--text-primary)]">Qanday foydalanish kerak?</p>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Fan kartasini bosing → AI tutor ochiladi → Yozing yoki gapirib yuboring → Darhol javob oling
            </p>
          </div>
          <Link
            href="/tutor"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm flex-shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #00d4aa, #8b5cf6)", color: "#0a0a0f" }}
          >
            <Play size={14} /> Hozir sinab ko&apos;ring
          </Link>
        </div>
      </GlowCard>

    </div>
  );
}
