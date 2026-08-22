# Agrim Tycoon

One week. Three jobs. Zero time.

Agrim Tycoon is a high-fidelity browser management game about balancing the 65labs community, Code with AI students, and a demanding SpaceXAI role. Gemma acts as Agrim's locally hosted chief of staff while Gemini directs dynamic consequences.

## Stack

- React, TypeScript, and Phaser 4
- vinext and Vite
- Local Gemma through `llama.cpp`
- Gemini through the Google API
- Zo Computer deployment target

The complete concept and deployment decisions live in [`docs/IDEA.md`](docs/IDEA.md) and [`docs/tech-stack.md`](docs/tech-stack.md).

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The game remains playable without configured models by using deterministic fallback responses.

## AI configuration

Gemma is expected to run as an OpenAI-compatible `llama-server` process:

```text
GEMMA_BASE_URL=http://127.0.0.1:8080/v1
GEMMA_MODEL=gemma-local
```

Gemini requires a server-side Google AI API key:

```text
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

Never expose either credential through a `NEXT_PUBLIC_*` environment variable.

## Validation

```bash
npm run build
npm test
npm run lint
```

## Zo deployment

Deploy the web application as a public Zo HTTP service. Run `llama-server` separately as a private Zo process service bound to `127.0.0.1`. Configure secrets through Zo's service environment variables.
