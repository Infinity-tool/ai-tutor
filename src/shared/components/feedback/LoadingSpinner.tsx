import React from "react";
import { cn } from "@/shared/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      <span
        className={cn(
          "rounded-full border-[var(--border-glass)] border-t-[var(--accent-primary)] animate-spin",
          sizeMap[size]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Full-page loading state */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-[var(--text-muted)] text-sm animate-pulse">
          Loading SuperTutor AI...
        </p>
      </div>
    </div>
  );
}
