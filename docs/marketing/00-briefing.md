# Marketing — Paso 1 · Briefing (00-briefing.md)

> Encargo: pista de marketing del proyecto TuneHop. Este documento recoge el
> punto de partida real del negocio, con lo que sabemos hoy y lo que está
> pendiente de confirmar. No inventa nada: lo que no se sabe, se pregunta o se
> marca como pendiente.
>
> Fecha: 2026-09-11. Autora: Yara (directora creativa), con la fundadora.

---

## 1. NEGOCIO Y CONTEXTO

**TuneHop** es una app web que migra playlists de Spotify a TIDAL en cuestión
de minutos, sin esfuerzo manual.

- **Quién está detrás**: una única persona, la fundadora y desarrolladora
  (mcaparrosgu). Emprendedora individual, sin equipo ni inversión externa.
- **Antigüedad**: el proyecto técnico nace en agosto de 2026 dentro de un
  bootcamp de AI Engineering (método de 20 pasos). Es un producto **real y en
  producción** (https://tunehop.vercel.app), no una maqueta: pasos 1-18 del
  manual de obra completados, con puerta de calidad, plan de emergencia y
  rutina de observabilidad operativa.
- **Tamaño**: 1 persona. Coste de infraestructura: **0 €/mes** (Vercel free).
  Sin ingresos todavía. Sin base de datos que mantener (los datos viven en
  sesión).
- **Contexto del fundador**: además de desarrolladora, tiene formación en
  Comunicación con especialidad en **Creatividad publicitaria (matrícula de
  honor)**. Esto convierte el talento creativo en el primer recurso del
  negocio — más relevante que cualquier presupuesto.

---

## 2. PRODUCTO O SERVICIO

- **Qué se vende exactamente**: una migración de playlists **fácil, rápida y
  privada** de Spotify a TIDAL, vía web, sin instalar nada.
  - Conexión segura con OAuth (Spotify PKCE + TIDAL Authorization Code).
  - Búsqueda de canciones por **ISRC multi-país** (US, ES, GB, MX, DE) con
    fallback automático por nombre/artista.
  - Revisión manual profesional de las canciones no encontradas: candidatos,
    reintento, omitir, exportar JSON.
  - Procesamiento por tandas (resiliente ante límites de API).
- **Modelo de negocio**: **pendiente de confirmar.** Hoy la app es gratuita
  para el usuario. Opciones sobre la mesa (a validar en pasos posteriores):
  pago único, suscripción, freemium con límites, o **venta de la propia
  app** (hipótesis de la fundadora).
- **Promesa diferencial**: 3 minutos frente a horas de migración manual.
  La usuaria de referencia migraba buscando "canción por canción" y acababa
  frustrada. TuneHop hace el trabajo por ella.
- **Estado**: listo para buscar usuarios reales. La prueba de usuarios del
  manual de obra (5 personas) está pendiente de ejecutar y es la puerta
  natural hacia el público real.

---

## 3. POR QUÉ AHORA

El disparador es **el lanzamiento al mercado real**:

1. El producto técnico **está terminado y publicado** (Paso 17 del manual de
   obra: puerta de calidad superada, checklist legal en pantalla, protocolo de
   incidentes). Ya no hay excusa técnica para esperar.
2. La fundadora quiere pasar de "proyecto de bootcamp" a **producto con
   usuarios e ingresos**.
3. **Contexto de mercado favorable**: cada vez más oyentes quieren irse de
   Spotify (pago a artistas, ética, precios) pero se quedan porque migrar sus
   playlists a mano es inviable. Ese dolor es el problema que TuneHop ya
   resuelve técnicamente.

No hay crisis ni reposicionamiento: es un **lanzamiento**.

---

## 4. OBJETIVO DE NEGOCIO

Qué debe pasar en el negocio (no en la campaña), en el orden declarado por la
fundadora:

1. **Que se use** — personas reales migrando playlists con TuneHop, sin que
   la fundadora tenga que acompañarlas.
2. **Que genere dinero** — la fundadora quiere llegar a **vender la app**
   ("vender la app estaría bien, sacar dinero de este proyecto también").
   El modelo de ingresos está por definir.
3. **Aprender y tener un case study** — objetivo de formación, se cumple ya
   en parte (pasos 19-20 del manual de obra pendientes).

**Pendiente de confirmar**: cifras concretas (cuántos usuarios, cuántos
ingresos, en qué plazo). Se propondrán y se validarán con la fundadora en el
Paso 2 (auditoría) antes de usarlas como metas.

---

## 5. PÚBLICO OBJETIVO PRELIMINAR

Mejor hipótesis hoy, a falta de la investigación del Paso 3:

**María, 32 años, diseñadora gráfica freelance** (persona del manual de obra):

- No es técnica. Usa el ordenador para trabajar y entretenerse.
- Tiene **347 playlists y ~5.200 canciones** en Spotify tras 8 años.
- Ya probó Tidal y Deezer, y **abandonó frustrada** por tener que buscar
  canción a canción.
- **Motivación**: quiere apoyar plataformas que paguen mejor a los artistas,
  pero no está dispuesta a perder horas migrando.
- Usa móvil y ordenador por igual.

**Hipótesis ampliable** (a validar en Paso 3): amantes de la música con
motivación ética/económica para dejar Spotify, con playlists grandes (>100
canciones), que ya intentaron migrar y no pudieron.

---

## 6. PRESUPUESTO Y RECURSOS

- **Dinero**: 0 € preferible. Máximo absoluto **50 €/mes**, y **no todos los
  meses**. Esto condiciona la estrategia: canales orgánicos y creativos
  primero (la propia formación publicitaria de la fundadora como motor), y
  cualquier inversión pagada se decide caso a caso.
- **Equipo**: 1 persona (fundadora). Ella es a la vez producto, desarrollo,
  marca y comunicación.
- **Tiempo**: parcial (compatibiliza con el bootcamp y su vida). Sin jornada
  completa dedicada.
- **Infraestructura**: ya resuelta a coste 0 (Vercel free, sin servidores que
  pagar).
- **Activo diferencial**: creatividad publicitaria profesional con matrícula
  de honor. La "compra de medios" tradicional no aplica; la **idea** sí.

---

## 7. PLAZOS Y HITOS

- **Sin fechas inamovibles** declaradas por la fundadora. No hay lanzamiento
  con fecha tope ni evento externo que obligue.
- Hitos internos que sí estructuran el calendario:
  - Ejecutar la **prueba de usuarios** del manual de obra (5 personas,
    pendiente) antes de escalar el marketing.
  - Completar los 22 pasos de la pista de marketing.
  - Cerrar los pasos 19-20 del manual de obra (case study y memoria) — el
    case study y el marketing se alimentan mutuamente.

---

## 8. COMPETENCIA DIRECTA CONOCIDA (a ojo)

Herramientas establecidas de migración de playlists que ya ocupan este
espacio: **Soundiiz, TuneMyMusic, FreeYourMusic, SongShift, MusConv,
Playlist Converter**. La mayoría funcionan por suscripción o freemium con
límites y son genéricas (multi-plataforma).

**Hipótesis a validar en el Paso 3** (no confirmada hoy): ninguna de ellas
combina el ángulo de TuneHop — (a) simple para no técnicos, (b) migración
ética motivada por el pago a artistas, (c) privacidad total sin retención de
datos, (d) trato digno a Spotify (no atacar, solo irse). Si se confirma, ese
hueco es el territorio de marca.

---

## 9. MANDATORIOS Y RESTRICCIONES

Lo que sí o sí debe respetarse, venga del producto, de la ley o de la marca:

1. **TuneHop solo LEE de Spotify y solo ESCRIBE en TIDAL.** Nunca modifica,
   borra ni mueve nada en Spotify. El marketing no puede sugerir lo contrario
   ni prometer funciones que violen esto.
2. **Posicionamiento público neutro**: no atacar a Spotify (decisión tomada
   en el Paso 1 del manual de obra). Se vende la libertad de irse y el
   destino, no el odio a la plataforma de origen.
3. **Privacidad total**: los tokens OAuth se procesan en sesión y se eliminan
   al cerrar. Sin datos personales persistidos. Consentimiento RGPD con
   checkbox previo y botón de borrado de datos (Art. 17). **Prohibido usar
   datos de usuarios para profiling, analytics agresivos o recomendaciones.**
4. **Sin secretos en git ni en la wiki.** Revisar `git diff` antes de cada
   commit.
5. **Presupuesto de marketing casi nulo** (máx. 50 €/mes esporádicos): la
   estrategia debe caber en 0 €.
6. **Idioma**: la app está en español (i18n). El marketing de lanzamiento
   arranca en español.
7. **Accesibilidad WCAG AA** y tono respetuoso en toda comunicación pública.
8. **Marca ya decidida**: **TuneHop** (naming seleccionado con rúbrica en el
   manual de obra). No se reabre el debate del nombre en esta pista.

---

## 10. CRITERIO DE ÉXITO

Cómo sabremos, al final, que esto funcionó. Dimensiones del éxito, según la
fundadora:

| Dimensión | Indicador | Meta |
|---|---|---|
| Uso real | Migraciones completadas por personas que no son la fundadora | **Pendiente de confirmar** |
| Venta / ingresos | Venta de la app o primer ingreso recurrente | **Pendiente de confirmar** (modelo por definir) |
| Case study | Proyecto enseñable con métricas y decisiones documentadas | Pasos 19-20 del manual de obra |

**Pendiente de confirmar**: las cifras exactas de las dos primeras filas. Se
propondrán cifras razonables en el Paso 2 y se validarán con la fundadora
antes de fijarlas como objetivo. Yara no inventa números ajenos.