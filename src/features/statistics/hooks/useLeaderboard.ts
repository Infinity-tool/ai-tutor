"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "../services/statistics.service";
import { LeaderboardEntry } from "../types/statistics.types";

export function useLeaderboard() {
  const [type, setType] = useState<"global" | "friends">("global");

  const query = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", type],
    queryFn: () => fetchLeaderboard(type),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  return { ...query, type, setType };
}
