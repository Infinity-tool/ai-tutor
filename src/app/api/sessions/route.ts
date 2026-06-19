import { NextRequest } from "next/server";
import { auth } from "@/shared/lib/auth";
import { db } from "@/shared/lib/db";
import { ok, err, serverError } from "@/shared/lib/api-helpers";

/** GET /api/sessions — list user's recent sessions */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return err("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
    const subject = searchParams.get("subject");

    const sessions = await db.session.findMany({
      where: {
        user_id: session.user.id,
        ...(subject ? { subject } : {}),
      },
      orderBy: { created_at: "desc" },
      take: limit,
      select: {
        id: true, subject: true, duration: true,
        feedback: true, created_at: true,
      },
    });

    return ok(sessions);
  } catch (error) {
    return serverError("GET /api/sessions", error);
  }
}

/** POST /api/sessions — save a completed session */
export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    if (!authSession?.user?.id) return err("Unauthorized", 401);

    const body = await req.json();
    const { subject, duration, messages, feedback } = body;

    if (!subject || typeof duration !== "number" || duration < 0) {
      return err("subject and duration are required", 400);
    }

    const saved = await db.session.create({
      data: {
        user_id: authSession.user.id,
        subject,
        duration: Math.round(duration),
        messages: messages ?? [],
        feedback: feedback ?? null,
      },
    });

    return ok({ id: saved.id }, 201);
  } catch (error) {
    return serverError("POST /api/sessions", error);
  }
}
