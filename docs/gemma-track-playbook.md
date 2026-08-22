# Agrim Tycoon — Best Use of Gemma Playbook

## The one-sentence pitch

**Agrim Tycoon is a local-first city-management game where a bundled Gemma chief of staff helps the mayor make private, high-stakes decisions without removing human accountability.**

## Why it can win

The strongest claim is not that Agrim Tycoon “uses AI.” It proves that an open, locally deployable model is the right product choice:

- operational and community context stays on the player’s Mac;
- Gemma is inside the actual decision loop;
- the model produces structured, bounded outcomes that visibly affect the game;
- the player is still responsible for the final call;
- local inference keeps the demo resilient without a cloud-key dependency.

## Demo sequence: 180 seconds

| Time | Action | Proof to make explicit |
| --- | --- | --- |
| 0:00–0:15 | Open the packaged Agrim Tycoon app. | “This is a local macOS build with Gemma bundled.” |
| 0:15–0:35 | Introduce Innovation City and the competing priorities. | The problem is consequential operational judgment, not entertainment-only chat. |
| 0:35–1:10 | Select a live incident and delegate to Gemma. | Show the prompt context, structured recommendation, and state update. |
| 1:10–1:45 | Choose the guardrail / stress-test scenario. | Gemma quantifies trade-offs and gives a narrative branch; the mayor decides. |
| 1:45–2:10 | Show localhost runtime evidence and the packaged model. | `llama-server`, `127.0.0.1`, GGUF model, Apple Silicon. |
| 2:10–2:35 | Turn off or bypass the runtime once. | The game reports its deterministic fallback honestly and remains playable. |
| 2:35–3:00 | Return to the successful live result and close. | Local Gemma makes privacy, deployability, and human control possible. |

## What not to say

- Do not claim a response is live Gemma if it came from the fallback.
- Do not describe Gemma as a generic chatbot or a replacement for human judgment.
- Do not lead with model jargon before explaining the city decision it improves.
- Do not enter a non-Gemma prize track or mention competing-model features in the submission.

## Evidence to capture before recording

- [ ] Screenshot: landing screen with **Play the game**.
- [ ] Screen recording: one Gemma triage response changing game stats.
- [ ] Screen recording: one Gemma stress-test / guardrail branch changing civic control.
- [ ] Terminal or in-app evidence: local `llama-server` health check.
- [ ] Screenshot: packaged app icon and DMG.
- [ ] Screenshot or log: model manifest source, SHA-256, and Gemma notice staged.
- [ ] Recording: explicit fallback label after intentionally stopping the local server.

## Submission quality bar

Before locking Gavel, use [submission.md](submission.md) to confirm the repository is public, the video is under three minutes, the demo link works without login, and **Best Use of Gemma** is the only selected prize track.
