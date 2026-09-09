import { getAllPlaylistTracks } from "../spotify";
import { extractArtist } from "../tidal";

// Mock the Spotify auth module BEFORE importing spotify functions
jest.mock("../spotify-auth", () => ({
  getValidAccessToken: jest.fn(),
  getRefreshTokenFromCookies: jest.fn(),
  saveTokensToCookies: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
  }),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe("Spotify API — getAllPlaylistTracks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maneja respuesta paginada del endpoint /items", async () => {
    const { getValidAccessToken } = await import("../spotify-auth");
    (getValidAccessToken as jest.Mock).mockResolvedValue("fake-token");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { item: { id: "1", external_ids: { isrc: "ISRC1" }, name: "Song 1", artists: [{ name: "Artist 1" }] } },
            { item: { id: "2", external_ids: { isrc: "ISRC2" }, name: "Song 2", artists: [{ name: "Artist 2" }] } },
          ],
          next: "https://api.spotify.com/v1/playlists/123/items?offset=2",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { item: { id: "3", external_ids: { isrc: "ISRC3" }, name: "Song 3", artists: [{ name: "Artist 3" }] } },
          ],
          next: null,
        }),
      });

    const tracks = await getAllPlaylistTracks("playlist-123");

    expect(tracks).toHaveLength(3);
    expect(tracks[0].isrc).toBe("ISRC1");
    expect(tracks[1].isrc).toBe("ISRC2");
    expect(tracks[2].isrc).toBe("ISRC3");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("maneja formato legacy (entry.track en vez de entry.item)", async () => {
    const { getValidAccessToken } = await import("../spotify-auth");
    (getValidAccessToken as jest.Mock).mockResolvedValue("fake-token");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { track: { id: "legacy-1", external_ids: { isrc: "ISRC_LEGACY" }, name: "Legacy Song", artists: [{ name: "Legacy Artist" }] } },
        ],
        next: null,
      }),
    });

    const tracks = await getAllPlaylistTracks("playlist-123");

    expect(tracks).toHaveLength(1);
    expect(tracks[0].isrc).toBe("ISRC_LEGACY");
  });

  it("incluye tracks con y sin ISRC (el filtrado se hace después en migrando/page)", async () => {
    const { getValidAccessToken } = await import("../spotify-auth");
    (getValidAccessToken as jest.Mock).mockResolvedValue("fake-token");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { item: { external_ids: { isrc: null }, name: "No ISRC", artists: [{ name: "Artist" }], id: "1" } },
          { item: { external_ids: { isrc: "HAS_ISRC" }, name: "Has ISRC", artists: [{ name: "Artist" }], id: "2" } },
        ],
        next: null,
      }),
    });

    const tracks = await getAllPlaylistTracks("playlist-123");

    expect(tracks).toHaveLength(2);
    expect(tracks.find((t) => t.isrc === "HAS_ISRC")).toBeDefined();
    expect(tracks.find((t) => t.isrc === null)).toBeDefined();
  });

  it("devuelve array vacío si token es null", async () => {
    const { getValidAccessToken } = await import("../spotify-auth");
    (getValidAccessToken as jest.Mock).mockResolvedValue(null);

    const tracks = await getAllPlaylistTracks("playlist-123");

    expect(tracks).toHaveLength(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe("Tidal — extractArtist", () => {
  it("extrae artista de relationships.artists.data[0].attributes.name", () => {
    const node = {
      id: "1",
      type: "tracks",
      attributes: { title: "Song" },
      relationships: {
        artists: {
          data: [{ id: "a1", type: "artists", attributes: { name: "Test Artist" } }],
        },
      },
    };

    expect(extractArtist(node)).toBe("Test Artist");
  });

  it("maneja artists.data vacío", () => {
    const node = {
      id: "1",
      type: "tracks",
      attributes: { title: "Song" },
      relationships: { artists: { data: [] } },
    };

    expect(extractArtist(node)).toBe("");
  });

  it("maneja relationships faltante", () => {
    const node = {
      id: "1",
      type: "tracks",
      attributes: { title: "Song" },
    };

    expect(extractArtist(node)).toBe("");
  });
});