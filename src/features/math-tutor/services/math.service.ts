/**
 * Math Service — server-side only
 * Step 1: Parse with Math.js (for computable expressions)
 * Step 2: Send to LLM for step-by-step explanation
 * Step 3: Return structured solution with LaTeX
 *
 * Called from: /api/ai/math route (to be added)
 */
import { evaluate, parse, isNode } from "mathjs";
import { MathSolution, GraphData } from "../types/math.types";
import Groq from "groq-sdk";
import { Lesson } from "@/shared/types/curriculum.types";

// Lazy initialization for Groq client
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

function getMathSystemPrompt(lesson?: Lesson) {
  const basePrompt = `You are an expert math tutor. When given a math problem:
1. Break it down into clear numbered steps
2. For each step provide: description, LaTeX formula, and plain English explanation
3. Provide the final answer in both text and LaTeX format
4. If the problem involves a plottable function (like f(x) = ...), include "GRAPH: <expression>" at the end

Respond in this EXACT JSON format:
{
  "steps": [
    { "step_number": 1, "description": "Step title", "latex": "LaTeX here", "explanation": "Plain English" }
  ],
  "final_answer": "The answer in plain text",
  "latex_answer": "\\\\boxed{answer in LaTeX}",
  "graph_expression": "x^2 + 2*x - 3 or null"
}`;

  if (lesson) {
    return `${basePrompt}

CURRENT LESSON CONTEXT:
You are helping the student with this specific math lesson:
- Lesson Title: ${lesson.title_uz || lesson.title}
- Lesson Objectives: ${(lesson.objectives_uz || lesson.objectives).join(", ")}
- Topics: ${lesson.topics.join(", ")}

Focus your explanations on the lesson's objectives and topics. Keep your explanations simple and appropriate for a ${lesson.level} level student.`;
  }

  return basePrompt;
}

/**
 * Try to compute the problem with Math.js first (exact results).
 * Returns null if the expression is not directly computable.
 */
function tryMathJs(problem: string): string | null {
  try {
    const result = evaluate(problem);
    if (typeof result === "number" || typeof result === "string") {
      return String(result);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate graph data for a function expression.
 */
function generateGraphData(expression: string): GraphData | null {
  try {
    const node = parse(expression);
    if (!isNode(node)) return null;

    const points: Array<{ x: number; y: number }> = [];
    const xMin = -10;
    const xMax = 10;
    const steps = 200;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      try {
        const y = evaluate(expression, { x }) as number;
        if (typeof y === "number" && isFinite(y) && Math.abs(y) < 1000) {
          points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
        }
      } catch {
        // Skip invalid points
      }
    }

    return { expression, x_min: xMin, x_max: xMax, points };
  } catch {
    return null;
  }
}

/**
 * Main solve function: Math.js + LLM explanation.
 */
export async function solveProblem(problem: string, lesson?: Lesson): Promise<MathSolution> {
  const directAnswer = tryMathJs(problem);

  const userMessage = directAnswer
    ? `Solve this math problem step by step: ${problem}\n(Direct computation result: ${directAnswer})`
    : `Solve this math problem step by step: ${problem}`;

  const mathSystemPrompt = getMathSystemPrompt(lesson);

  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: mathSystemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.2,
    max_tokens: 2048,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  const graphData =
    parsed.graph_expression && parsed.graph_expression !== "null"
      ? generateGraphData(parsed.graph_expression)
      : null;

  return {
    problem,
    steps: parsed.steps ?? [],
    final_answer: parsed.final_answer ?? directAnswer ?? "Could not solve",
    latex_answer: parsed.latex_answer ?? "",
    graph_data: graphData,
  };
}
