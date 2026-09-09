"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

interface Playlist {
  id: string;
  name: string;
  imageUrl: string | null;
  totalTracks: number;
  ownerName: string;
  isOwner: boolean;
  collaborative: boolean;
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [migratedIds, setMigratedIds] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    // Estado local del navegador: playlists ocultas y ya migradas (RGPD ok, no salen del navegador)
    try {
      const hidden: string[] = JSON.parse(localStorage.getItem("tunehop:hiddenPlaylists") || "[]");
      setHiddenIds(new Set(hidden));
      const migrated: string[] = JSON.parse(localStorage.getItem("tunehop:migratedPlaylists") || "[]");
      setMigratedIds(new Set(migrated));
    } catch {
      // localStorage bloqueado: la app funciona igual, sin recordar estado
    }

    fetch("/api/playlists")
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado o error del servidor");
        return res.json();
      })
      .then((data) => {
        if (data.playlists) setPlaylists(data.playlists);
        else if (data.error) setError(data.error);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const hidePlaylist = (id: string) => {
    const next = new Set(hiddenIds);
    next.add(id);
    setHiddenIds(next);
    try {
      localStorage.setItem("tunehop:hiddenPlaylists", JSON.stringify(Array.from(next)));
    } catch {
      // localStorage bloqueado: no persiste, pero se oculta en esta sesión
    }
  };

  const restorePlaylist = (id: string) => {
    const next = new Set(hiddenIds);
    next.delete(id);
    setHiddenIds(next);
    try {
      localStorage.setItem("tunehop:hiddenPlaylists", JSON.stringify(Array.from(next)));
    } catch {
      // noop
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const visiblePlaylists = showHidden ? playlists : playlists.filter((p) => !hiddenIds.has(p.id));
  const hiddenCount = playlists.length - visiblePlaylists.length;
  // Búsqueda por nombre (y propietario) — cliente, sin llamadas extra
  const q = query.trim().toLowerCase();
  const filteredPlaylists = q
    ? visiblePlaylists.filter((p) => p.name.toLowerCase().includes(q) || p.ownerName.toLowerCase().includes(q))
    : visiblePlaylists;

  const selectAll = () => {
    if (selected.size === filteredPlaylists.length) setSelected(new Set());
    else setSelected(new Set(filteredPlaylists.map((p) => p.id)));
  };

  const allSelected = filteredPlaylists.length > 0 && selected.size === filteredPlaylists.length;

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-zinc-900">{t("error.title")}</h1>
          <p className="mt-2 text-zinc-600">{error}</p>
          <div className="mt-6">
            <Link
              href="/consentimiento"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {t("error.retry")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (playlists.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-zinc-900">{t("playlists.empty")}</h1>
          <p className="mt-2 text-zinc-600">
            {t("playlists.emptyDescription")}
          </p>
          <div className="mt-6">
            <Link
              href="/consentimiento"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {t("playlists.back")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900">{t("playlists.title")} ({playlists.length})</h1>
          <p className="mt-1 text-zinc-600">
            {t("playlists.select")}. {selected.size > 0 && <span className="font-medium text-blue-600">({selected.size} {t("playlists.selected")})</span>}
          </p>
        </header>

        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("playlists.searchPlaceholder")}
            aria-label={t("playlists.searchAria")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mb-4 flex items-center gap-3">
          <Button onClick={selectAll} variant="outline" className="flex-1" aria-label={allSelected ? t("playlists.deselectAllAria") : t("playlists.selectAllAria")}>
            {allSelected ? t("playlists.deselectAll") : t("playlists.selectAll")}
          </Button>
        </div>

        {hiddenCount > 0 && (
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
            aria-expanded={showHidden}
          >
            {showHidden ? t("playlists.hideHidden") : t("playlists.showHidden", { count: String(hiddenCount) })}
          </button>
        )}

        <ul className="space-y-3" role="listbox" aria-label="Playlists para migrar">
          {filteredPlaylists.length === 0 && (
            <li className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
              {t("playlists.noResults", { query })}
            </li>
          )}
          {filteredPlaylists.map((pl) => (
            <li key={pl.id} className={`rounded-xl border bg-white p-4 shadow-sm flex items-center gap-2 ${migratedIds.has(pl.id) ? "border-green-400" : "border-zinc-200"}`}>
              <label className="flex items-center gap-4 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selected.has(pl.id)}
                  onChange={() => toggleSelect(pl.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-600"
                  aria-label={pl.name}
                />
                {pl.imageUrl && (
                  <img src={pl.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" loading="lazy" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 truncate">{pl.name}</p>
                  <p className="text-sm text-zinc-500">
                    {pl.totalTracks} canciones · {pl.ownerName}
                    {pl.collaborative && " · Colaborativa"}
                  </p>
                </div>
              </label>
              {migratedIds.has(pl.id) && (
                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  ✓ {t("playlists.migrated")}
                </span>
              )}
              <button
                onClick={() => (showHidden ? restorePlaylist(pl.id) : hidePlaylist(pl.id))}
                className="shrink-0 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label={showHidden ? t("playlists.restoreAria", { name: pl.name }) : t("playlists.hideAria", { name: pl.name })}
                title={showHidden ? t("playlists.restore") : t("playlists.hide")}
              >
                {showHidden ? t("playlists.restore") : t("playlists.hide")}
              </button>
            </li>
          ))}
        </ul>

        {selected.size > 0 && (
          <div className="fixed bottom-0 inset-x-0 border-t border-zinc-200 bg-white p-4 shadow-lg">
            <Button
              className="w-full text-lg py-4"
              disabled={selected.size === 0}
              aria-label={`${t("playlists.continue")} (${selected.size})`}
              onClick={() => {
                sessionStorage.setItem("selectedPlaylists", JSON.stringify(Array.from(selected)));
                window.location.href = "/destino";
              }}
            >
              {t("playlists.continue")} ({selected.size})
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
