import { directWithGemini, GEMINI_MODES } from "@/lib/server/ai/gemini";
import { boundedContext, enumField, jsonError, readJsonObject, stringField } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    const mode = enumField(body, "mode", GEMINI_MODES, "consequence");
    const decision = stringField(body, "decision", { required: true, maxLength: 2_000 })!;
    const scenario = stringField(body, "scenario", { maxLength: 2_000 });
    const gameState = boundedContext(body.gameState, 4_000);
    const response = await directWithGemini({ mode, decision, scenario, gameState });

    return Response.json({
      ...response,
      mode,
      provider: response.degraded ? "deterministic-fallback" : "google-gemini",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
  } catch (error) {
    return jsonError(error);
  }
}

