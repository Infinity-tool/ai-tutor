"use client";

import React from "react";
import Link from "next/link";
import { AnimatedCounter } from "@/shared/components/ui/AnimatedCounter";

const FEATURES = [
  { icon: "🎙️", title: "Real-time AI Suhbat",     desc: "Gapirib yuboring — AI darhol javob beradi va xatolaringizni tuzatadi",    color: "#00d4aa" },
  { icon: "📊", title: "Pronunciation Feedback",  desc: "Har gapdan so'ng talaffuz va grammatika bali ko'rsatiladi",              color: "#8b5cf6" },
  { icon: "📈", title: "Smart Statistika",         desc: "Streak, CEFR daraja o'sishi, haftalik hisobot — barchasi bir joyda",     color: "#10b981" },
  { icon: "🌍", title: "5 Ta Fan",                desc: "Ingliz, Rus, Nemis, Turk tillari va to'liq Matematika kursi",             color: "#ff6b35" },
];

const SUBJECTS = [
  { flag: "🇬🇧", label: "Ingliz tili", color: "#3b82f6" },
  { flag: "🇷🇺", label: "Rus tili",    color: "#ef4444" },
  { flag: "🇩🇪", label: "Nemis tili",  color: "#f59e0b" },
  { flag: "🇹🇷", label: "Turk tili",   color: "#ec4899" },
  { flag: "∑",   label: "Matematika",  color: "#8b5cf6" },
];

const PLANS = [
  {
    name: "Bepul", price: "0",
    features: ["5 dars/oy", "Ingliz tili", "Asosiy statistika", "Quiz"],
    popular: false,
  },
  {
    name: "Pro", price: "29",
    features: ["Cheksiz darslar", "Barcha 5 fan", "To'liq statistika", "Avatar suhbat", "Ovozli feedback"],
    popular: true,
  },
  {
    name: "Premium", price: "59",
    features: ["Hamma Pro xususiyatlar", "Voice cloning", "PDF hisobotlar", "Shaxsiy o'quv yo'li", "24/7 qo'llab-quvvatlash"],
    popular: false,
  },
];

