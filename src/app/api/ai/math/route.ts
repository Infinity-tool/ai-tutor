import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/shared/lib/api-helpers";
import { solveProblem } from "@/features/math-tutor/services/math.service";
import { Lesson } from "@/shared/types/curriculum.types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problem, lesson } = body as { problem?: string; lesson?: Lesson };

    if (!problem || typeof problem !== "string" || !problem.trim()) {
      return err("problem is required", 400);
    }

    if (problem.length > 2000) {
      return err("Problem too long (max 2000 characters)", 400);
    }

    const solution = await solveProblem(problem.trim(), lesson);
    return ok(solution);
  } catch (error) {
    return serverError("api/ai/math", error);
  }
}
