# Agrim Tycoon — Tech Stack

## Decision

Agrim Tycoon will be built as a high-fidelity browser game and deployed to a Zo Computer Basic instance.

The game will use:

- **Phaser 4** for the real-time game world.
- **React** for menus, dialogue, HUD, and ending screens.
- **Gemma 4**, self-hosted on Zo through `llama.cpp`, for task classification and delegation.
- **Gemini**, accessed through Google's API, for dynamic story consequences and multimodal features.

The browser build can be wrapped with Electron later, but desktop packaging is not part of the hackathon MVP.

## Target infrastructure

Zo Computer Basic currently provides:

- 4 CPU cores,
- 32 GB RAM,
- 100 GB or more of storage,
- always-on compute,
- up to 5 hosted services,
- up to 3 custom domains.

The deployment must be designed for CPU-only inference. No GPU is assumed.

## Architecture

```text
Player's browser
       |
       v
Public Zo HTTP service: agrim-tycoon
├── Vite production build
├── React interface
├── Phaser 4 game
├── Hono/Bun API
├── SQLite data
└── Gemini API client
       |
       v
Private Zo process service: gemma-local
├── llama-server
└── Gemma 4 E2B Instruct Q4 GGUF
```

## Frontend

| Technology | Responsibility |
| --- | --- |
| Vite | Development server and production bundling |
| React | Menus, dialogue panels, HUD, onboarding, and endings |
| TypeScript | Shared types for game state and AI contracts |
| Phaser 4 | Character movement, stations, timers, animation, particles, lighting, and audio |
| Tailwind CSS | Styling React interface elements |
| Zustand | Shared state between React and Phaser |

The game targets a 16:9 layout, designed primarily for 1920×1080 displays. Phaser renders the office while React overlays information-heavy UI.

## Backend

| Technology | Responsibility |
| --- | --- |
| Bun | JavaScript runtime and package manager on Zo |
| Hono | Static file server and game API |
| Zod | Runtime validation of AI responses |
| SQLite | Optional run history, scores, and cached AI responses |

The Hono server will:

- serve the Vite production build,
- expose game-specific API endpoints,
- call the private Gemma server,
- call the Gemini API,
- validate every model response,
- provide deterministic fallbacks when AI is unavailable.

## Gemma

Gemma is not supplied by Zo's built-in model catalogue. It will be downloaded and self-hosted inside the Zo Computer.

### Runtime

- `llama.cpp`
- `llama-server`
- OpenAI-compatible local HTTP API
- Bound to `127.0.0.1` so it is not publicly accessible
- Registered as a Zo `process` service so Zo restarts it automatically

Internal endpoint:

```text
http://127.0.0.1:8080/v1/chat/completions
```

### Initial model

```text
Gemma 4 E2B Instruct
GGUF Q4_0 quantization
```

This is the initial choice because its approximate model memory requirement is small enough for the Basic plan and it should offer the best CPU latency of the Gemma 4 options.

Gemma 4 E4B Instruct Q4 may be evaluated later. It should only replace E2B if representative requests complete within the game's latency budget on Zo's four CPU cores.

Larger 12B, 26B, and 31B models are out of scope for the Basic plan because CPU inference would likely be too slow for real-time gameplay.

### Gameplay responsibility

Gemma acts as Agrim's AI chief of staff. It receives a short task, relevant policy, and a small number of player corrections. It returns structured data such as:

```json
{
  "category": "possible_scam",
  "urgency": 8,
  "recommendedAction": "request_evidence",
  "confidence": 0.72,
  "reason": "The post promises unrealistic financial returns."
}
```

Gemma will handle:

- community moderation classification,
- task urgency scoring,
- student-question triage,
- SpaceXAI report prioritization,
- delegation recommendations.

Player corrections are added as future prompt examples. This is in-context calibration, not model fine-tuning.

## Gemini

Gemini is accessed directly through Google's `@google/genai` SDK. It does not run locally on Zo.

Gemini will handle:

- dynamic incidents and dialogue,
- consequences based on game state,
- cross-role story connections,
- the SpaceXAI multimodal challenge,
- final performance reviews.

Gemini credentials are stored as Zo service environment variables and must never be included in the browser bundle.

Gemini Live voice interaction with Elon is a stretch goal, not an MVP dependency.

## AI reliability rules

The real-time loop must never wait indefinitely for a model.

- Keep Gemma prompts short, preferably below 2,000 tokens.
- Queue Gemma inference with a concurrency of one.
- Warm Gemma when the service starts.
- Perform inference asynchronously while gameplay continues.
- Validate responses with Zod.
- Retry malformed responses once.
- Apply a strict timeout.
- Cache results for repeated scenarios.
- Fall back to handcrafted results when a model fails.

Handcrafted anchor scenarios control the main story. AI varies wording, judgment, and consequences without being allowed to break the game state.

## Zo services

### `agrim-tycoon`

```text
Mode: http
Runtime: Bun
Visibility: public
Purpose: game frontend and backend
```

Expected environment variables:

```text
PORT=<injected by Zo>
GEMINI_API_KEY=<secret>
GEMMA_BASE_URL=http://127.0.0.1:8080/v1
DATABASE_PATH=<workspace path>/agrim-tycoon.db
```

### `gemma-local`

```text
Mode: process
Runtime: llama.cpp
Visibility: private localhost only
Purpose: Gemma inference
```

The model process does not need a public endpoint and should not consume a public hosted-service slot.

## High-fidelity requirements

High fidelity will come from presentation quality rather than 3D complexity:

- illustrated 2D isometric office,
- animated Agrim character,
- visually distinct 65labs, Code with AI, and SpaceXAI stations,
- layered ambient audio and responsive sound effects,
- lighting, bloom, shadows, and colour grading,
- animated alerts and patience indicators,
- cinematic day transitions,
- polished onboarding and ending screens,
- no visible blocking AI loading screens.

All essential visual and audio assets are preloaded. The browser performs rendering, so Zo's server CPU does not determine graphical fidelity.

## Deployment strategy

1. Build the frontend with Vite.
2. Serve the generated assets from the Hono application.
3. Register the application as a public Zo HTTP service.
4. Install `llama.cpp` and the selected Gemma GGUF model on Zo.
5. Register `llama-server` as a private Zo process service.
6. Configure secrets through Zo service environment variables.
7. Attach a custom domain after the public Zo URL is stable.

## Out of scope for the MVP

- Electron packaging
- user authentication
- multiplayer
- cloud-hosted database
- Gemma fine-tuning
- large Gemma models
- multiple game rooms
- dependency on live AI for core progression

## References

- [Zo Computer pricing](https://www.zo.computer/pricing)
- [Zo hosting options](https://www.substrate.computer/docs/hosting)
- [Zo services](https://www.substrate.computer/docs/services)
- [Phaser 4](https://phaser.io/phaser4)
- [Gemma 4 overview](https://ai.google.dev/gemma/docs/core)
- [Gemma with llama.cpp](https://ai.google.dev/gemma/docs/integrations/llamacpp)
- [Google GenAI SDK](https://ai.google.dev/gemini-api/docs/libraries)
