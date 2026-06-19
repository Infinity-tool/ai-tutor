/**
 * User Store — Zustand
 * Holds authenticated user profile and points/streak data.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/shared/types/global.types";

interface UserState {
  user: UserProfile | null;
  points: number;
  streak: number;
  setUser: (user: UserProfile | null) => void;
  setPoints: (points: number) => void;
  addPoints: (amount: number) => void;
  setStreak: (streak: number) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      points: 0,
      streak: 0,

      setUser: (user) => set({ user }),
      setPoints: (points) => set({ points }),
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      setStreak: (streak) => set({ streak }),
      reset: () => set({ user: null, points: 0, streak: 0 }),
    }),
    {
      name: "supertutor-user",
      partialize: (state) => ({
        user: state.user,
        points: state.points,
        streak: state.streak,
      }),
    }
  )
);
