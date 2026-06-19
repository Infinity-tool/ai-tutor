"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginFormValues, RegisterFormValues } from "../schemas/auth.schema";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  loginWithCredentials: (values: LoginFormValues) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loginWithCredentials = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Failed to sign in with Google.");
      setIsLoading(false);
    }
  };

  const register = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Ro'yxatdan o'tishda xato. Qaytadan urinib ko'ring.");
        return;
      }

      // Auto-login after registration
      await loginWithCredentials({
        email: values.email,
        password: values.password,
      });
    } catch {
      setError("Xato yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return {
    isLoading,
    error,
    loginWithCredentials,
    loginWithGoogle,
    register,
    logout,
  };
}
