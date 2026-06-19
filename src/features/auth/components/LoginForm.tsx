"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export function LoginForm() {
  const { isLoading, error, loginWithCredentials, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Glass card */}
      <div className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card)] backdrop-blur-[20px] shadow-[var(--shadow-glass)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4 text-2xl">
            🎓
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
            Welcome back
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Sign in to continue learning
          </p>
        </div>

        {/* Google OAuth — faqat GOOGLE_CLIENT_ID sozlanganda ko'rinadi */}
        {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="w-full mb-6"
              onClick={loginWithGoogle}
              isLoading={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google bilan kirish
            </Button>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[var(--border-glass)]" />
              <span className="text-[var(--text-muted)] text-xs font-medium">yoki email bilan</span>
              <div className="flex-1 h-px bg-[var(--border-glass)]" />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(loginWithCredentials)} noValidate>
          <div className="flex flex-col gap-4 mb-6">
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
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {/* Global error */}
          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-xl bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.3)] text-[var(--accent-danger)] text-sm"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--accent-primary)] hover:underline font-medium"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
