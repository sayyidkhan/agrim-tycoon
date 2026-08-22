# Agrim Tycoon

One week. Three jobs. Zero time.

Agrim Tycoon is a high-fidelity management game about governing Innovation City across its community, builder academy, and machine systems. Its local Gemma chief of staff triages incidents, proposes guardrails, and simulates the consequences of high-stakes decisions.

## Stack

- React, TypeScript, and Phaser 4
- vinext and Vite
- Local Gemma through a bundled `llama.cpp` runtime
- Tauri for the offline macOS app
- Deterministic fallbacks for resilient gameplay

The Gemma-track strategy, technical architecture, and submission copy live in [`docs/gemma-track-playbook.md`](docs/gemma-track-playbook.md), [`docs/tech-stack.md`](docs/tech-stack.md), and [`docs/submission.md`](docs/submission.md).

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The game remains playable without configured models by using deterministic fallback responses.

## Desktop macOS POC

The desktop client uses the same game UI but calls a local Tauri command instead
of the web API. In a release build, Tauri launches a bundled `llama-server`
sidecar on `127.0.0.1:8080`; the model and all inference stay on the device.

For development, start an OpenAI-compatible local server, then run:

```bash
npm run desktop:dev
```

`GEMMA_BASE_URL` can point to that development server. Without it, or when the
model cannot be reached, the game uses its deterministic fallback.

### Build a distributable Apple Silicon DMG

1. Accept the Gemma terms and obtain a GGUF model plus its required notice file.
2. Install the Rust toolchain and CMake. The build creates a matching,
   self-contained Apple Silicon `llama-server` automatically. A Homebrew
   binary is not portable because it refers to Homebrew dylibs; the package
   command rejects it.
3. Export the model source URL and SHA-256 and the three `AGRIM_*` paths shown
   in `.env.example`. The build pins llama.cpp in source; only set
   `LLAMA_CPP_REVISION` to deliberately override that revision.
4. Run `npm run desktop:build`.

The build script stages the model, notice, and `llama-server` under
`src-tauri/` locally, then Tauri bundles them into the DMG. Those artifacts are
ignored by Git so the repository stays small and does not redistribute model
weights by accident. Sign and notarize the final app before public distribution.
The package build rejects an unpinned llama.cpp revision or a model whose
SHA-256 differs from the declared value.

## Gemma configuration

Gemma is expected to run as an OpenAI-compatible `llama-server` process:

```text
GEMMA_BASE_URL=http://127.0.0.1:8080/v1
GEMMA_MODEL=gemma-local
```

Never expose local model paths or any future service credentials through a
`NEXT_PUBLIC_*` environment variable.

## Validation

```bash
npm run build
npm test
npm run lint
```

## Vercel deployment

Vercel uses the default scripts in `package.json`, which build and run the
native Next.js application (`next build` / `next start`). Import the repository
as a Next.js project and leave the Output Directory unset; Vercel will detect
the generated `.next` directory automatically.

`GEMMA_BASE_URL` pointing at `127.0.0.1` only works when Gemma runs on the
same host. The public web build uses deterministic fallbacks unless it can
reach a deliberately deployed, appropriately secured Gemma endpoint. The
hackathon demo should use the bundled desktop app to prove local inference.

After publishing the macOS DMG as a GitHub Release asset, set
`NEXT_PUBLIC_MAC_DOWNLOAD_URL` in Vercel Production and Preview to its
versioned asset URL. `NEXT_PUBLIC_*` values are compiled into the client, so
redeploy after changing it. For v0.1.0, use:

```text
https://github.com/sayyidkhan/agrim-tycoon/releases/download/v0.1.0/AgrimTycoon-0.1.0-arm64.dmg
```

## Cloudflare / Zo deployment

For the Cloudflare Worker build used by Zo, run `npm run build:cloudflare`.
Deploy the web application as a public Zo HTTP service. Run `llama-server`
separately as a private Zo process service bound to `127.0.0.1`. Configure
secrets through Zo's service environment variables.
