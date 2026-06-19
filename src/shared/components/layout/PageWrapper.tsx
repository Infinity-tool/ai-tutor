import React from "react";
import { cn } from "@/shared/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageWrapper({ children, className, title, description }: PageWrapperProps) {
  return (
    <main className={cn("flex-1 p-4 lg:p-6 min-h-0 overflow-y-auto", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[var(--text-secondary)] text-sm mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </main>
  );
}
