/**
 * Card — glassmorphism card base component
 * Used consistently across all features.
 */
import React from "react";
import { cn } from "@/shared/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add a glow border (purple accent) */
  glow?: boolean;
  /** Remove hover effect */
  static?: boolean;
  /** Add gradient overlay */
  gradient?: boolean;
}

export function Card({
  className,
  glow,
  static: isStatic,
  gradient,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "rounded-2xl",
        "border border-[var(--border-glass)]",
        "backdrop-blur-[20px]",
        "shadow-[var(--shadow-glass)]",
        isStatic
          ? "bg-[var(--bg-card)]"
          : "bg-[var(--bg-card)] transition-colors duration-200 hover:bg-[var(--bg-card-hover)]",
        glow && "border-[rgba(108,99,255,0.3)] shadow-[0_0_24px_rgba(108,99,255,0.15)]",
        className
      )}
      {...props}
    >
      {gradient && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[rgba(108,99,255,0.06)] to-transparent pointer-events-none"
        />
      )}
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardBody({ className, ...props }: CardBodyProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "p-6 pt-0 flex items-center gap-3",
        className
      )}
      {...props}
    />
  );
}
