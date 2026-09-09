"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

interface NotFoundTrack {
  name: string;
  artists: string[];
  isrc: string;
}

interface Candidate {
  tidalId: string;
  title: string;
  artist: string;
}

interface ReviewItem {
  key: string;
  name: string;
  artists: string[];
  isrc: string;
  candidates: Candidate[];
  decision: "pending" | "use" | "skip";
  chosenId?: string;
  chosenTitle?: string;
}

interface MigrationProgress {
  stage: "idle" | "fetching" | "matching" | "creating" | "adding" | "review" | "done" | "error";
  message: string;
  current: number;
  total: number;
  result?: {
    playlistName: string;
    added: number;
    manualAdded: number;
    omitted: number;
    notFoundTracks: NotFoundTrack[];
    tidalUrl: string;
  };
  review?: ReviewItem[];
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
  const [copied, setCopied] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [retryingKey, setRetryingKey] = useState<string | null>(null);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);
  const playlistIdRef = useRef<string | null>(null);
  const playlistNameRef = useRef("");

  useEffect(() => {
    const selectedIds = JSON.parse(sessionStorage.getItem("selectedPlaylists") || "[]");
    if (selectedIds.length === 0) {
      setProgress({ stage: "error", message: t("migrando.errorNoPlaylists"), current: 0, total: 0, error: "NO_PLAYLISTS" });
      return;
    }

    runMigration(selectedIds);
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /** Marca las playlists como migradas en localStorage (solo en el navegador, RGPD ok) */
  const markPlaylistsMigrated = (ids: string[]) => {
    try {
      const existing: string[] = JSON.parse(localStorage.getItem("tunehop:migratedPlaylists") || "[]");
      const merged = Array.from(new Set([...existing, ...ids]));
      localStorage.setItem("tunehop:migratedPlaylists", JSON.stringify(merged));
    } catch {
      // localStorage bloqueado (modo privado): no es crítico, solo visual
    }
  };

  const searchWithBackoff = async (isrc: string, attempt: number = 0): Promise<Candidate | null> => {
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

  const searchNameWithBackoff = async (name: string, artist: string, attempt: number = 0): Promise<Candidate | null> => {
    const maxRetries = 3;
    const res = await fetch(`/api/tidal/search-by-name?name=${encodeURIComponent(name)}&artist=${encodeURIComponent(artist)}`);

    if (res.status === 429) {
      if (attempt >= maxRetries) return null;
      const retryAfter = res.headers.get("Retry-After");
      const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : Math.min(1000 * Math.pow(2, attempt), 8000);
      await sleep(waitMs);
      return searchNameWithBackoff(name, artist, attempt + 1);
    }

    if (!res.ok) return null;
    const data = await res.json();
    return data.tidalId ? { tidalId: data.tidalId, title: data.title ?? "", artist: data.artist ?? "" } : null;
  };

  const searchCandidatesBackoff = async (name: string, artist: string): Promise<Candidate[]> => {
    const res = await fetch(`/api/tidal/search-candidates?name=${encodeURIComponent(name)}&artist=${encodeURIComponent(artist)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.candidates) ? data.candidates : [];
  };

  const addTrackBatches = async (playlistId: string, ids: string[]): Promise<number> => {
    if (ids.length === 0) return 0;
    const batchSize = 20;
    let addedOk = 0;

    for (let batchIndex = 0; batchIndex < Math.ceil(ids.length / batchSize); batchIndex++) {
      const batch = ids.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);
      setProgress({ stage: "adding", message: `${t("migrando.adding")} ${t("migrando.batch")} ${batchIndex + 1}/${Math.ceil(ids.length / batchSize)}`, current: batchIndex + 1, total: Math.ceil(ids.length / batchSize) });

      const res = await fetch("/api/tidal/add-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId, trackIds: batch }),
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("TIDAL_TOKEN_EXPIRED");
      }

      if (res.ok) addedOk += batch.length;

      if (batchIndex < Math.ceil(ids.length / batchSize) - 1) {
        await sleep(300);
      }
    }
    return addedOk;
  };

  const saveReviewToStorage = () => {
    try {
      localStorage.setItem(
        "tunehop:review",
        JSON.stringify({
          date: new Date().toISOString(),
          playlistName: playlistNameRef.current,
          tidalUrl: playlistIdRef.current ? `https://tidal.com/playlist/${playlistIdRef.current}` : "",
          items: reviewItems.map((it) => ({
            name: it.name,
            artists: it.artists,
            isrc: it.isrc,
            decision: it.decision,
            chosenTitle: it.chosenTitle ?? null,
          })),
        })
      );
    } catch {
      // noop
    }
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
              allTracks.push(...data.tracks.map((tr: any) => ({
                isrc: tr.isrc,
                name: tr.name,
                artists: tr.artists,
              })));
            }
          } else if (res.status === 401 || res.status === 403) {
            setProgress({ stage: "error", message: t("migrando.errorSpotify"), current: 0, total: 0, error: "SPOTIFY_TOKEN_EXPIRED" });
            return;
          }
        } catch {
          // Continuar con las que sí se pudieron obtener
        }
      }

      const tracksWithISRC = allTracks.filter((tr) => tr.isrc);

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
          if (err?.message?.includes("TIDAL_TOKEN_EXPIRED")) {
            setProgress({ stage: "error", message: t("migrando.errorTidal"), current: 0, total: 0, error: err.message });
            return;
          }
          notFound.push({ name: track.name, artists: track.artists, isrc: track.isrc });
        }
        setProgress({ stage: "matching", message: `${t("migrando.matching")} ${i + 1}/${tracksWithISRC.length}`, current: i + 1, total: tracksWithISRC.length });
        await sleep(300);
      }

      // 2b. Fallback: buscar por nombre/artista
      const stillNotFound: NotFoundTrack[] = [];
      for (let i = 0; i < notFound.length; i++) {
        const track = notFound[i];
        setProgress({ stage: "matching", message: `${t("migrando.matchingName")} ${i + 1}/${notFound.length}`, current: i + 1, total: notFound.length });
        try {
          const result = await searchNameWithBackoff(track.name, track.artists.join(", "));
          if (result) {
            tidalMatches.push(result.tidalId);
          } else {
            stillNotFound.push(track);
          }
        } catch {
          stillNotFound.push(track);
        }
        await sleep(300);
      }

      notFound.length = 0;
      notFound.push(...stillNotFound);

      // 2c. Candidatos para emparejamiento manual
      const items: ReviewItem[] = [];
      for (let i = 0; i < notFound.length; i++) {
        const track = notFound[i];
        setProgress({ stage: "matching", message: `${t("migrando.searchingCandidates")} ${i + 1}/${notFound.length}`, current: i + 1, total: notFound.length });
        const candidates = await searchCandidatesBackoff(track.name, track.artists.join(", "));
        items.push({
          key: `${track.isrc}-${i}`,
          name: track.name,
          artists: track.artists,
          isrc: track.isrc,
          candidates,
          decision: "pending",
        });
        await sleep(300);
      }

      const hasCandidates = items.some((it) => it.candidates.length > 0);
      const hasPending = items.some((it) => it.decision === "pending");

      // Sin matches ni candidatos: resultado válido, no error
      if (tidalMatches.length === 0 && !hasCandidates) {
        setProgress({
          stage: "done",
          message: t("migrando.done"),
          current: tracksWithISRC.length,
          total: tracksWithISRC.length,
          result: {
            playlistName: `Migración Spotify - ${new Date().toLocaleDateString("es-ES")}`,
            added: 0,
            manualAdded: 0,
            omitted: tracksWithISRC.length,
            notFoundTracks: items.map((it) => ({ name: it.name, artists: it.artists, isrc: it.isrc })),
            tidalUrl: "",
          },
        });
        return;
      }

      // Hay algo que añadir: crear playlist
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
        setProgress({ stage: "error", message: t("migrando.errorTidal"), current: 0, total: 0, error: "TIDAL_TOKEN_EXPIRED" });
        return;
      }
      if (!createRes.ok) {
        throw new Error("Error creando playlist en TIDAL");
      }

      const createData = await createRes.json();
      playlistIdRef.current = createData.id;
      playlistNameRef.current = `Migración Spotify - ${new Date().toLocaleDateString("es-ES")}`;

      // Añadir los que se encontraron automáticamente
      let added = 0;
      if (tidalMatches.length > 0 && playlistIdRef.current) {
        added = await addTrackBatches(playlistIdRef.current, tidalMatches);
      }

      // ¿Queda revisión pendiente?
      if (hasPending && hasCandidates) {
        setReviewItems(items);
        setProgress({
          stage: "review",
          message: t("migrando.reviewTitle"),
          current: added,
          total: tracksWithISRC.length,
          review: items,
        });
        return;
      }

      // Sin revisión pendiente: completado
      const notMigrated = items.filter((it) => it.decision === "pending");
      if (added > 0) {
        markPlaylistsMigrated(playlistIds);
      }
      setProgress({
        stage: "done",
        message: t("migrando.done"),
        current: added,
        total: tracksWithISRC.length,
        result: {
          playlistName: playlistNameRef.current,
          added,
          manualAdded: 0,
          omitted: tracksWithISRC.length - added,
          notFoundTracks: notMigrated.map((it) => ({ name: it.name, artists: it.artists, isrc: it.isrc })),
          tidalUrl: `https://tidal.com/playlist/${playlistIdRef.current}`,
        },
      });
    } catch (err: any) {
      if (err?.message === "TIDAL_TOKEN_EXPIRED") {
        setProgress({ stage: "error", message: t("migrando.errorTidal"), current: 0, total: 0, error: err.message });
        return;
      }
      console.error("Migration error:", err);
      setProgress({ stage: "error", message: t("migrando.error"), current: 0, total: 0, error: err instanceof Error ? err.message : "Error desconocido" });
    }
  };

  /** Confirmar la revisión manual: añade las elegidas a la playlist */
  const confirmReview = async () => {
    const chosen = reviewItems.filter((it) => it.decision === "use" && it.chosenId);
    const skipped = reviewItems.filter((it) => it.decision === "skip");
    const pending = reviewItems.filter((it) => it.decision === "pending");

    try {
      let manualAdded = 0;
      if (chosen.length > 0 && playlistIdRef.current) {
        manualAdded = await addTrackBatches(playlistIdRef.current, chosen.map((it) => it.chosenId!));
      }

      const doneNotMigrated = [...skipped, ...pending].map((it) => ({ name: it.name, artists: it.artists, isrc: it.isrc }));
      saveReviewToStorage();
      markPlaylistsMigrated(JSON.parse(sessionStorage.getItem("selectedPlaylists") || "[]"));

      setProgress({
        stage: "done",
        message: t("migrando.done"),
        current: chosen.length,
        total: chosen.length + doneNotMigrated.length,
        result: {
          playlistName: playlistNameRef.current,
          added: 0,
          manualAdded,
          omitted: doneNotMigrated.length,
          notFoundTracks: doneNotMigrated,
          tidalUrl: `https://tidal.com/playlist/${playlistIdRef.current}`,
        },
      });
    } catch (err: any) {
      if (err?.message === "TIDAL_TOKEN_EXPIRED") {
        setProgress({ stage: "error", message: t("migrando.errorTidal"), current: 0, total: 0, error: err.message });
        return;
      }
      setProgress({ stage: "error", message: t("migrando.error"), current: 0, total: 0, error: "Error al añadir las elegidas" });
    }
  };

  /** Reintentar la búsqueda de un track individual */
  const retryItem = async (item: ReviewItem) => {
    setRetryingKey(item.key);
    setRetryMsg(null);
    try {
      const result = (await searchWithBackoff(item.isrc)) ?? (await searchNameWithBackoff(item.name, item.artists.join(", ")));
      if (result) {
        setReviewItems((prev) =>
          prev.map((it) =>
            it.key === item.key
              ? { ...it, decision: "use" as const, chosenId: result.tidalId, chosenTitle: result.title }
              : it
          )
        );
        setRetryMsg(t("migrando.retryOk"));
      } else {
        setRetryMsg(t("migrando.retryFailed"));
      }
    } finally {
      setRetryingKey(null);
    }
  };

  const setDecision = (key: string, decision: "use" | "skip", chosenId?: string, chosenTitle?: string) => {
    setReviewItems((prev) =>
      prev.map((it) =>
        it.key === key ? { ...it, decision, chosenId: chosenId ?? it.chosenId, chosenTitle: chosenTitle ?? it.chosenTitle } : it
      )
    );
  };

  const copyNotFoundList = async () => {
    const list = progress.result?.notFoundTracks ?? [];
    const text = list.map((tr) => `${tr.name} — ${tr.artists.join(", ")}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard bloqueado
    }
  };

  const exportJson = () => {
    const data = {
      app: "TuneHop",
      fecha: new Date().toISOString(),
      playlistName: progress.result?.playlistName ?? playlistNameRef.current,
      tidalUrl: progress.result?.tidalUrl ?? "",
      migradas: (progress.result?.added ?? 0) + (progress.result?.manualAdded ?? 0),
      omitidas: progress.result?.omitted ?? 0,
      noMigradas: progress.result?.notFoundTracks ?? [],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tunehop-informe-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    try {
      sessionStorage.clear();
    } catch {
      // noop
    }
    window.location.href = "/";
  };

  const getProgressPercent = () => {
    if (progress.total === 0) return 0;
    return Math.min(100, Math.round((progress.current / progress.total) * 100));
  };

  // ---------- UI ----------

  if (progress.stage === "error") {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-bold text-zinc-900">{t("migrando.title")}</h1>
          <p className="mt-2 text-zinc-600">{t("migrando.error")}</p>
          {progress.error && progress.error !== "Error desconocido" && !progress.error.includes("TIDAL") && !progress.error.includes("SPOTIFY") && (
            <p className="mt-1 text-sm text-red-600">{progress.error}</p>
          )}
          <div className="mt-6 flex gap-3">
            <Button href="/playlists" className="flex-1" aria-label={t("migrando.retryAria")}>
              {t("migrando.retry")}
            </Button>
            <Button onClick={handleClearData} variant="outline" className="flex-1" aria-label={t("migrando.closeAria")}>
              {t("migrando.close")}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Pantalla de revisión manual
  if (progress.stage === "review") {
    const chosenCount = reviewItems.filter((it) => it.decision === "use" && it.chosenId).length;
    return (
      <main className="flex flex-1 bg-zinc-50 px-4 py-8">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-zinc-900">{t("migrando.reviewTitle")}</h1>
          <p className="mt-1 text-sm text-zinc-600">{t("migrando.reviewIntro")}</p>
          <p className="mt-1 text-xs text-zinc-500">{t("migrando.reviewNote")}</p>

          <ul className="mt-6 space-y-3">
            {reviewItems.map((item) => {
              const isRetrying = retryingKey === item.key;
              return (
                <li key={item.key} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-zinc-900">
                      {item.name} <span className="ml-1 text-sm font-normal text-zinc-500">— {item.artists.join(", ")}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://tidal.com/search?q=${encodeURIComponent(`${item.name} ${item.artists.join(" ")}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                        aria-label={t("migrando.searchTidalAria", { name: item.name })}
                      >
                        {t("migrando.searchTidal")}
                      </a>
                      <button
                        onClick={() => retryItem(item)}
                        disabled={isRetrying}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
                        aria-label={t("migrando.retryTrackAria", { name: item.name })}
                      >
                        {isRetrying ? "…" : t("migrando.retryTrack")}
                      </button>
                      <button
                        onClick={() => setDecision(item.key, "skip")}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-amber-50"
                        aria-label={t("migrando.skipAria", { name: item.name })}
                      >
                        {item.decision === "skip" ? "✓ " : ""}{t("migrando.skip")}
                      </button>
                    </div>
                  </div>

                  {retryMsg && retryingKey === null && (
                    <p className="mt-2 text-xs text-zinc-500">{retryMsg}</p>
                  )}

                  <div className="mt-3 space-y-2">
                    {item.candidates.length === 0 ? (
                      <p className="text-sm text-zinc-500">{t("migrando.noCandidates")}</p>
                    ) : (
                      item.candidates.map((cand) => {
                        const selected = item.decision === "use" && item.chosenId === cand.tidalId;
                        return (
                          <label
                            key={cand.tidalId}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition ${selected ? "border-green-500 bg-green-50" : "border-zinc-200 hover:bg-zinc-50"}`}
                          >
                            <input
                              type="radio"
                              name={`cand-${item.key}`}
                              checked={selected}
                              onChange={() => setDecision(item.key, "use", cand.tidalId, cand.title)}
                              className="h-4 w-4 accent-green-600"
                            />
                            <span className="text-sm text-zinc-800">
                              <span className="font-medium">{cand.title}</span>
                              <span className="text-zinc-500"> — {cand.artist}</span>
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex gap-3">
            <div className="flex-1">
              <Button
                className="w-full text-lg py-3"
                disabled={chosenCount === 0}
                onClick={confirmReview}
                aria-label={t("migrando.confirmReviewAria")}
              >
                {t("migrando.confirmReview", { count: String(chosenCount) })}
              </Button>
            </div>
            <Button onClick={handleClearData} variant="outline" aria-label={t("migrando.closeAria")}>
              {t("migrando.close")}
            </Button>
          </div>
          {chosenCount === 0 && (
            <p className="mt-2 text-center text-sm text-zinc-500">{t("migrando.noSelectionHint")}</p>
          )}
        </div>
      </main>
    );
  }

  // Progreso
  if (progress.stage !== "done") {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
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
        </div>
      </main>
    );
  }

  // Completado
  const totalMigrated = (progress.result?.added ?? 0) + (progress.result?.manualAdded ?? 0);
  const hasManual = (progress.result?.manualAdded ?? 0) > 0;
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8">
      <section className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-green-900">🎉 {t("migrando.done")}</h1>
          <p className="mt-2 font-medium text-green-800">{progress.result?.playlistName}</p>
          <p className="mt-1 text-sm text-green-700">
            {totalMigrated}/{progress.total} {t("migrando.migrated")}
            {hasManual && (
              <span className="text-green-600"> · {progress.result?.manualAdded} {t("migrando.okAdded")}</span>
            )}
          </p>
          {progress.result && progress.result.omitted > 0 && (
            <p className="mt-1 text-sm text-amber-700">
              {progress.result.omitted} {t("migrando.notFound")}
            </p>
          )}

          {progress.result && progress.result.tidalUrl ? (
            <>
              <div className="mx-auto mt-5 flex max-w-md items-center gap-2">
                <input
                  readOnly
                  value={progress.result.tidalUrl}
                  className="w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm text-zinc-700"
                  onFocus={(e) => e.target.select()}
                  aria-label={t("migrando.copyLinkAria")}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(progress.result!.tidalUrl!).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }).catch(() => {});
                  }}
                  variant="outline"
                  className="shrink-0"
                  aria-label={t("migrando.copyLinkAria")}
                >
                  {copied ? t("migrando.linkCopied") : t("migrando.copyLink")}
                </Button>
              </div>
              <p className="mt-2 text-xs text-green-700">{t("migrando.tidalHint")}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-amber-700">{t("migrando.noMatchesAvailable")}</p>
          )}
        </div>

        {progress.result && progress.result.notFoundTracks.length > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
            <button
              onClick={() => setShowNotFound(!showNotFound)}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              aria-expanded={showNotFound}
            >
              {showNotFound ? t("migrando.hideDetail") : `${t("migrando.showDetail")} (${progress.result.notFoundTracks.length})`}
            </button>

            {showNotFound && (
              <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto">
                {progress.result.notFoundTracks.map((tr, i) => (
                  <li key={`${tr.isrc}-${i}`} className="flex items-center gap-2 text-sm text-zinc-600">
                    <span aria-hidden="true">⚠️</span>
                    <span className="truncate">
                      {tr.name} <span className="text-zinc-400">— {tr.artists.join(", ")}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={copyNotFoundList} variant="outline" className="text-sm" aria-label={t("migrando.copyListAria")}>
                {copied ? t("migrando.copiedList") : t("migrando.copyList")}
              </Button>
              <Button onClick={exportJson} variant="outline" className="text-sm" aria-label={t("migrando.exportJsonAria")}>
                {t("migrando.exportJson")}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/playlists" className="flex-1" aria-label={t("migrando.morePlaylistsAria")}>
            {t("migrando.morePlaylists")}
          </Button>
          <Button onClick={handleClearData} variant="outline" className="flex-1" aria-label={t("migrando.clearDataAria")}>
            {t("migrando.clearData")}
          </Button>
        </div>
      </section>
    </main>
  );
}