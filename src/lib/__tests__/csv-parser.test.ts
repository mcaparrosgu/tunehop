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

  // Fixture tomado del propio test de Exportify (PlaylistTable.test.tsx):
  // cabeceras reales + columnas opcionales (Genres, audio features, Record Label, Copyrights).
  const cabeceraReal =
    '"Track URI","Track Name","Artist URI(s)","Artist Name(s)","Album URI","Album Name","Album Artist URI(s)","Album Artist Name(s)","Album Release Date","Album Image URL","Disc Number","Track Number","Track Duration (ms)","Track Preview URL","Explicit","Popularity","ISRC","Added By","Added At","Genres","Danceability","Energy","Key","Loudness","Mode","Speechiness","Acousticness","Instrumentalness","Liveness","Valence","Tempo","Time Signature","Record Label","Copyrights"';
  const filaRealConIsrc =
    '"spotify:track:1GrLfs4TEvAZ86HVzXHchS","Crying","spotify:artist:4TXdHyuAOl3rAOFmZ6MeKz","Six by Seven","spotify:album:4iwv7b8gDPKztLkKCbWyhi","Best of Six By Seven","spotify:artist:4TXdHyuAOl3rAOFmZ6MeKz","Six by Seven","2017-02-17","https://i.scdn.co/image/ab67616d0000b273f485821b346237acbbca07ea","1","3","198093","https://p.scdn.co/mp3-preview/daf08df57a49c215c8c53dc5fe88dec5461f15c9?cid=9950ac751e34487dbbe027c4fd7f8e99","false","2","UK4UP1300002","","2020-07-19T09:24:39Z","nottingham indie","0.416","0.971","0","-5.55","1","0.0575","0.00104","0.0391","0.44","0.19","131.988","4","Beggars Banquet","C 2016 Beggars Banquet Records Ltd., P 2016 Beggars Banquet Records Ltd."';
  const filaRealLocalSinIsrc =
    '"spotify:local:::my-mix:Track%20Local","Track Local","","Artista Local","","","","","","","1","1","120000","","false","0","","","2021-01-01T00:00:00Z","","","","","","","","","","","","","",""';

  it("parsea el formato real completo de Exportify (con columnas opcionales)", () => {
    const csv = `${cabeceraReal}\n${filaRealConIsrc}\n${filaRealLocalSinIsrc}\n`;
    const r = parseExportifyCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.totalRows).toBe(2);
    expect(r.tracks).toHaveLength(2);
    const t = r.tracks[0];
    expect(t.name).toBe("Crying");
    expect(t.artists).toEqual(["Six by Seven"]);
    expect(t.album).toBe("Best of Six By Seven");
    expect(t.isrc).toBe("UK4UP1300002");
    expect(t.durationMs).toBe(198093);
    expect(t.uri).toBe("spotify:track:1GrLfs4TEvAZ86HVzXHchS");
  });

  it("una canción local sin ISRC no rompe el parseo ni genera error", () => {
    const csv = `${cabeceraReal}\n${filaRealLocalSinIsrc}\n`;
    const r = parseExportifyCsv(csv);
    expect(r.errors).toEqual([]);
    expect(r.tracks).toHaveLength(1);
    expect(r.tracks[0].name).toBe("Track Local");
    expect(r.tracks[0].isrc).toBeNull();
  });
});
