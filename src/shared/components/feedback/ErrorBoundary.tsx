"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-[var(--bg-card)] border border-[rgba(255,82,82,0.3)] text-center">
          <span className="text-3xl" aria-hidden="true">⚠️</span>
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-1">
              Something went wrong
            </h3>
            <p className="text-[var(--text-secondary)] text-sm">
              {this.state.error?.message ?? "An unexpected error occurred"}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
