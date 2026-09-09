import { searchByISRCTool, searchByNameTool, searchCandidatesTool } from "../tidal-tools";
import { searchTrackByISRC, searchTrackByName, searchTrackCandidates } from "../tidal";

// Mock the underlying functions
jest.mock("../tidal", () => ({
  searchTrackByISRC: jest.fn(),
  searchTrackByName: jest.fn(),
  searchTrackCandidates: jest.fn(),
}));

describe("Tidal Tools — Poka-yoke design", () => {
  const mockMatch = {
    tidalId: "12345",
    title: "Test Song",
    artist: "Test Artist",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("search_by_isrc", () => {
    it("valida formato ISRC: rechaza strings vacíos", async () => {
      const result = await searchByISRCTool("");
      expect(result).toBeNull();
    });

    it("valida formato ISRC: rechaza longitud incorrecta", async () => {
      const result = await searchByISRCTool("USRC1760783"); // 11 chars
      expect(result).toBeNull();

      const result2 = await searchByISRCTool("USRC176078390"); // 13 chars
      expect(result2).toBeNull();
    });

    it("normaliza ISRC a mayúsculas antes de buscar", async () => {
      (searchTrackByISRC as jest.Mock).mockResolvedValue(mockMatch);

      await searchByISRCTool("usrc17607839");

      expect(searchTrackByISRC).toHaveBeenCalledWith("USRC17607839");
    });

    it("devuelve match cuando la API encuentra el track", async () => {
      (searchTrackByISRC as jest.Mock).mockResolvedValue(mockMatch);

      const result = await searchByISRCTool("USRC17607839");

      expect(result).toEqual(mockMatch);
    });

    it("devuelve null cuando la API no encuentra nada", async () => {
      (searchTrackByISRC as jest.Mock).mockResolvedValue(null);

      const result = await searchByISRCTool("USRC17607839");

      expect(result).toBeNull();
    });

    it("rechaza null/undefined como parámetro", async () => {
      const result1 = await searchByISRCTool(null as any);
      const result2 = await searchByISRCTool(undefined as any);
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe("search_by_name", () => {
    it("requiere name y artist no vacíos", async () => {
      const result1 = await searchByNameTool("", "Artist");
      const result2 = await searchByNameTool("Song", "");
      const result3 = await searchByNameTool("  ", "Artist");
      const result4 = await searchByNameTool("Song", "  ");

      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toBeNull();
      expect(result4).toBeNull();
    });

    it("hace trim de los parámetros antes de buscar", async () => {
      (searchTrackByName as jest.Mock).mockResolvedValue(mockMatch);

      await searchByNameTool("  Song Name  ", "  Artist Name  ");

      expect(searchTrackByName).toHaveBeenCalledWith("Song Name", "Artist Name");
    });

    it("devuelve match cuando la API encuentra", async () => {
      (searchTrackByName as jest.Mock).mockResolvedValue(mockMatch);

      const result = await searchByNameTool("Bohemian Rhapsody", "Queen");

      expect(result).toEqual(mockMatch);
    });

    it("devuelve null cuando la API no encuentra", async () => {
      (searchTrackByName as jest.Mock).mockResolvedValue(null);

      const result = await searchByNameTool("Song", "Artist");

      expect(result).toBeNull();
    });

    it("rechaza null/undefined", async () => {
      const result1 = await searchByNameTool(null as any, "Artist");
      const result2 = await searchByNameTool("Song", null as any);
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe("search_candidates", () => {
    it("requiere name y artist", async () => {
      const result1 = await searchCandidatesTool("", "Artist");
      const result2 = await searchCandidatesTool("Song", "");
      expect(result1).toEqual({ candidates: [] });
      expect(result2).toEqual({ candidates: [] });
    });

    it("hace clamp de limit entre 2 y 5", async () => {
      (searchTrackCandidates as jest.Mock).mockResolvedValue([mockMatch]);

      // limit < 2 -> clamp a 2
      await searchCandidatesTool("Song", "Artist", 0);
      expect(searchTrackCandidates).toHaveBeenLastCalledWith("Song", "Artist", 2);

      // limit = 1 -> clamp a 2
      await searchCandidatesTool("Song", "Artist", 1);
      expect(searchTrackCandidates).toHaveBeenLastCalledWith("Song", "Artist", 2);

      // limit = 3 -> ok
      await searchCandidatesTool("Song", "Artist", 3);
      expect(searchTrackCandidates).toHaveBeenLastCalledWith("Song", "Artist", 3);

      // limit > 5 -> clamp a 5
      await searchCandidatesTool("Song", "Artist", 10);
      expect(searchTrackCandidates).toHaveBeenLastCalledWith("Song", "Artist", 5);

      // limit = 20 -> clamp a 5
      await searchCandidatesTool("Song", "Artist", 20);
      expect(searchTrackCandidates).toHaveBeenLastCalledWith("Song", "Artist", 5);
    });

    it("usa default 3 si no se pasa limit", async () => {
      (searchTrackCandidates as jest.Mock).mockResolvedValue([mockMatch]);

      await searchCandidatesTool("Song", "Artist");

      expect(searchTrackCandidates).toHaveBeenCalledWith("Song", "Artist", 3);
    });

    it("devuelve array de candidatos", async () => {
      const candidates = [mockMatch, { ...mockMatch, tidalId: "67890" }];
      (searchTrackCandidates as jest.Mock).mockResolvedValue(candidates);

      const result = await searchCandidatesTool("Hallelujah", "Leonard Cohen", 3);

      expect(result).toEqual({ candidates });
    });

    it("devuelve array vacío si API falla", async () => {
      (searchTrackCandidates as jest.Mock).mockResolvedValue([]);

      const result = await searchCandidatesTool("Song", "Artist", 3);

      expect(result).toEqual({ candidates: [] });
    });

    it("hace trim de parámetros", async () => {
      (searchTrackCandidates as jest.Mock).mockResolvedValue([mockMatch]);

      await searchCandidatesTool("  Song  ", "  Artist  ", 3);

      expect(searchTrackCandidates).toHaveBeenCalledWith("Song", "Artist", 3);
    });
  });
});