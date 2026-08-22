import assert from "node:assert/strict";
import test from "node:test";

async function request(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: path.startsWith("/api/") ? "application/json" : "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Agrim Tycoon landing experience", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Agrim Tycoon/);
  assert.match(html, /AGRIM/);
  assert.match(html, /TYCOON/);
  assert.match(html, /Download for macOS/);
  assert.match(html, /How to play/);
  assert.match(html, /Gemma runs locally on your Mac/);
  assert.match(html, /Local Gemma decision support/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("exposes a secret-safe health endpoint", async () => {
  const response = await request("/api/health");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/i);

  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(typeof body.services.gemma.configured, "boolean");
  assert.equal(typeof body.services.gemini.configured, "boolean");
  assert.equal(JSON.stringify(body).includes("GEMINI_API_KEY"), false);
});
