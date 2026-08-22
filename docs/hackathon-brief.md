# Build with Gemini Hackathon 2026 — Gemma Track Brief

Source: [participant guide](https://65labs-gemini-hack.notion.site/). Reviewed 22 August 2026. This is the team's execution interpretation for its selected track, not a replacement for the official rules.

## Chosen track

**Google DeepMind — Best Use of Gemma**

Agrim Tycoon is deliberately not entering the Gemini or elderly-hack tracks. A focused, provable local-Gemma story is stronger than broad but weakly demonstrated multi-track claims.

## Non-negotiables

- Gemma must be essential to the product, not a decorative chat panel.
- Submit a public GitHub repository, a public or unlisted demo video of at most three minutes, project details, and the selected track by the event deadline.
- Use only code, data, model weights, and assets the team has the right to use.
- Be accurate about what is live, local, simulated, and deterministic fallback behaviour.

## What must be proven in the demo

1. **Local deployment:** show Gemma running inside the macOS app through the bundled `llama.cpp` / `llama-server` runtime.
2. **Essential game loop:** delegate a meaningful city decision to Gemma; it returns structured triage or a scenario branch that changes visible city stats.
3. **Human accountability:** the player reviews or challenges Gemma rather than blindly accepting an opaque result.
4. **Privacy and resilience:** explain that the scenario, decision, and inference stay local; show the deterministic fallback only as an honest reliability boundary.
5. **Technical specificity:** name the model, GGUF quantization, Apple Silicon target, localhost endpoint, and why that deployment choice is useful.

## Winning narrative

> Innovation City cannot afford to upload every sensitive operational decision. Agrim Tycoon puts a local Gemma chief of staff beside the mayor: it triages urgent incidents, proposes guardrails, and simulates risky choices while the human remains accountable.

The memorable moment is not “ask a chatbot.” It is the player asking local Gemma to stress-test a decision, seeing a structured recommendation and the projected cost to civic control, then making the final call.

## Judge-facing checklist

- [ ] Begin with the playable core loop within 20 seconds.
- [ ] Show the macOS app, not only a slide or browser mock-up.
- [ ] Show a Gemma request and a visible game-state consequence.
- [ ] State the exact local model/runtime and that it runs on-device.
- [ ] Show one limitation or fallback honestly; never imply an unavailable model response is live.
- [ ] End on the user value: private, resilient decision support with human control.
- [ ] Select only **Best Use of Gemma** in Gavel.
