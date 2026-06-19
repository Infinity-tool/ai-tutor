/**
 * Button — shared UI component
 * Variants: primary (purple), ghost, danger, secondary (cyan)
 */
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent-primary)] text-white hover:opacity-90 hover:shadow-[0_0_24px_rgba(108,99,255,0.5)] active:scale-[0.98]",
        secondary:
          "bg-[var(--accent-secondary)] text-[var(--bg-primary)] hover:opacity-90 hover:shadow-[0_0_24px_rgba(0,210,255,0.5)] active:scale-[0.98]",
        ghost:
          "bg-transparent text-[var(--text-secondary)] border border-[var(--border-glass)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] active:scale-[0.98]",
        danger:
          "bg-[var(--accent-danger)] text-white hover:opacity-90 hover:shadow-[0_0_24px_rgba(255,82,82,0.5)] active:scale-[0.98]",
        gradient:
          "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3 text-base",
        xl: "px-9 py-4 text-lg",
        icon: "p-2.5 aspect-square",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
