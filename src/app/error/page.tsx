import { notFound } from "next/navigation";
import Link from "next/link";

interface ErrorPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const message = params.message || "Error desconocido";

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-xl font-bold text-red-900">Error</h1>
        <p className="mt-2 text-red-700">{message}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/">
            <button className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
              Volver al inicio
            </button>
          </Link>
          <Link href="/consentimiento">
            <button className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 hover:bg-zinc-50">
              Volver al consentimiento
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}