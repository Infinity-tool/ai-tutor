import { SessionRecord } from "../types/session.types";

export async function fetchSessions(limit = 20, subject?: string): Promise<SessionRecord[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (subject) params.set("subject", subject);
  const res = await fetch(`/api/sessions?${params}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Failed to fetch sessions");
  return data.data;
}

export async function saveSession(payload: {
  subject: string;
  duration: number;
  messages: unknown[];
  feedback?: unknown;
}): Promise<{ id: string }> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Failed to save session");
  return data.data;
}
