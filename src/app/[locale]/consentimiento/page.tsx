"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

export default function Consentimiento() {
  const [aceptado, setAceptado] = useState(false);
  const t = useTranslations();

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">{t("consent.title")}</h1>
        <p className="mt-2 text-zinc-600">
          {t("consent.description")}
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={aceptado}
            onChange={setAceptado}
            aria-label={t("consent.policy")}
          />
          <span className="text-sm leading-relaxed text-zinc-700">
            {t("consent.policy")}{" "}
            <Link
              href="/politica-privacidad"
              className="font-medium text-blue-600 underline-offset-2 hover:underline"
            >
              {t("home.privacyLink")}
            </Link>
          </span>
        </label>

        <div className="mt-6">
          <Button href="/api/spotify/auth" external disabled={!aceptado} className="w-full" aria-label={t("consent.connectAria")}>
            {t("consent.connect")}
          </Button>
        </div>
      </section>
    </main>
  );
}
