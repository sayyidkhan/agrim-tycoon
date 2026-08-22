const DEFAULT_MAX_BODY_BYTES = 16_384;

export class RequestError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export async function readJsonObject(
  request: Request,
  maxBytes = DEFAULT_MAX_BODY_BYTES,
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestError("Content-Type must be application/json", 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestError(`Request body must be ${maxBytes} bytes or smaller`, 413);
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    throw new RequestError(`Request body must be ${maxBytes} bytes or smaller`, 413);
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new RequestError("Request body must be valid JSON");
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new RequestError("Request body must be a JSON object");
  }

  return value as Record<string, unknown>;
}

export function stringField(
  body: Record<string, unknown>,
  name: string,
  options: { required?: boolean; maxLength?: number } = {},
): string | undefined {
  const value = body[name];
  if (value === undefined || value === null) {
    if (options.required) throw new RequestError(`${name} is required`);
    return undefined;
  }
  if (typeof value !== "string") throw new RequestError(`${name} must be a string`);

  const trimmed = value.trim();
  if (options.required && !trimmed) throw new RequestError(`${name} is required`);
  if (trimmed.length > (options.maxLength ?? 2_000)) {
    throw new RequestError(`${name} is too long`);
  }
  return trimmed || undefined;
}

export function enumField<const T extends readonly string[]>(
  body: Record<string, unknown>,
  name: string,
  allowed: T,
  fallback: T[number],
): T[number] {
  const value = body[name];
  if (value === undefined) return fallback;
  if (typeof value !== "string" || !allowed.includes(value as T[number])) {
    throw new RequestError(`${name} must be one of: ${allowed.join(", ")}`);
  }
  return value as T[number];
}

export function boundedContext(value: unknown, maxLength = 3_000): string | undefined {
  if (value === undefined || value === null) return undefined;
  let serialized: string;
  if (typeof value === "string") {
    serialized = value.trim();
  } else {
    try {
      serialized = JSON.stringify(value);
    } catch {
      throw new RequestError("context must be JSON-serializable");
    }
  }
  if (serialized.length > maxLength) throw new RequestError("context is too long");
  return serialized || undefined;
}

export function jsonError(error: unknown): Response {
  if (error instanceof RequestError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  return Response.json({ error: "Unexpected server error" }, { status: 500 });
}

export function envInt(name: string, fallback: number, min: number, max: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
}

export async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

