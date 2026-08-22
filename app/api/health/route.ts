export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        gemma: {
          configured: Boolean(process.env.GEMMA_BASE_URL),
          model: process.env.GEMMA_MODEL || "gemma-local",
        },
        gemini: {
          configured: Boolean(process.env.GEMINI_API_KEY),
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        },
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}

