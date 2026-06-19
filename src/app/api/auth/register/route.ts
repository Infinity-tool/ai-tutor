import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/shared/lib/db";
import { ok, err, serverError } from "@/shared/lib/api-helpers";
import { registerSchema } from "@/features/auth/schemas/auth.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      // Barcha xatolarni ko'rsatish uchun
      const firstError = parsed.error.errors[0];
      console.error("[register] Validation error:", parsed.error.errors);
      return err(firstError?.message ?? "Validation failed", 400);
    }

    const { name, email, password } = parsed.data;

    // Check for existing user
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return err("An account with this email already exists.", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + initial stats in a transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password: hashedPassword },
      });
      await tx.userStatistics.create({ data: { user_id: newUser.id } });
      await tx.userStreak.create({ data: { user_id: newUser.id } });
      return newUser;
    });

    return ok({ id: user.id, email: user.email, name: user.name }, 201);
  } catch (error) {
    return serverError("register", error);
  }
}
