"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, Calculator, BarChart3, Brain,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: <LayoutDashboard size={22} />, label: "Bosh" },
  { href: "/tutor",     icon: <Bot size={22} />,             label: "Tutor" },
  { href: "/quiz",      icon: <Brain size={22} />,           label: "Quiz" },
  { href: "/math",      icon: <Calculator size={22} />,      label: "Math" },
  { href: "/progress",  icon: <BarChart3 size={22} />,       label: "Progress" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(0,229,255,0.15)]"
      style={{
        background: "rgba(8,7,16,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }}
                />
              )}
              <span
                style={{
                  color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                  filter: isActive ? "drop-shadow(0 0 8px rgba(0,229,255,0.8))" : "none",
                  transition: "color 0.2s, filter 0.2s",
                }}
              >
                {icon}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "var(--accent-cyan)" : "var(--text-muted)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
