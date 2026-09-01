import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | TuneHop",
};

const datosTratados = [
  ["Email del usuario", "Identificar la sesión", "Solo durante la sesión"],
  ["Tokens de acceso de Spotify y Deezer", "Hacer peticiones a las APIs en tu nombre", "Solo durante la sesión"],
  ["Nombres de tus playlists", "Mostrarlas y migrarlas al destino", "Solo durante la sesión"],
  ["Canciones (título, artista, álbum, ISRC)", "Buscar y copiar las canciones al destino", "Solo durante la sesión"],
];

export default function PoliticaPrivacidad() {
  return (
    <main className="flex flex-1 justify-center bg-white px-4 py-12">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-900">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-zinc-500">Última actualización: 1 de septiembre de 2026</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Responsable del tratamiento</h2>
          <p className="mt-2 text-zinc-700">
            TuneHop es un proyecto personal de mcaparrosgu. No existe una empresa detrás: la
            desarrolladora es quien controla y responde por los datos. Si algún día el proyecto
            pasa a una entidad, esta política se actualizará.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Qué datos tratamos y durante cuánto tiempo</h2>
          <p className="mt-2 text-zinc-700">
            Solo tratamos los datos estrictamente necesarios para migrar tus playlists:
          </p>
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-300 text-zinc-500">
                <th className="py-2 pr-4 font-medium">Dato</th>
                <th className="py-2 pr-4 font-medium">Para qué</th>
                <th className="py-2 font-medium">Cuánto se guarda</th>
              </tr>
            </thead>
            <tbody>
              {datosTratados.map(([dato, para, plazo]) => (
                <tr key={dato} className="border-b border-zinc-200">
                  <td className="py-2 pr-4 text-zinc-900">{dato}</td>
                  <td className="py-2 pr-4 text-zinc-700">{para}</td>
                  <td className="py-2 text-zinc-700">{plazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-zinc-700">
            <strong>Lo que nunca tratamos:</strong> contraseñas (OAuth las gestiona sin que las
            veamos), datos de pago, ubicación, historial de escucha, ni el audio de las
            canciones. No analizamos tu música ni tus playlists más allá de la migración.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Finalidad</h2>
          <p className="mt-2 text-zinc-700">
            Copiar tus playlists de Spotify a otra plataforma musical, cuando tú lo pides. No usamos
            tus datos para publicidad, ni para recomendaciones, ni los compartimos con terceros.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Base legal</h2>
          <p className="mt-2 text-zinc-700">
            Interés legítimo (artículo 6.1.f del RGPD): nos pides expresamente que migremos tus
            datos de un servicio a otro, y no hay forma menos intrusiva de hacerlo. Además, el
            consentimiento se recoge explícitamente antes de conectar tu cuenta (artículo 7 del RGPD).
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Cuánto se conservan tus datos</h2>
          <p className="mt-2 text-zinc-700">
            Nada se guarda a largo plazo. Los tokens y los datos de la migración viven en la sesión
            y se eliminan al cerrarla o al completar la migración. Cerrar la pestaña o el botón
            &quot;Eliminar mis datos y cerrar&quot; borra todo.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Tus derechos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700">
            <li>
              <strong>Acceso (Art. 15):</strong> ver qué datos tenemos sobre ti durante la sesión.
            </li>
            <li>
              <strong>Supresión (Art. 17):</strong> borrar todos tus datos en cualquier momento.
              En la app lo tienes con el botón &quot;Eliminar mis datos y cerrar&quot;.
            </li>
          </ul>
          <p className="mt-2 text-zinc-700">
            Para cualquier consulta sobre tus datos, contacta a la desarrolladora a través del
            perfil de GitHub <span className="font-medium text-zinc-900">mcaparrosgu</span>.
          </p>
        </section>

        <p className="mt-10 text-sm text-zinc-500">
          <Link href="/" className="font-medium text-blue-600 underline-offset-2 hover:underline">
            ← Volver a TuneHop
          </Link>
        </p>
      </article>
    </main>
  );
}