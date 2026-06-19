import React from "react";
import { cn } from "@/shared/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[rgba(108,99,255,0.15)] text-[var(--accent-primary)] border-[rgba(108,99,255,0.3)]",
  success: "bg-[rgba(0,230,118,0.1)] text-[var(--accent-success)] border-[rgba(0,230,118,0.3)]",
  warning: "bg-[rgba(255,179,0,0.1)] text-[var(--accent-warning)] border-[rgba(255,179,0,0.3)]",
  danger: "bg-[rgba(255,82,82,0.1)] text-[var(--accent-danger)] border-[rgba(255,82,82,0.3)]",
  info: "bg-[rgba(0,210,255,0.1)] text-[var(--accent-secondary)] border-[rgba(0,210,255,0.3)]",
  outline: "bg-transparent text-[var(--text-secondary)] border-[var(--border-glass)]",
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
