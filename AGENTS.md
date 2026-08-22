# Agrim Tycoon — Agent Guide

## Mission

Help Agrim Tycoon win **Google DeepMind — Best Use of Gemma**. Optimise for a credible, working local-Gemma experience and a short proof-driven demo—not feature count.

## Product positioning

- Agrim Tycoon is a local-first Innovation City management game.
- Gemma is the player's local chief of staff: it triages incidents, drafts guardrails, and stress-tests consequential decisions.
- The player keeps authority. Gemma must inform a decision, never silently make one.
- Privacy, deployability, resilience, and structured game consequences are the differentiators.

## Non-negotiables

- Do not add Gemini positioning, prize claims, or visible branding to the submission-facing product or documentation.
- Do not present deterministic fallback content as live Gemma output.
- Preserve the local `llama.cpp` / `llama-server` path and the model-provenance checks.
- Keep model weights, API keys, and generated packages out of Git.
- Do not submit Gavel on the user's behalf without a final explicit confirmation immediately before the locked Submit action.

## Demo acceptance criteria

1. The macOS app opens on the landing page and enters the game through **Play the game**.
2. A bundled local Gemma model serves a real game decision through the Tauri command.
3. The response is structured and produces visible state changes.
4. The UI clearly identifies fallback behaviour if the model is unavailable.
5. The video shows this flow in under three minutes.

## Important files

- `docs/gemma-track-playbook.md` — winning narrative and 180-second demo.
- `docs/submission.md` — Gavel field values; preserve the embedded form screenshot.
- `docs/tech-stack.md` — current Gemma-first architecture.
- `docs/desktop-release.md` — package the local model and sidecar.
- `components/game/GameExperience.tsx` — game loop and Gemma outcome presentation.
- `src-tauri/src/lib.rs` — local sidecar startup and `gemma_request` bridge.
- `scripts/prepare-desktop-runtime.mjs` — model integrity and notice staging.

## Validation

Run these after relevant changes:

```bash
npm run lint
npm run desktop:web:build
```

Use the packaged app for local-inference proof. Do not claim desktop packaging is verified unless the Gemma sidecar, model, and a real completion have been tested together.