export function LandingAnimated() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f4ff] overflow-x-hidden">

      {/* Grid bg */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,170,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,170,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow orbs */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px]" style={{ background: "rgba(0,212,170,0.08)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "rgba(139,92,246,0.06)" }} />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-[#0a0a0f]"
            style={{ background: "linear-gradient(135deg,#00d4aa,#8b5cf6)" }}>
            ST
          </div>
          <span className="font-bold text-[#f0f4ff]">
            Super<span style={{ color: "#00d4aa" }}>Tutor</span> AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#94a3b8] hover:text-white transition-colors hidden sm:block">
            Kirish
          </Link>
          <Link
            href="/register"
            className="landing-cta-btn px-4 py-2 rounded-xl text-sm font-bold text-[#0a0a0f]"
            style={{ background: "linear-gradient(135deg,#00d4aa,#8b5cf6)" }}
          >
            Bepul boshlash
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 text-center px-4 pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,212,170,0.3)] bg-[rgba(0,212,170,0.08)] text-sm text-[#00d4aa] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          AI bilan o&apos;rganish — Hozir mavjud
        </div>

        <h1 className="font-bold leading-tight mb-5">
          <span
            className="block text-4xl sm:text-6xl lg:text-7xl shimmer-text"
          >
            Kelajak o&apos;qituvchingiz
          </span>
          <span className="block text-2xl sm:text-4xl mt-2 font-medium text-[#94a3b8]">
            24/7 tayyor
          </span>
        </h1>

        <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          5 ta fan — ingliz, rus, nemis, turk tillari va matematika.
          Real-time ovozli feedback, live AI avatar, batafsil statistika.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="landing-cta-btn w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-[#0a0a0f]"
            style={{ background: "linear-gradient(135deg,#00d4aa,#8b5cf6)" }}
          >
            Bepul boshlash →
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 text-[#94a3b8] font-medium hover:bg-white/5 hover:text-white transition-all text-base"
          >
            Kirish
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="relative z-10 border-y border-white/5 bg-white/[0.02] py-5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-16 px-4">
          {[
            { to: 10000, suffix: "+", label: "O'quvchi" },
            { to: 50000, suffix: "+", label: "Suhbatlar" },
            { to: 5,     suffix: " ta", label: "Fan" },
            { to: 24,    suffix: "/7", label: "Mavjud" },
          ].map(({ to, suffix, label }) => (
            <div key={label} className="text-center">
              <AnimatedCounter
                to={to} suffix={suffix}
                className="text-2xl font-bold block shimmer-text"
              />
              <p className="text-xs text-[#475569] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUBJECTS ── */}
      <section className="relative z-10 px-4 py-14 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">5 ta fan, 1 ta platforma</h2>
        <p className="text-[#94a3b8] text-center text-sm mb-8">CEFR darajalari A1–C2 · Har daraja uchun maxsus darslar</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-5 sm:overflow-visible snap-x">
          {SUBJECTS.map(({ flag, label, color }) => (
            <div
              key={label}
              className="subject-card flex-shrink-0 snap-start sm:flex-shrink sm:snap-none flex flex-col items-center gap-2 p-4 rounded-2xl border min-w-[120px] sm:min-w-0 cursor-default"
              style={{
                background: `${color}08`,
                borderColor: `${color}25`,
                "--card-glow": color,
              } as React.CSSProperties}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                {flag}
              </div>
              <p className="text-sm font-semibold text-[#f0f4ff] text-center">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-4 py-14 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Hamma kerakli narsa</h2>
        <p className="text-[#94a3b8] text-center text-sm mb-10">Zamonaviy AI texnologiyalari bilan kuchaytirilgan</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="feature-card p-6 rounded-2xl border space-y-3 cursor-default"
              style={{
                background: `${color}06`,
                borderColor: `${color}20`,
                "--card-color": color,
              } as React.CSSProperties}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                {icon}
              </div>
              <h3 className="font-bold text-[#f0f4ff]">{title}</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="relative z-10 px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Narxlar</h2>
        <p className="text-[#94a3b8] text-center text-sm mb-10">Bepul boshlang, keyin oshiring</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map(({ name, price, features, popular }) => (
            <div
              key={name}
              className="relative flex flex-col p-6 rounded-2xl border backdrop-blur-xl"
              style={{
                background: popular ? "rgba(0,212,170,0.06)" : "rgba(255,255,255,0.03)",
                borderColor: popular ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.08)",
                boxShadow: popular ? "0 0 40px rgba(0,212,170,0.15)" : "none",
              }}
            >
              {popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-[#0a0a0f]"
                  style={{ background: "linear-gradient(135deg,#00d4aa,#8b5cf6)" }}
                >
                  Eng mashhur
                </span>
              )}
              <div className="mb-5">
                <p className="text-sm font-semibold text-[#94a3b8]">{name}</p>
                <p className="text-4xl font-bold text-[#f0f4ff] mt-1">
                  ${price}
                  <span className="text-sm font-normal text-[#475569]">/oy</span>
                </p>
              </div>
              <ul className="flex-1 space-y-2.5 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#00d4aa" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="text-center py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 block"
                style={
                  popular
                    ? { background: "linear-gradient(135deg,#00d4aa,#8b5cf6)", color: "#0a0a0f" }
                    : { background: "rgba(255,255,255,0.06)", color: "#f0f4ff", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {popular ? "Pro ni olish" : name === "Bepul" ? "Boshlash" : "Premium olish"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-4 py-14 text-center">
        <div
          className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl border backdrop-blur-xl space-y-4"
          style={{
            background: "rgba(0,212,170,0.05)",
            borderColor: "rgba(0,212,170,0.25)",
            boxShadow: "0 0 60px rgba(0,212,170,0.1)",
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f4ff]">Bugun boshlaysizmi?</h2>
          <p className="text-[#94a3b8] text-sm">Ro&apos;yxatdan o&apos;tish bepul. Kredit karta kerak emas.</p>
          <Link
            href="/register"
            className="landing-cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-[#0a0a0f]"
            style={{ background: "linear-gradient(135deg,#00d4aa,#8b5cf6)" }}
          >
            🎓 Bepul ro&apos;yxatdan o&apos;tish
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-4 py-5 text-center text-xs text-[#475569]">
        © {new Date().getFullYear()} SuperTutor AI · 5 ta fan · 24/7 · AI-Powered
      </footer>

      {/* CSS hover effects — pure CSS, no JS */}
      <style jsx>{`
        .landing-cta-btn {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .landing-cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0, 212, 170, 0.4);
        }
        .landing-cta-btn:active {
          transform: scale(0.97);
        }

        .subject-card {
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s, background 0.25s;
        }
        .subject-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--card-glow) 30%, transparent);
          border-color: color-mix(in srgb, var(--card-glow) 50%, transparent) !important;
        }

        .feature-card {
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px color-mix(in srgb, var(--card-color) 25%, transparent);
          border-color: color-mix(in srgb, var(--card-color) 40%, transparent) !important;
        }

        .shimmer-text {
          background: linear-gradient(135deg, #f0f4ff 0%, #00d4aa 40%, #8b5cf6 70%, #f0f4ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
