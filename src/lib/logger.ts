/**
 * TuneHop — Logger estructurado para observabilidad.
 *
 * Estructura JSON que Vercel Functions loguea automáticamente:
 * { ts, level, route, method, status, ip, durationMs, message, meta? }
 *
 * Prioridad: MÍNIMA (sin dependencias externas, sin Sentry ni Datadog para el MVP).
 * Cada línea es un objeto JSON parseable desde el dashboard de Vercel → Functions → Logs.
 */

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: LogLevel;
  route: string;
  method: string;
  status?: number;
  ip?: string;
  durationMs?: number;
  message: string;
  meta?: Record<string, unknown>;
}

export function log(level: LogLevel, route: string, msg: string, extra?: Partial<LogEntry>) {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    route,
    method: extra?.method ?? "GET",
    ...extra,
    message: msg,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/**
 * Wrapper para medir duración de una ruta API.
 * Uso: const done = logStart("/api/tidal/search", request);
 *      ... al finalizar: done(200, { isrc });
 */
export function logStart(route: string, request: Request, meta?: Record<string, unknown>) {
  const method = request.method;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const start = Date.now();
  log("info", route, "request_start", { method, ip, ...meta });
  return (status: number, extra?: Record<string, unknown>) => {
    const durationMs = Date.now() - start;
    const level: LogLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    log(level, route, "request_end", { method, ip, status, durationMs, ...extra });
  };
}
