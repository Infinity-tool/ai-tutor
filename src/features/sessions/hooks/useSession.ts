"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "../services/session.service";
import { Subject } from "@/shared/types/global.types";

export function useSessions(subject?: Subject) {
  return useQuery({
    queryKey: ["sessions", subject],
    queryFn: () => fetchSessions(20, subject),
    staleTime: 60_000,
  });
}
