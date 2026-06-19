"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, type, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const resolvedType = isPassword
      ? showPassword ? "text" : "password"
      : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            className={cn(
              "w-full rounded-xl px-4 py-3 text-sm",
              "bg-[var(--bg-card)] border border-[var(--border-glass)]",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "transition-all duration-200",
              "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              // password yoki rightIcon bo'lsa o'ng padding
              (isPassword || rightIcon) && "pr-11",
              error &&
                "border-[var(--accent-danger)] focus:border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]",
              className
            )}
            {...props}
          />

          {/* Password toggle — ko'z ikonasi */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-0.5 rounded"
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rish"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}

          {/* Custom right icon (password bo'lmagan hollarda) */}
          {!isPassword && rightIcon && (
            <span className="absolute right-3 text-[var(--text-muted)]">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="text-xs text-[var(--accent-danger)] mt-0.5 flex items-center gap-1">
            <span aria-hidden="true">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
