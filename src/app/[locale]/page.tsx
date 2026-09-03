import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <section className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">{t("home.title")}</h1>
        <p className="mt-4 text-xl text-zinc-600">
          {t("home.subtitle")}
        </p>
        <div className="mt-10">
          <Button href="/consentimiento" className="px-10 py-4 text-lg" aria-label={t("home.connect.aria")}>
            {t("home.connect")}
          </Button>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          {t("home.privacy.note")}{" "}
          <Link
            href="/politica-privacidad"
            className="font-medium text-blue-600 underline-offset-2 hover:underline"
          >
            {t("home.privacy.link")}
          </Link>
        </p>
      </section>
    </main>
  );
}
