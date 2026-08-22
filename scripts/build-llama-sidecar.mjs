import { execFileSync } from "node:child_process";
import { access, chmod, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const artifactRoot = path.join(projectRoot, "artifacts");
const sourceRoot = path.join(artifactRoot, "llama.cpp");
const buildRoot = path.join(artifactRoot, "llama-build");
const sidecar = path.join(artifactRoot, "llama-server-aarch64-apple-darwin");
const sidecarMetadata = `${sidecar}.json`;
const DEFAULT_LLAMA_CPP_REVISION = "2100e592600e4538496fd5201cbe6a7f8fbeb1e0";
const llamaRevision = process.env.LLAMA_CPP_REVISION ?? DEFAULT_LLAMA_CPP_REVISION;

if (process.platform !== "darwin" || process.arch !== "arm64") {
  throw new Error("This release script currently builds an Apple Silicon macOS sidecar only.");
}

if (!/^[0-9a-f]{40}$/i.test(llamaRevision)) {
  throw new Error("Set LLAMA_CPP_REVISION to the exact 40-character llama.cpp commit to build a reproducible sidecar.");
}

try {
  await access(sidecar);
  const metadata = JSON.parse(await readFile(sidecarMetadata, "utf8"));
  if (metadata.llamaCppRevision === llamaRevision) {
    console.log(`Using cached self-contained Apple Silicon llama-server sidecar (${llamaRevision}).`);
    process.exit(0);
  }
} catch {
  // Build a sidecar for the pinned revision below.
}

await mkdir(artifactRoot, { recursive: true });
try {
  await access(path.join(sourceRoot, ".git"));
} catch {
  execFileSync("git", ["init", sourceRoot], { stdio: "inherit" });
  execFileSync("git", ["-C", sourceRoot, "remote", "add", "origin", "https://github.com/ggml-org/llama.cpp.git"], { stdio: "inherit" });
}

execFileSync("git", ["-C", sourceRoot, "fetch", "--depth", "1", "origin", llamaRevision], { stdio: "inherit" });
execFileSync("git", ["-C", sourceRoot, "checkout", "--detach", "FETCH_HEAD"], { stdio: "inherit" });

execFileSync("cmake", [
  "-S", sourceRoot,
  "-B", buildRoot,
  "-DBUILD_SHARED_LIBS=OFF",
  "-DLLAMA_BUILD_SERVER=ON",
  "-DGGML_METAL=ON",
  "-DLLAMA_OPENSSL=OFF",
  "-DCMAKE_BUILD_TYPE=Release",
], { stdio: "inherit" });
execFileSync("cmake", ["--build", buildRoot, "--target", "llama-server", "--config", "Release", "-j", "4"], { stdio: "inherit" });

await copyFile(path.join(buildRoot, "bin", "llama-server"), sidecar);
await chmod(sidecar, 0o755);
await writeFile(
  sidecarMetadata,
  `${JSON.stringify({ llamaCppRevision: llamaRevision }, null, 2)}\n`,
);
console.log(`Built self-contained sidecar (${llamaRevision}): ${sidecar}`);
