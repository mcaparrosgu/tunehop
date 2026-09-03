import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Button from "@/components/Button";

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <section className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">{t("home.title")}</h1>
        <p className="mt-4 text-xl text-zinc-600">
          {t("home.subtitle")}
        </p>
        <div className="mt-10">
          <Button href="/consentimiento" className="px-10 py-4 text-lg" aria-label={t("home.connectAria")}>
            {t("home.connect")}
          </Button>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          {t("home.privacyNote")}{" "}
          <Link
            href="/politica-privacidad"
            className="font-medium text-blue-600 underline-offset-2 hover:underline"
          >
            {t("home.privacyLink")}
          </Link>
        </p>
      </section>
    </main>
  );
}
