import { searchTrackByName } from "../tidal";

// Mock del token de usuario (tidal-auth lee cookies de next/headers)
jest.mock("../tidal-auth", () => ({
  TIDAL_API: "https://openapi.tidal.com/v2",
  getValidUserAccessToken: jest.fn().mockResolvedValue("fake-token"),
}));

// Mock global de fetch: probamos el HTTP real de searchText, no una función mockeada.
global.fetch = jest.fn();

/**
 * Formas de respuesta según la especificación de TIDAL v2 (verificadas en vivo):
 * - /searchResults?filter[query]= → `data` es un ARRAY; las refs de track están
 *   en `data[0].relationships.tracks.data`.
 * - /tracks?filter[id]= → `data` es un array de nodos con attributes y relationships.
 */
const searchResponse = {
  ok: true,
  status: 200,
  json: async () => ({
    data: [
      {
        id: "result-1",
        type: "searchResults",
        attributes: { query: "bohemian rhapsody queen" },
        relationships: {
          tracks: { data: [{ id: "534049329", type: "tracks" }, { id: "111", type: "tracks" }] },
        },
      },
    ],
  }),
};

const tracksResponse = {
  ok: true,
  status: 200,
  json: async () => ({
    data: [
      {
        id: "534049329",
        type: "tracks",
        attributes: { title: "Bohemian Rhapsody", isrc: "GBUM71029604" },
        relationships: {
          artists: { data: [{ id: "1", type: "artists", attributes: { name: "Queen" } }] },
        },
      },
    ],
  }),
};

describe("searchTrackByName (HTTP real de searchText)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("usa el parámetro filter[query] y no la query en la ruta", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(searchResponse).mockResolvedValueOnce(tracksResponse);

    await searchTrackByName("Bohemian Rhapsody", "Queen");

    const firstUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    const decoded = decodeURIComponent(firstUrl).replace(/\+/g, " ");
    expect(decoded).toContain("filter[query]=Bohemian Rhapsody Queen");
    // El bug original ponía la query como segmento de ruta:
    expect(firstUrl).not.toMatch(/\/searchResults\//);
  });

  it("parsea `data` como array y devuelve el primer resultado con artista", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(searchResponse).mockResolvedValueOnce(tracksResponse);

    const r = await searchTrackByName("Bohemian Rhapsody", "Queen");

    expect(r).toEqual({ tidalId: "534049329", title: "Bohemian Rhapsody", artist: "Queen" });
  });

  it("pide los detalles por lotes a /tracks con filter[id]", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(searchResponse).mockResolvedValueOnce(tracksResponse);

    await searchTrackByName("Bohemian Rhapsody", "Queen");

    const secondUrl = decodeURIComponent((global.fetch as jest.Mock).mock.calls[1][0] as string);
    expect(secondUrl).toContain("/tracks?");
    expect(secondUrl).toContain("filter[id]=534049329,111");
    expect(secondUrl).toContain("include=artists");
  });

  it("sin resultados de búsqueda → devuelve null sin segunda llamada", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    });

    const r = await searchTrackByName("Nada", "Nadie");

    expect(r).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
