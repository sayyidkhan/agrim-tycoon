import { analyzeWithGemma, GEMMA_ROLES } from "@/lib/server/ai/gemma";
import { boundedContext, enumField, jsonError, readJsonObject, stringField } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    const role = enumField(body, "role", GEMMA_ROLES, "community");
    const message = stringField(body, "message", { required: true, maxLength: 2_000 })!;
    const context = boundedContext(body.context, 3_000);
    const response = await analyzeWithGemma({ role, message, context });

    return Response.json({
      ...response,
      provider: response.degraded ? "deterministic-fallback" : "local-gemma",
      model: process.env.GEMMA_MODEL || "gemma-local",
    });
  } catch (error) {
    return jsonError(error);
  }
}

