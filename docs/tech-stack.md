# Agrim Tycoon — Gemma-First Technical Architecture

## Product decision

The hackathon build is a **Gemma-first local game**, not a generic AI wrapper. The shipped macOS experience packages the game, a portable `llama.cpp` server, and a Gemma GGUF model so judges can see meaningful local inference on Apple Silicon.

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Game UI | React, TypeScript, CSS Modules | Landing page, HUD, choices, outcomes, and accessibility |
| Game world | Phaser 4 | Station visuals, movement, alerts, and time pressure |
| Desktop shell | Tauri 2 | Native macOS window, secure command bridge, app bundle |
| Local inference | `llama.cpp` / `llama-server` | OpenAI-compatible inference service bound to localhost |
| Model | Gemma 3 1B IT GGUF, Q4_K_M | Small, bundled local model for responsive Apple Silicon inference |
| Fallback | Deterministic TypeScript / Rust outcomes | Keeps the game playable while clearly signalling when inference is unavailable |

## Desktop architecture

```text
Player
  ↓ makes a city decision
React + Phaser game
  ↓ Tauri invoke: gemma_request
Tauri Rust command
  ↓ localhost request
Bundled llama-server
  ↓
Bundled Gemma GGUF
  ↓ structured JSON: triage or scenario branch
Game applies visible stat changes; player remains accountable
```

### Runtime boundaries

- The bundled server binds to `127.0.0.1:8080`; it is not publicly exposed.
- Tauri starts the sidecar in a release build and resolves the model from app resources.
- The local model receives only the active scenario, the player decision, and the relevant game state.
- Model output is parsed as JSON and constrained before it can affect visible game stats.
- If local inference fails or times out, the UI labels the deterministic fallback rather than presenting it as a live model response.

## Why this is a strong Gemma use case

| Gemma advantage | Product consequence |
| --- | --- |
| Local execution | Sensitive city and community decisions do not need to leave the device. |
| Deployability | The complete experience can run in a self-contained macOS package. |
| Small open model | A responsive 1B Q4 model is practical for a live hackathon demo on Apple Silicon. |
| Structured inference | Gemma produces a recommendation, confidence/rationale, and scenario branch—not prose for prose’s sake. |
| Human-in-the-loop | The player chooses whether to accept, challenge, or override the recommendation. |

## Gemma interactions in the game

1. **Incident triage:** classify an operational or community issue and propose a bounded action.
2. **Guardrail drafting:** identify the minimum human controls needed before an automated city system is launched.
3. **Scenario stress test:** model the upside and civic-control risk of a consequential decision, then return stat changes and the next hook.

Every interaction has a deterministic contract and a visible effect. This prevents the model from becoming a decorative narrator.

## Packaging and model provenance

The build script validates the selected model before staging it:

- `AGRIM_GEMMA_MODEL_PATH` points to the approved GGUF file.
- `AGRIM_GEMMA_MODEL_SOURCE` records the source release.
- `AGRIM_GEMMA_MODEL_SHA256` must match the downloaded model.
- `AGRIM_GEMMA_NOTICE_PATH` stages the required Gemma notice.

The model weights and generated package artifacts are ignored by Git. The repository documents the repeatable build but does not redistribute model weights accidentally.

## Verification before demo or submission

```bash
npm run lint
npm run desktop:web:build
```

For the final local-model demo, verify all of the following:

- the app starts the bundled `llama-server`;
- `/health` responds locally;
- a Gemma-backed game choice returns valid structured JSON;
- the visible game state changes;
- disabling the local server shows the explicitly labelled fallback.

See [desktop-release.md](desktop-release.md) for packaging and [gemma-track-playbook.md](gemma-track-playbook.md) for the judge-facing proof plan.
