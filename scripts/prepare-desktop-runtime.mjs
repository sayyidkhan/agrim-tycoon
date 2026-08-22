import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, chmod, copyFile, mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const defaultServer = path.join(projectRoot, "artifacts", "llama-server-aarch64-apple-darwin");
const sourceServer = process.env.AGRIM_LLAMA_SERVER_PATH ?? defaultServer;
const sourceModel = process.env.AGRIM_GEMMA_MODEL_PATH;
const sourceModelUrl = process.env.AGRIM_GEMMA_MODEL_SOURCE;
const expectedModelSha256 = process.env.AGRIM_GEMMA_MODEL_SHA256?.toLowerCase();
const sourceNotice = process.env.AGRIM_GEMMA_NOTICE_PATH;
const DEFAULT_LLAMA_CPP_REVISION = "2100e592600e4538496fd5201cbe6a7f8fbeb1e0";
const llamaCppRevision = process.env.LLAMA_CPP_REVISION ?? DEFAULT_LLAMA_CPP_REVISION;

const targetTriple = process.env.TAURI_TARGET_TRIPLE
  ?? (process.platform === "darwin" && process.arch === "arm64"
    ? "aarch64-apple-darwin"
    : undefined);

const missing = [
  ["AGRIM_GEMMA_MODEL_PATH", sourceModel],
  ["AGRIM_GEMMA_MODEL_SOURCE", sourceModelUrl],
  ["AGRIM_GEMMA_MODEL_SHA256", expectedModelSha256],
  ["AGRIM_GEMMA_NOTICE_PATH", sourceNotice],
  ["TAURI_TARGET_TRIPLE (required off Apple Silicon macOS)", targetTriple],
].filter(([, value]) => !value).map(([name]) => name);

if (missing.length > 0) {
  throw new Error(`Cannot package the desktop runtime. Set: ${missing.join(", ")}`);
}

if (!/^[0-9a-f]{64}$/.test(expectedModelSha256)) {
  throw new Error("AGRIM_GEMMA_MODEL_SHA256 must be a 64-character SHA-256 digest.");
}

async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

await Promise.all([sourceServer, sourceModel, sourceNotice].map(async (source) => {
  await access(source);
}));

const actualModelSha256 = await sha256(sourceModel);
if (actualModelSha256 !== expectedModelSha256) {
  throw new Error(
    `Gemma model SHA-256 mismatch. Expected ${expectedModelSha256}, received ${actualModelSha256}.`,
  );
}
const sidecarSha256 = await sha256(sourceServer);

if (process.platform === "darwin") {
  const linkedLibraries = execFileSync("otool", ["-L", sourceServer], { encoding: "utf8" })
    .split("\n")
    .slice(1)
    .map((line) => line.trim().split(" ")[0])
    .filter(Boolean);
  const nonPortableLibraries = linkedLibraries.filter((library) => (
    !library.startsWith("/System/") && !library.startsWith("/usr/lib/")
  ));
  if (nonPortableLibraries.length > 0) {
    throw new Error(
      `AGRIM_LLAMA_SERVER_PATH must be a self-contained macOS binary. Found external dependencies: ${nonPortableLibraries.join(", ")}`,
    );
  }
}

const binariesDir = path.join(projectRoot, "src-tauri", "binaries");
const modelsDir = path.join(projectRoot, "src-tauri", "resources", "models");
const licensesDir = path.join(projectRoot, "src-tauri", "resources", "licenses");
await Promise.all([mkdir(binariesDir, { recursive: true }), mkdir(modelsDir, { recursive: true }), mkdir(licensesDir, { recursive: true })]);

const stagedServer = path.join(binariesDir, `llama-server-${targetTriple}`);
await Promise.all([
  copyFile(sourceServer, stagedServer),
  copyFile(sourceModel, path.join(modelsDir, "gemma.gguf")),
  copyFile(sourceNotice, path.join(licensesDir, "GEMMA_NOTICE.md")),
]);
await chmod(stagedServer, 0o755);
await writeFile(
  path.join(modelsDir, "GEMMA_MODEL_MANIFEST.json"),
  `${JSON.stringify({
    schemaVersion: 1,
    model: {
      source: sourceModelUrl,
      sourceFilename: path.basename(sourceModel),
      sha256: actualModelSha256,
    },
    sidecar: {
      llamaCppRevision,
      targetTriple,
      sha256: sidecarSha256,
    },
  }, null, 2)}\n`,
);

console.log(`Staged verified local Gemma runtime for ${targetTriple}.`);
