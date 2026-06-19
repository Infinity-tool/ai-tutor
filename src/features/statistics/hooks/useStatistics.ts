"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserStats, updateStatsAfterSession } from "../services/statistics.service";
import { UserStatsResponse } from "../types/statistics.types";

export const STATS_KEY = ["user-stats"];

export function useStatistics() {
  return useQuery<UserStatsResponse>({
    queryKey: STATS_KEY,
    queryFn: fetchUserStats,
    refetchInterval: 30_000, // refresh every 30s
    staleTime: 20_000,
    retry: 2,
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatsAfterSession,
    onSuccess: () => {
      // Invalidate and refetch stats
      queryClient.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}
