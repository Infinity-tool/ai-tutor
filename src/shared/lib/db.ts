/**
 * Prisma Client Singleton
 *
 * Prevents multiple instances during Next.js hot reload in development.
 * In production, a fresh instance is created once.
 *
 * Usage: import { db } from "@/shared/lib/db"
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
