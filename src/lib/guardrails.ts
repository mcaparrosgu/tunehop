/**
 * TuneHop — Guardrails (barreras de seguridad en capas)
 *
 * Capa 1: Validación de entrada (input validation)
 * Capa 2: Rate limiting (server-side)
 * Capa 3: Filtro de datos personales (PII)
 * Capa 4: Reglas deterministas (límites, patrones)
 * Capa 5: Validación de salida (output validation)
 * Capa 6: Intervención humana (escalado)
 *
 * Prioridad: PRIVACIDAD > SEGURIDAD > DISPONIBILIDAD
 */

/* ============================================================
   CAPA 1 — Validación de entrada
   ============================================================ */

/**
 * Valida que un string de playlist ID de Spotify tenga formato correcto.
 * Spotify IDs son alfanuméricos de 22 caracteres.
 */
export function isValidSpotifyPlaylistId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return /^[a-zA-Z0-9]{22}$/.test(id.trim());
}

/**
 * Valida que un ISRC tenga formato correcto.
 * ISRC: 2 letras + 3 alfanuméricos + 2 dígitos + 5 dígitos = 12 chars.
 */
export function isValidISRC(isrc: string): boolean {
  if (!isrc || typeof isrc !== "string") return false;
  return /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/i.test(isrc.trim());
}

/**
 * Valida que un token de OAuth tenga formato mínimo aceptable.
 * No valida el contenido (eso lo hace el proveedor), solo que no esté vacío
 * y que no contenga caracteres raros que puedan inyectar headers.
 */
export function isValidOAuthToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const t = token.trim();
  if (t.length < 10 || t.length > 2000) return false;
  // No debe contener saltos de línea ni caracteres de control (inyección de headers)
  return !/[\r\n\x00-\x1f]/.test(t);
}

/**
 * Limpia un nombre de playlist para evitar inyección de contenido.
 * Elimina caracteres de control, limita longitud.
 */
export function sanitizePlaylistName(name: string, maxLen = 100): string {
  if (!name || typeof name !== "string") return "";
  return name
    .replace(/[\x00-\x1f\x7f]/g, "") // chars de control
    .replace(/\s+/g, " ") // espacios múltiples → uno
    .trim()
    .slice(0, maxLen);
}

/**
 * Valida que una query de búsqueda no contenga inyecciones de prompt.
 * Detecta patrones comunes: "ignore previous", "system:", "assistant:", etc.
 */
export function isSafeSearchQuery(query: string): boolean {
  if (!query || typeof query !== "string") return false;
  const q = query.toLowerCase().trim();
  const dangerousPatterns = [
    /ignore\s+(previous|all|above)\s+(instructions?|prompts?)/i,
    /you\s+are\s+now/i,
    /system\s*:/i,
    /assistant\s*:/i,
    /human\s*:/i,
    /\[INST\]/i,
    /<\|im_start\|>/i,
    /\{\{.*system.*\}\}/i,
    /<script/i,
    /javascript\s*:/i,
  ];
  return !dangerousPatterns.some((p) => p.test(q));
}

/**
 * Limita el número de IDs que se procesan en una sola petición.
 * Máximo razonable: 100 playlists por migración.
 */
export function validatePlaylistIds(ids: string[]): string[] {
  if (!Array.isArray(ids)) return [];
  // Deduplicar
  const unique = [...new Set(ids.filter((id) => isValidSpotifyPlaylistId(id)))];
  // Limitar
  return unique.slice(0, 100);
}

/* ============================================================
   CAPA 2 — Rate limiting (server-side)
   ============================================================ */

/**
 * Map simple de rate limiting en memoria (suficiente para serverless).
 * En producción se usaría Redis, pero para un MVP esto cubre:
 * - Máximo 5 migraciones por usuario por hora
 * - Máximo 10 búsquedas de candidatos por minuto
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

/* ============================================================
   CAPA 3 — Filtro de datos personales (PII)
   ============================================================ */

/**
 * Detecta si un string contiene datos personales sensibles.
 * No los borra del datos de entrada (la app los necesita internamente),
 * pero detecta si se filtrarían a logs, mensajes de error o salida visible.
 */
export function containsPII(text: string): {
  hasPII: boolean;
  types: string[];
} {
  if (!text || typeof text !== "string") return { hasPII: false, types: [] };

  const types: string[] = [];

  // Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    types.push("email");
  }
  // Teléfono (formatos comunes)
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(text)) {
    types.push("phone");
  }
  // Número de tarjeta de crédito (16 dígitos con o sin espacios)
  if (/\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/.test(text)) {
    types.push("credit_card");
  }
  // DNI/NIE español (8 dígitos + 1 letra, o letra + 7 dígitos + letra)
  if (/\d{8}[A-Z]/i.test(text) || /[XYZ]\d{7}[A-Z]/i.test(text)) {
    types.push("dni");
  }
  // Número de IBAN
  if (/[A-Z]{2}\d{2}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{0,4}/i.test(text)) {
    types.push("iban");
  }
  // Token de API (patrones comunes)
  if (/(sk-|pk-|ghp_|gho_|Bearer\s)[a-zA-Z0-9]{20,}/i.test(text)) {
    types.push("api_token");
  }

  return { hasPII: types.length > 0, types };
}

