"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

interface NotFoundTrack {
  name: string;
  artists: string[];
  isrc: string;
}

interface MigrationProgress {
  stage: "idle" | "fetching" | "matching" | "creating" | "adding" | "done" | "error";
  message: string;
  current: number;
  total: number;
  result?: {
    playlistName: string;
    added: number;
    notFound: number;
    notFoundTracks: NotFoundTrack[];
    tidalUrl: string;
  };
  error?: string;
}

export default function Migrando() {
  const t = useTranslations();
  const [progress, setProgress] = useState<MigrationProgress>({
    stage: "idle",
    message: t("migrando.title"),
    current: 0,
    total: 0,
  });
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    const selectedIds = JSON.parse(sessionStorage.getItem("selectedPlaylists") || "[]");
    if (selectedIds.length === 0) {
      setProgress({ stage: "error", message: t("migrando.error.noPlaylists"), current: 0, total: 0, error: "NO_PLAYLISTS" });
      return;
    }

    runMigration(selectedIds);
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const searchWithBackoff = async (isrc: string, attempt: number = 0): Promise<{ tidalId: string; title: string; artist: string } | null> => {
    const maxRetries = 3;
    const res = await fetch(`/api/tidal/search?isrc=${isrc}`);

    if (res.status === 429) {
      if (attempt >= maxRetries) return null;
      const retryAfter = res.headers.get("Retry-After");
      const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : Math.min(1000 * Math.pow(2, attempt), 8000);
      await sleep(waitMs);
      return searchWithBackoff(isrc, attempt + 1);
    }

    if (!res.ok) return null;
    const data = await res.json();
    return data.tidalId ? { tidalId: data.tidalId, title: data.title ?? "", artist: data.artist ?? "" } : null;
  };

  const runMigration = async (playlistIds: string[]) => {
    try {
      // 1. Obtener tracks de Spotify
      setProgress({ stage: "fetching", message: t("migrando.fetching"), current: 0, total: playlistIds.length });

      const allTracks: Array<{ isrc: string; name: string; artists: string[] }> = [];

      for (let i = 0; i < playlistIds.length; i++) {
        try {
          const res = await fetch(`/api/spotify/playlist/${playlistIds[i]}/tracks`);
          if (res.ok) {
            const data = await res.json();
            if (data.tracks) {
              allTracks.push(...data.tracks.map((t: any) => ({
                isrc: t.isrc,
                name: t.name,
                artists: t.artists,
              })));
            }
          } else if (res.status === 401 || res.status === 403) {
            setProgress({ stage: "error", message: t("migrando.error.spotify"), current: 0, total: 0, error: "SPOTIFY_TOKEN_EXPIRED" });
            return;
          }
        } catch {
          // Continuar con las que sí se pudieron obtener
        }
      }

      const tracksWithISRC = allTracks.filter((t) => t.isrc);

      // 2. Buscar en TIDAL por ISRC
      setProgress({ stage: "matching", message: t("migrando.matching"), current: 0, total: tracksWithISRC.length });

      const tidalMatches: string[] = [];
      const notFound: NotFoundTrack[] = [];

      for (let i = 0; i < tracksWithISRC.length; i++) {
        const track = tracksWithISRC[i];

        try {
          const result = await searchWithBackoff(track.isrc);
          if (result) {
            tidalMatches.push(result.tidalId);
          } else {
            notFound.push({ name: track.name, artists: track.artists, isrc: track.isrc });
          }
        } catch (err: any) {
          if (err?.message?.includes("SPOTIFY_TOKEN_EXPIRED") || err?.message?.includes("TIDAL_TOKEN_EXPIRED")) {
            setProgress({ stage: "error", message: t("migrando.error.spotify"), current: 0, total: 0, error: err.message });
            return;
          }
          notFound.push({ name: track.name, artists: track.artists, isrc: track.isrc });
        }

        setProgress({ stage: "matching", message: `${t("migrando.matching")} ${i + 1}/${tracksWithISRC.length}`, current: i + 1, total: tracksWithISRC.length });
        await sleep(200);
      }

      if (tidalMatches.length === 0) {
        setProgress({ stage: "error", message: t("migrando.error.noMatches"), current: 0, total: tracksWithISRC.length, error: "NO_MATCHES" });
        return;
      }

      // 3. Crear playlist en TIDAL (sin tracks aún)
      setProgress({ stage: "creating", message: t("migrando.creating"), current: 0, total: 1 });

      const createRes = await fetch("/api/tidal/create-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Migración Spotify - ${new Date().toLocaleDateString("es-ES")}`,
          description: `Migrada desde Spotify con TuneHop. ${tidalMatches.length} tracks encontrados.`,
        }),
      });

      if (createRes.status === 401 || createRes.status === 403) {
        setProgress({ stage: "error", message: t("migrando.error.tidal"), current: 0, total: 0, error: "TIDAL_TOKEN_EXPIRED" });
        return;
      }

      if (!createRes.ok) {
        throw new Error("Error creando playlist en TIDAL");
      }

      const createData = await createRes.json();
      const playlistId = createData.id;

      // 4. Añadir tracks en tandas de 20
      const batchSize = 20;
      const totalBatches = Math.ceil(tidalMatches.length / batchSize);
      setProgress({ stage: "adding", message: `${t("migrando.adding")} ${t("migrando.batch")} 1 ${t("migrando.of")} ${totalBatches}`, current: 0, total: tidalMatches.length });

      let added = 0;
      let failed = 0;

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const start = batchIndex * batchSize;
        const batch = tidalMatches.slice(start, start + batchSize);

        setProgress({
          stage: "adding",
          message: `${t("migrando.adding")} ${t("migrando.batch")} ${batchIndex + 1} ${t("migrando.of")} ${totalBatches}`,
          current: Math.min(start + batch.length, tidalMatches.length),
          total: tidalMatches.length,
        });

        try {
          const addRes = await fetch("/api/tidal/add-tracks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playlistId, trackIds: batch }),
          });

          if (addRes.ok) {
            const addData = await addRes.json();
            added += addData.added ?? 0;
            failed += addData.failed ?? 0;
          } else if (addRes.status === 401 || addRes.status === 403) {
            setProgress({ stage: "error", message: t("migrando.error.tidal"), current: 0, total: 0, error: "TIDAL_TOKEN_EXPIRED" });
            return;
          }
        } catch {
          failed += batch.length;
        }

        if (batchIndex < totalBatches - 1) {
          await sleep(300);
        }
      }

      // 5. Completado
      setProgress({
        stage: "done",
        message: t("migrando.done"),
        current: tidalMatches.length,
        total: tracksWithISRC.length,
        result: {
          playlistName: `Migración Spotify - ${new Date().toLocaleDateString("es-ES")}`,
          added,
          notFound: notFound.length,
          notFoundTracks: notFound,
          tidalUrl: `https://tidal.com/playlist/${playlistId}`,
        },
      });
    } catch (err) {
      console.error("Migration error:", err);
      setProgress({ stage: "error", message: t("migrando.error"), current: 0, total: 0, error: err instanceof Error ? err.message : "Error desconocido" });
    }
  };

  const handleClearData = async () => {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    sessionStorage.clear();
    window.location.href = "/";
  };

  const getProgressPercent = () => {
    if (progress.total === 0) return 0;
    return Math.round((progress.current / progress.total) * 100);
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        {/* Error */}
        {progress.stage === "error" && (
          <>
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-medium text-red-800">
                {progress.error === "SPOTIFY_TOKEN_EXPIRED"
                  ? t("migrando.error.spotify")
                  : progress.error === "TIDAL_TOKEN_EXPIRED"
                    ? t("migrando.error.tidal")
                    : t("migrando.error")}
              </p>
              {progress.error && progress.error !== "SPOTIFY_TOKEN_EXPIRED" && progress.error !== "TIDAL_TOKEN_EXPIRED" && (
                <p className="mt-1 text-sm text-red-600">{progress.error}</p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Button href="/playlists" className="flex-1" aria-label={t("migrando.retry.aria")}>
                {t("migrando.retry")}
              </Button>
              <Button onClick={handleClearData} variant="outline" className="flex-1" aria-label={t("migrando.close.aria")}>
                {t("migrando.close")}
              </Button>
            </div>
          </>
        )}

        {/* Progreso */}
        {progress.stage !== "done" && progress.stage !== "error" && (
          <>
            <h1 className="text-2xl font-bold text-zinc-900">{t("migrando.title")}</h1>
            <p className="mt-2 text-zinc-600">{progress.message}</p>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>{progress.current}/{progress.total}</span>
                <span>{getProgressPercent()}%</span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* Completado */}
        {progress.stage === "done" && progress.result && (
          <>
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-center">
              <p className="font-medium text-green-800">{progress.result.playlistName}</p>
              <p className="mt-1 text-sm text-green-700">
                {progress.result.added}/{progress.total} {t("migrando.migrated")}
              </p>
              {progress.result.notFound > 0 && (
                <p className="mt-1 text-sm text-amber-700">
                  {progress.result.notFound} {t("migrando.notFound")}
                </p>
              )}
            </div>

            {progress.result.notFoundTracks.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowNotFound(!showNotFound)}
                  className="text-sm font-medium text-blue-600 hover:underline"
                  aria-expanded={showNotFound}
                  aria-controls="not-found-list"
                >
                  {showNotFound ? t("migrando.hideDetail") : `${t("migrando.showDetail")} (${progress.result.notFound})`}
                </button>

                {showNotFound && (
                  <ul id="not-found-list" className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm" role="list">
                    {progress.result.notFoundTracks.map((track, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 text-amber-500">⚠</span>
                        <div>
                          <p className="font-medium text-zinc-800">{track.name}</p>
                          <p className="text-zinc-500">{track.artists.join(", ")}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Button href={progress.result.tidalUrl} external className="w-full" aria-label={t("migrando.openTidal.aria")}>
                {t("migrando.openTidal")}
              </Button>
              <Button href="/playlists" variant="outline" className="w-full" aria-label={t("migrando.morePlaylists.aria")}>
                {t("migrando.morePlaylists")}
              </Button>
              <button
                onClick={handleClearData}
                className="w-full py-3 text-sm text-zinc-400 underline-offset-2 hover:text-red-500 hover:underline"
                aria-label={t("migrando.clearData.aria")}
              >
                {t("migrando.clearData")}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
