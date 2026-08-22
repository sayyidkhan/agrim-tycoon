type JsonRecord = Record<string, unknown>;

interface TauriWindow extends Window {
  __TAURI__?: { core?: { invoke?: <T>(command: string, args?: JsonRecord) => Promise<T> } };
  __TAURI_INTERNALS__?: { invoke?: <T>(command: string, args?: JsonRecord) => Promise<T> };
}

export type GemmaRequest =
  | {
      mode?: "triage";
      role: "community" | "teaching" | "spacex";
      message: string;
      context?: unknown;
    }
  | {
      mode: "elon_twist";
      decision: string;
      scenario: string;
      gameState?: unknown;
    };

export interface GemmaTriageResponse {
  result?: {
    recommendedAction?: string;
    confidence?: number;
    reason?: string;
  };
  degraded?: boolean;
}

export interface GemmaElonResponse {
  result?: {
    direction?: "accelerator" | "disruptor";
    headline?: string;
    narrative?: string;
    statChanges?: Record<string, number>;
    nextHook?: string;
  };
  degraded?: boolean;
}

export interface WorldConsequenceRequest {
  mode: "consequence";
  decision: string;
  scenario: string;
  gameState: unknown;
}

export interface WorldConsequenceResponse {
  result: { headline: string; narrative: string };
  degraded?: boolean;
}

function tauriInvoke() {
  if (typeof window === "undefined") return undefined;
  const runtime = window as TauriWindow;
  return runtime.__TAURI__?.core?.invoke ?? runtime.__TAURI_INTERNALS__?.invoke;
}

export function isTauriRuntime(): boolean {
  return Boolean(tauriInvoke());
}

/**
 * One transport contract for the bundled desktop model and the web API.
 * The Rust command accepts `{ payload }` and mirrors the route's JSON response.
 */
export async function requestGemma<T extends GemmaTriageResponse | GemmaElonResponse>(
  payload: GemmaRequest,
): Promise<T> {
  const invoke = tauriInvoke();
  if (invoke) return invoke<T>("gemma_request", { payload });

  const response = await fetch("/api/ai/gemma", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Gemma request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function offlineConsequence(input: WorldConsequenceRequest): WorldConsequenceResponse {
  const variants = [
    {
      headline: "The city absorbs the decision.",
      narrative: "Agrim's call restores momentum, but the next neglected system is already demanding the mayor's attention.",
    },
    {
      headline: "Progress creates a new trade-off.",
      narrative: "The immediate problem clears. Innovation City moves faster, and its people now expect Agrim to keep pace.",
    },
    {
      headline: "The intervention holds—for now.",
      narrative: "The dashboards stabilise, but every shortcut leaves a debt that the mayor may have to repay later.",
    },
  ];
  return {
    result: variants[hashString(`${input.decision}|${input.scenario}|${JSON.stringify(input.gameState)}`) % variants.length],
    degraded: true,
  };
}

/** Web keeps its Gemini reaction; desktop deliberately stays offline and key-free. */
export async function requestWorldConsequence(
  payload: WorldConsequenceRequest,
): Promise<WorldConsequenceResponse> {
  if (isTauriRuntime()) return offlineConsequence(payload);

  try {
    const response = await fetch("/api/ai/gemini", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Gemini request failed (${response.status})`);
    return (await response.json()) as WorldConsequenceResponse;
  } catch {
    return offlineConsequence(payload);
  }
}