/**
 * Limpia datos de sesión: borra tokens, cookies y sessionStorage.
 * Se usa al cerrar sesión o al detectar actividad sospechosa.
 */
export function clearSessionData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.clear();
    // Borrar cookies de tunes (tokens OAuth)
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name.startsWith("tunes_")) {
        document.cookie = `${name}=; path=/; max-age=0`;
      }
    });
  } catch {
    // ignore
  }
}

/* ============================================================
   CAPA 4 — Reglas deterministas
   ============================================================ */

/**
 * Valida que una respuesta del Matching Assistant sea un número válido.
 * Solo acepta: "1", "2", "3", "4", "5", "0" (exactamente, sin texto extra).
 */
export function isValidMatchResponse(response: string): boolean {
  if (!response || typeof response !== "string") return false;
  return /^(?:[0-5])$/.test(response.trim());
}

/**
 * Límite de tracks por migración para evitar abusos.
 * Máximo razonable: 10,000 tracks.
 */
const MAX_TRACKS_PER_MIGRATION = 10000;

export function validateTrackCount(count: number): { valid: boolean; limit: number } {
  return { valid: count > 0 && count <= MAX_TRACKS_PER_MIGRATION, limit: MAX_TRACKS_PER_MIGRATION };
}

/**
 * Detecta patrones de abuso en nombres de playlist.
 * Bloquea nombres que parezcan spam, phishing o contenido dañino.
 */
export function isSafePlaylistName(name: string): boolean {
  if (!name || typeof name !== "string") return false;
  const n = name.toLowerCase().trim();
  // Spam
  if (/\b(free|gratis|won|winner|prize|claim|click|buy|cheap|discount)\b/i.test(n)) return false;
  // Phishing
  if (/\b(verify|confirm|update|account|password|login|signin)\b/i.test(n)) return false;
  // Contenido ofensivo básico
  if (/\b(nigger|faggot|retard)\b/i.test(n)) return false;
  return true;
}

/* ============================================================
   CAPA 5 — Validación de salida
   ============================================================ */

/**
 * Valida que un resultado de TIDAL tenga la estructura esperada.
 * Previene que datos malformados lleguen al usuario.
 */
export function validateTidalMatch(match: unknown): match is { tidalId: string; title: string; artist: string } {
  if (!match || typeof match !== "object") return false;
  const m = match as Record<string, unknown>;
  return (
    typeof m.tidalId === "string" &&
    m.tidalId.length > 0 &&
    typeof m.title === "string" &&
    m.title.length > 0 &&
    typeof m.artist === "string" &&
    m.artist.length > 0
  );
}

/**
 * Valida que un array de candidatos tenga estructura válida.
 * Máximo 5 candidatos para no llenar contexto.
 */
export function validateCandidates(candidates: unknown[]): boolean {
  if (!Array.isArray(candidates)) return false;
  if (candidates.length > 5) return false;
  return candidates.every(validateTidalMatch);
}

/* ============================================================
   CAPA 6 — Intervención humana
   ============================================================ */

/**
 * Umbrales de escalado a humano.
 * Si se superan, la migración se pausa y se pide intervención manual.
 */
export const ESCALATION_THRESHOLDS = {
  /** Máximo % de canciones no encontradas antes de pausar */
  maxNotFoundPercent: 50,
  /** Máximo número de reintentos automáticos por canción */
  maxRetriesPerTrack: 3,
  /** Máximo de API errors en cascada antes de abortar */
  maxConsecutiveErrors: 5,
} as const;

/**
 * Evalúa si una migración necesita intervención humana.
 */
export function shouldEscalate(params: {
  totalTracks: number;
  notFound: number;
  consecutiveErrors: number;
  retriesExhausted: number;
}): { escalate: boolean; reason?: string } {
  const { totalTracks, notFound, consecutiveErrors, retriesExhausted } = params;

  if (totalTracks > 0 && notFound / totalTracks > ESCALATION_THRESHOLDS.maxNotFoundPercent / 100) {
    return { escalate: true, reason: "too_many_not_found" };
  }
  if (consecutiveErrors >= ESCALATION_THRESHOLDS.maxConsecutiveErrors) {
    return { escalate: true, reason: "too_many_errors" };
  }
  if (retriesExhausted > 0) {
    return { escalate: true, reason: "retries_exhausted" };
  }
  return { escalate: false };
}
