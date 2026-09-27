import { isValidISRC } from "./guardrails";

export interface CsvTrack {
  isrc: string | null;
  name: string;
  artists: string[];
  album: string;
  durationMs: number | null;
  uri: string | null;
}

export interface ParseCsvResult {
  tracks: CsvTrack[];
  errors: string[];
  totalRows: number;
}

type ColumnKey = "name" | "artists" | "album" | "isrc" | "durationMs" | "uri";

function stripBom(text: string): string {
  return text.length > 0 && text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function parseCsvRow(row: string, separator = ","): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const next = row[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

function splitArtists(raw: string): string[] {
  const placeholder = "\u0000";
  const temp = raw.replace(/\\,/g, placeholder);
  return temp
    .split(",")
    .map((part) => part.trim().replace(new RegExp(placeholder, "g"), ","))
    .filter(Boolean);
}

const HEADER_MAP: Record<string, ColumnKey> = {
  trackname: "name",
  nombredelacancion: "name",
  titulo: "name",
  title: "name",
  artistnames: "artists",
  artistname: "artists",
  nombredelartista: "artists",
  nombresdelartista: "artists",
  artistas: "artists",
  albumname: "album",
  nombredelalbum: "album",
  album: "album",
  isrc: "isrc",
  trackdurationms: "durationMs",
  duraciondelacancionms: "durationMs",
  duracion: "durationMs",
  duration: "durationMs",
  trackuri: "uri",
  uridelacancion: "uri",
  uri: "uri",
  spotifyuri: "uri",
};

export function parseExportifyCsv(csvText: string): ParseCsvResult {
  const text = stripBom(csvText).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return {
      tracks: [],
      errors: ["El archivo no tiene filas de datos."],
      totalRows: 0,
    };
  }

  const headers = parseCsvRow(lines[0]).map((h) => normalizeHeader(h.trim()));
  const columns = new Map<ColumnKey, number>();

  headers.forEach((header, index) => {
    const key = HEADER_MAP[header];
    if (key && !columns.has(key)) {
      columns.set(key, index);
    }
  });

  if (!columns.has("name")) {
    return {
      tracks: [],
      errors: ["No se encontró la columna de nombre de canción."],
      totalRows: 0,
    };
  }

  const nameIdx = columns.get("name")!;
  const artistsIdx = columns.get("artists");
  const albumIdx = columns.get("album");
  const isrcIdx = columns.get("isrc");
  const durationIdx = columns.get("durationMs");
  const uriIdx = columns.get("uri");

  const tracks: CsvTrack[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (!row.trim()) continue;

    const fields = parseCsvRow(row);
    const name = (fields[nameIdx] ?? "").trim();

    if (!name) {
      errors.push(`Fila ${i + 1}: falta el nombre de la canción.`);
      continue;
    }

    const rawIsrc = isrcIdx !== undefined ? (fields[isrcIdx] ?? "").trim() : "";
    const isrc = rawIsrc && isValidISRC(rawIsrc) ? rawIsrc.toUpperCase() : null;
    if (rawIsrc && !isrc) {
      errors.push(`Fila ${i + 1}: ISRC inválido (“${rawIsrc}”).`);
    }

    const rawArtists = artistsIdx !== undefined ? (fields[artistsIdx] ?? "").trim() : "";
    const artists = rawArtists ? splitArtists(rawArtists) : [];

    const durationRaw = durationIdx !== undefined ? (fields[durationIdx] ?? "").trim() : "";
    const durationMs = durationRaw ? parseInt(durationRaw, 10) || null : null;

    const album = albumIdx !== undefined ? (fields[albumIdx] ?? "").trim() : "";
    const uri = uriIdx !== undefined ? (fields[uriIdx] ?? "").trim() || null : null;

    tracks.push({ isrc, name, artists, album, durationMs, uri });
  }

  return { tracks, errors, totalRows: lines.length - 1 };
}
