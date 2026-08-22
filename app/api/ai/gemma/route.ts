import {
  analyzeWithGemma,
  GEMMA_MODES,
  GEMMA_ROLES,
  narrateElonTwistWithGemma,
} from "@/lib/server/ai/gemma";
import { boundedContext, enumField, jsonError, readJsonObject, stringField } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    const mode = enumField(body, "mode", GEMMA_MODES, "triage");
    if (mode === "elon_twist") {
      const decision = stringField(body, "decision", { required: true, maxLength: 2_000 })!;
      const scenario = stringField(body, "scenario", { required: true, maxLength: 2_000 })!;
      const gameState = boundedContext(body.gameState, 4_000);
      const response = await narrateElonTwistWithGemma({ decision, scenario, gameState });
      return Response.json({
        ...response,
        mode,
        provider: response.degraded ? "deterministic-fallback" : "local-gemma",
        model: process.env.GEMMA_MODEL || "gemma-local",
      });
    }

    const role = enumField(body, "role", GEMMA_ROLES, "community");
    const message = stringField(body, "message", { required: true, maxLength: 2_000 })!;
    const context = boundedContext(body.context, 3_000);
    const response = await analyzeWithGemma({ role, message, context });

    return Response.json({
      ...response,
      mode,
      provider: response.degraded ? "deterministic-fallback" : "local-gemma",
      model: process.env.GEMMA_MODEL || "gemma-local",
    });
  } catch (error) {
    return jsonError(error);
  }
}
