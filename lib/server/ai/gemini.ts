import { envInt, fetchWithTimeout } from "@/lib/server/http";
import { clamp, extractJson, hashString, isRecord } from "@/lib/server/ai/shared";

export const GEMINI_MODES = ["consequence", "final_review"] as const;
export type GeminiMode = (typeof GEMINI_MODES)[number];

export interface StatChanges {
  community: number;
  students: number;
  elon: number;
  energy: number;
}

export interface Consequence {
  headline: string;
  narrative: string;
  statChanges: StatChanges;
  nextHook: string;
}

export interface FinalReview {
  title: string;
  summary: string;
  roleEndings: { community: string; teaching: string; spacex: string };
  verdict: string;
}

export interface GeminiInput {
  mode: GeminiMode;
  decision: string;
  scenario?: string;
  gameState?: string;
}

function shortString(record: Record<string, unknown>, key: string, max: number): string {
  const value = record[key];
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`Invalid ${key}`);
  return value.trim();
}

function stat(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Invalid stat change");
  return Math.round(clamp(value, -20, 20));
}

function parseConsequence(value: unknown): Consequence {
  if (!isRecord(value) || !isRecord(value.statChanges)) throw new Error("Invalid consequence");
  return {
    headline: shortString(value, "headline", 80),
    narrative: shortString(value, "narrative", 400),
    statChanges: {
      community: stat(value.statChanges.community),
      students: stat(value.statChanges.students),
      elon: stat(value.statChanges.elon),
      energy: stat(value.statChanges.energy),
    },
    nextHook: shortString(value, "nextHook", 180),
  };
}

function parseFinalReview(value: unknown): FinalReview {
  if (!isRecord(value) || !isRecord(value.roleEndings)) throw new Error("Invalid final review");
  return {
    title: shortString(value, "title", 80),
    summary: shortString(value, "summary", 500),
    roleEndings: {
      community: shortString(value.roleEndings, "community", 80),
      teaching: shortString(value.roleEndings, "teaching", 80),
      spacex: shortString(value.roleEndings, "spacex", 80),
    },
    verdict: shortString(value, "verdict", 200),
  };
}

function fallback(input: GeminiInput): Consequence | FinalReview {
  const seed = hashString(`${input.decision}|${input.scenario}|${input.gameState}`);
  if (input.mode === "final_review") {
    return {
      title: "The Three-Job Survivor",
      summary: "Agrim survived a week of community chaos, ambitious students, and impossible deadlines.",
      roleEndings: { community: "Community Legend", teaching: "Great Sage", spacex: "Still Employed" },
      verdict: "You kept all three worlds moving. Next time, remember that coffee is not a fourth job.",
    };
  }
  return {
    headline: ["Chaos Contained", "A Bold Call", "Task Failed Successfully"][seed % 3],
    narrative: "Agrim makes the call. The immediate crisis settles, but another notification is already blinking.",
    statChanges: {
      community: (seed % 7) - 2,
      students: ((seed >>> 3) % 7) - 2,
      elon: ((seed >>> 6) % 7) - 3,
      energy: -1 - ((seed >>> 9) % 4),
    },
    nextHook: "A new request appears at the station Agrim has ignored the longest.",
  };
}

function promptFor(input: GeminiInput): string {
  const common = [
    "You are the comedic game director for Agrim Tycoon.",
    "Tone: affectionate, punchy, workplace chaos; no cruelty or unsafe advice.",
    `Player decision: ${input.decision}`,
    input.scenario ? `Scenario: ${input.scenario}` : "",
    input.gameState ? `Game state: ${input.gameState}` : "",
  ].filter(Boolean);

  if (input.mode === "final_review") {
    common.push("Return ONLY JSON with title, summary, roleEndings {community, teaching, spacex}, and verdict. Keep each value concise.");
  } else {
    common.push("Return ONLY JSON with headline, narrative, statChanges {community, students, elon, energy} using integers -20 to 20, and nextHook. Keep it concise.");
  }
  return common.join("\n");
}

async function generate(input: GeminiInput): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini is not configured");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptFor(input) }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400, responseMimeType: "application/json" },
      }),
    },
    envInt("GEMINI_TIMEOUT_MS", 8_000, 1_000, 20_000),
  );
  if (!response.ok) throw new Error(`Gemini returned HTTP ${response.status}`);
  const payload = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === "string")?.text;
  if (typeof text !== "string") throw new Error("Gemini returned no text");
  return extractJson(text);
}

export async function directWithGemini(input: GeminiInput): Promise<{
  result: Consequence | FinalReview;
  degraded: boolean;
}> {
  try {
    const raw = await generate(input);
    return {
      result: input.mode === "final_review" ? parseFinalReview(raw) : parseConsequence(raw),
      degraded: false,
    };
  } catch {
    return { result: fallback(input), degraded: true };
  }
}

