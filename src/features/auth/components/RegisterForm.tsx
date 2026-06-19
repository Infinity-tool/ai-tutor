"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export function RegisterForm() {
  const { isLoading, error, register: registerUser, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card)] backdrop-blur-[20px] shadow-[var(--shadow-glass)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4 text-2xl">
            🎓
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
            Start learning today
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Create your free SuperTutor account
          </p>
        </div>

        {/* Google OAuth — faqat sozlanganda ko'rinadi */}
        {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
          <>
            <Button variant="ghost" size="lg" className="w-full mb-6" onClick={loginWithGoogle} isLoading={isLoading}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google bilan ro'yxatdan o'tish
            </Button>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[var(--border-glass)]" />
              <span className="text-[var(--text-muted)] text-xs font-medium">yoki email bilan</span>
              <div className="flex-1 h-px bg-[var(--border-glass)]" />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(registerUser)} noValidate>
          <div className="flex flex-col gap-4 mb-6">
            <Input
              label="Full name"
              type="text"
              placeholder="Alex Johnson"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          {error && (
            <div role="alert" className="mb-4 px-4 py-3 rounded-xl bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.3)] text-[var(--accent-danger)] text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="gradient" size="lg" className="w-full" isLoading={isLoading}>
            Create Free Account
          </Button>
        </form>

        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-[var(--accent-primary)] hover:underline">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline">Privacy Policy</Link>.
        </p>

        <p className="text-center text-sm text-[var(--text-muted)] mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent-primary)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
