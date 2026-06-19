"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkillNode {
  id: string;
  label: string;
  level: string;
  unlocked: boolean;
  active: boolean;
  x: number;
  y: number;
  color: "cyan" | "green";
}

const NODES: SkillNode[] = [
  { id: "a1", label: "A1", level: "Boshlang'ich", unlocked: true, active: false, x: 10, y: 80, color: "cyan" },
  { id: "a2", label: "A2", level: "Elementary", unlocked: true, active: false, x: 25, y: 60, color: "cyan" },
  { id: "b1", label: "B1", level: "Intermediate", unlocked: true, active: true, x: 45, y: 45, color: "cyan" },
  { id: "b2", label: "B2", level: "Upper-Int", unlocked: false, active: false, x: 65, y: 30, color: "cyan" },
  { id: "c1", label: "C1", level: "Advanced", unlocked: false, active: false, x: 82, y: 18, color: "green" },
  { id: "math", label: "📐", level: "Math", unlocked: true, active: false, x: 30, y: 25, color: "green" },
];

const CONNECTIONS = [
  ["a1", "a2"], ["a2", "b1"], ["b1", "b2"], ["b2", "c1"], ["a2", "math"], ["math", "b1"],
];

export function SkillTree() {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full h-full min-h-[200px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONNECTIONS.map(([from, to]) => {
          const a = nodeMap[from];
          const b = nodeMap[to];
          if (!a || !b) return null;
          const active = a.unlocked && b.unlocked;
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? "rgba(0,229,255,0.5)" : "rgba(255,255,255,0.08)"}
              strokeWidth="0.4"
              strokeDasharray={active ? "none" : "2,2"}
            />
          );
        })}
      </svg>

      {NODES.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, type: "spring" }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <div
            className={`relative flex flex-col items-center gap-0.5 ${node.active ? "animate-node-pulse" : ""}`}
            title={node.level}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-display transition-all"
              style={{
                background: node.unlocked
                  ? node.color === "cyan"
                    ? "rgba(0,229,255,0.15)"
                    : "rgba(0,255,102,0.15)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  node.active
                    ? "#00E5FF"
                    : node.unlocked
                    ? node.color === "cyan"
                      ? "rgba(0,229,255,0.5)"
                      : "rgba(0,255,102,0.5)"
                    : "rgba(255,255,255,0.1)"
                }`,
                color: node.unlocked
                  ? node.color === "cyan"
                    ? "#00E5FF"
                    : "#00FF66"
                  : "var(--text-muted)",
                boxShadow: node.active ? "0 0 20px rgba(0,229,255,0.6)" : "none",
              }}
            >
              {node.label}
            </div>
            {node.active && (
              <span className="text-[8px] text-[#00E5FF] font-medium whitespace-nowrap">
                {node.level}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
