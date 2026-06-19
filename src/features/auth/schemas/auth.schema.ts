import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email kiritilishi shart")
    .email("To'g'ri email manzil kiriting"),
  password: z
    .string()
    .min(1, "Parol kiritilishi shart")
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Ism kiritilishi shart")
      .min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak")
      .max(50, "Ism juda uzun"),
    email: z
      .string()
      .min(1, "Email kiritilishi shart")
      .email("To'g'ri email manzil kiriting"),
    password: z
      .string()
      .min(1, "Parol kiritilishi shart")
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z
      .string()
      .min(1, "Parolni tasdiqlash shart"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmayapti",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
