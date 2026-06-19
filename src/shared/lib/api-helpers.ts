/**
 * API Helpers
 *
 * Consistent response shapes and error handling for all API routes.
 * Every route returns { success, data?, error? }
 */
import { NextResponse } from "next/server";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** Return a successful JSON response */
export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/** Return an error JSON response */
export function err(message: string, status = 500): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Log and return a 500 error */
export function serverError(
  context: string,
  error: unknown
): NextResponse<ApiError> {
  console.error(`[${context}]`, error);
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return err(message, 500);
}

/** Typed fetch wrapper for client-side API calls */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiSuccess<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new Error(json.error);
  }

  return json;
}
