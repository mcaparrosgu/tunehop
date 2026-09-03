"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

export default function Destino() {
  const [conectado, setConectado] = useState(false);
  const t = useTranslations();

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">{t("destino.title")}</h1>
        <p className="mt-2 text-zinc-600">
          {t("destino.description")}
        </p>

        {!conectado ? (
          <>
            <div className="mt-6">
              <Button href="/api/tidal/auth" external className="w-full py-4 text-lg" aria-label={t("destino.tidal")}>
                {t("destino.tidal")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-center">
              <p className="font-medium text-green-800">¡TIDAL conectado correctamente!</p>
            </div>
            <div className="mt-6">
              <Button href="/migrando" className="w-full py-4 text-lg">
                {t("migrando.title")}
              </Button>
            </div>
          </>
        )}

        <p className="mt-6 text-sm text-zinc-500 text-center">
          {t("destino.note")}
        </p>
      </section>
    </main>
  );
}
