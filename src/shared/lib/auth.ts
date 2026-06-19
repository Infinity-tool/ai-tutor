/**
 * NextAuth v5 Configuration
 * Providers: Credentials (majburiy) + Google (faqat key bo'lsa)
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { loginSchema } from "@/features/auth/schemas/auth.schema";

const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== "your-google-client-id" &&
  !!process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== "your-google-client-secret";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Google faqat key mavjud bo'lganda ishlaydi
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        try {
          const user = await db.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("[auth] Database error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      try {
        await db.userStatistics.create({ data: { user_id: user.id } });
        await db.userStreak.create({ data: { user_id: user.id } });
      } catch (error) {
        console.error("[auth] Failed to create initial stats:", error);
      }
    },
  },
});
