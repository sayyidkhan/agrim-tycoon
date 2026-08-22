# Agrim Tycoon desktop release

The desktop app is intentionally an Apple Silicon-first, offline release:

```text
React / Phaser game → Tauri invoke → local llama-server sidecar → Gemma GGUF
```

The sidecar only binds to `127.0.0.1:8080`. Tauri owns the request boundary and
the browser renderer never receives a provider key.

## Package inputs

Before producing a DMG, obtain and review:

- a Gemma GGUF model suitable for Apple Silicon;
- the model's required Gemma notice / terms material; and
- CMake and a Rust toolchain. The build makes a self-contained Apple Silicon
  `llama-server` automatically. Do not use the Homebrew executable directly:
  it links to Homebrew dylibs that do not travel inside the app bundle.

The model is not committed to this repository. Set these paths in the shell
where the build runs:

```bash
export AGRIM_GEMMA_MODEL_PATH=/absolute/path/to/gemma.gguf
export AGRIM_GEMMA_MODEL_SOURCE=https://example.com/model-release
export AGRIM_GEMMA_MODEL_SHA256=$(shasum -a 256 "$AGRIM_GEMMA_MODEL_PATH" | awk '{print $1}')
export AGRIM_GEMMA_NOTICE_PATH=/absolute/path/to/GEMMA_NOTICE.md
# Optional: only set this to deliberately override the pinned llama.cpp commit.
export LLAMA_CPP_REVISION=
npm run desktop:build
```

`desktop:build` copies the inputs into ignored staging locations and creates a
DMG under `src-tauri/target/release/bundle/dmg/`.
It also bundles a `GEMMA_MODEL_MANIFEST.json` recording the declared model
source, model SHA-256, sidecar SHA-256, and target triple.

## Publish the DMG

Keep the DMG out of Git history. For each version, create a matching Git tag
and upload the DMG as a GitHub Release asset. Use the exact versioned filename
below so the landing-page download URL is reproducible:

```text
tag: v0.1.0
asset: AgrimTycoon-0.1.0-arm64.dmg
url: https://github.com/sayyidkhan/agrim-tycoon/releases/download/v0.1.0/AgrimTycoon-0.1.0-arm64.dmg
```

Before uploading, generate and publish a checksum alongside the asset:

```bash
shasum -a 256 "src-tauri/target/release/bundle/dmg/Agrim Tycoon_0.1.0_aarch64.dmg"
```

Set `NEXT_PUBLIC_MAC_DOWNLOAD_URL` to the release URL in Vercel Production and
Preview, then redeploy the landing page.

## Release gate

- Test the DMG on a Mac without Homebrew or a separate model install.
- Confirm the game works while offline and Gemma changes a Machine City
  guardrail decision.
- Record one Gemma triage or guardrail decision changing visible city stats;
  this is the core Best Use of Gemma proof.
- Keep any deterministic fallback clearly labelled in the demo; never present it
  as a live Gemma completion.
- Sign and notarize the app, including its sidecar, before public release.
- Include the actual Gemma notice and comply with the terms for the chosen
  model; do not replace it with a placeholder.
