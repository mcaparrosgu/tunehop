import { parseExportifyCsv } from "../csv-parser";

// Cabeceras reales de Exportify (inglés y español), con el escape que usa:
// artistas separados por ", " y comas internas escapadas como "\,"
const cabeceraEn =
  '"Added By","Added At","Track URI","Track Name","Artist URI(s)","Artist Name(s)","Album URI","Album Name","Album Artist URI(s)","Album Artist Name(s)","Album Release Date","Album Image URL","Disc Number","Track Number","Track Duration (ms)","Track Preview URL","Explicit?","Popularity","ISRC"';
const cabeceraEs =
  '"Añadido por","Añadido en","URI de la canción","Nombre de la canción","URI(s) del artista","Nombre(s) del artista","URI del álbum","Nombre del álbum","Nombre(s) del artista del álbum","Fecha de lanzamiento del álbum","Duración de la canción (ms)","Explícito","Popularidad","ISRC"';

function filaEn(isrc: string, name: string, artists: string): string {
  return `"","2024-01-01","spotify:track:abc","${name}","spotify:artist:1","${artists}","spotify:album:1","Álbum","","",2024,"",1,1,210000,"",false,50,"${isrc}"`;
}

describe("parseExportifyCsv", () => {
  it("parsea un CSV real de Exportify (inglés) con ISRC", () => {
    const csv = `${cabeceraEn}\n${filaEn("USRC17607839", "Canción, con coma", "Artista A, feat. B\\, con coma, Artista C")}\n`;
    const r = parseExportifyCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.totalRows).toBe(1);
    expect(r.tracks).toHaveLength(1);
    const t = r.tracks[0];
    expect(t.name).toBe("Canción, con coma");
    expect(t.artists).toEqual(["Artista A", "feat. B, con coma", "Artista C"]);
    expect(t.isrc).toBe("USRC17607839");
  });

  it("parsea cabeceras en español", () => {
    const csv = `${cabeceraEs}\n"uri-añadido","2024-05-01","spotify:track:xyz","Nombre","spotify:artist:1","Paco, Ana","spotify:album:1","Álbum ES","",2020,185000,"false",50,"GBARL1800001"\n`;
    const r = parseExportifyCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.tracks).toHaveLength(1);
    expect(r.tracks[0].name).toBe("Nombre");
    expect(r.tracks[0].artists).toEqual(["Paco", "Ana"]);
    expect(r.tracks[0].isrc).toBe("GBARL1800001");
    expect(r.tracks[0].durationMs).toBe(185000);
  });

  it("quita el BOM UTF-8", () => {
    const csv = `\uFEFF${cabeceraEn}\n${filaEn("USRC17607839", "X", "A")}\n`;
    const r = parseExportifyCsv(csv);
    expect(r.tracks).toHaveLength(1);
  });

  it("acepta \\r\\n de Excel", () => {
    const csv = `${cabeceraEn}\r\n${filaEn("USRC17607839", "X", "A")}\r\n`;
    const r = parseExportifyCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.tracks).toHaveLength(1);
  });

  it("ISRC en minúsculas se normaliza", () => {
    const r = parseExportifyCsv(`${cabeceraEn}\n${filaEn("usrc17607839", "X", "A")}\n`);
    expect(r.tracks[0].isrc).toBe("USRC17607839");
  });

  it("ISRC inválido → isrc null + error reportado", () => {
    const r = parseExportifyCsv(`${cabeceraEn}\n${filaEn("US-RC-17607839", "X", "A")}\n`);
    expect(r.tracks[0].isrc).toBeNull();
    expect(r.errors[0]).toContain("ISRC inválido");
  });

  it("sin ISRC → isrc null, sin error", () => {
    const csv = `${cabeceraEn}\n${filaEn("", "X", "A")}\n`;
    const r = parseExportifyCsv(csv);
    expect(r.tracks[0].isrc).toBeNull();
    expect(r.errors).toEqual([]);
  });

  it("filas sin nombre se descartan con error", () => {
    const csv = `${cabeceraEn}\n${filaEn("USRC17607839", "", "A")}\n`;
    const r = parseExportifyCsv(csv);
    expect(r.tracks).toHaveLength(0);
    expect(r.errors[0]).toContain("Fila 2");
  });

  it("archivo vacío o solo cabecera → vacío", () => {
    expect(parseExportifyCsv("").tracks).toHaveLength(0);
    const soloCabecera = parseExportifyCsv(cabeceraEn);
    expect(soloCabecera.tracks).toHaveLength(0);
    expect(soloCabecera.errors).toHaveLength(1);
  });

  it("cabecera sin nombre de canción → error", () => {
    const csv = `"ISRC","Album"\n"USRC17607839","Álbum"\n`;
    const r = parseExportifyCsv(csv);
    expect(r.tracks).toHaveLength(0);
    expect(r.errors[0]).toContain("columna");
  });

  it("campos entre comillas con comas y comillas dobles", () => {
    const csv = `"Track Name","Artist Name(s)","ISRC"\n"Mi ""canción"", la buena","A","USRC17607839"\n`;
    const r = parseExportifyCsv(csv);
    expect(r.tracks[0].name).toBe('Mi "canción", la buena');
    expect(r.tracks[0].artists).toEqual(["A"]);
  });
});
