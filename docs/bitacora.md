# Bitácora del proyecto

Cuaderno de decisiones del proyecto TuneHop. Cada entrada registra por qué se tomó una decisión, qué se descartó, qué se rompió y qué queda pendiente. Úsalo en los Pasos 19 y 20.

---

## 2026-08-31 · Pasos 1-5 — Fase de definición (Problema → Spec)

- **QUÉ SE DECIDIÓ** — TuneHop es una app web que migra playlists de Spotify a Deezer (MVP) con un clic. Usa OAuth para conectarse, ISRC para buscar canciones, y procesa en tandas de 50. Clasificada como riesgo mínimo bajo el AI Act y con obligaciones RGPD completas. Posicionamiento público neutro: no ataca a Spotify.

- **ALTERNATIVAS DESCARTADAS** — (1) Incluir TIDAL en el MVP: descartado por los "access tiers" de la API que pueden bloquear la búsqueda de tracks. (2) Posicionamiento agresivo contra Spotify: descartado por riesgo de rechazo del usuario. (3) Migración inversa: descartada porque el problema solo contempla Spotify → destino. (4) Selección manual de alternativas para no encontradas: descartada para v2 por complejidad.

- **POR QUÉ ESTA** — Deezer tiene API pública completa y gratuita desde el registro (zero friction). TIDAL tiene un matiz de access tiers que es un riesgo innecesario para el MVP. El posicionamiento neutro es más profesional y no cierra puertas a usuarios que no tienen motivación política. La spec-driven development (escribir QUÉ antes de CÓMO) evita teclear antes de tiempo.

- **QUÉ SE ROMPIÓ** — Nada roto en esta fase. Se verificó la viabilidad técnica de OAuth en las 3 plataformas antes de escribir historias, lo que evitó un problema potencial (TIDAL podría no estar disponible para todos los endpoints).

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — (1) Confirmar si el tier THIRD_PARTY de TIDAL cubre los endpoints de búsqueda de tracks (relevante para v2). (2) Cómo maneja Deezer los rate limits exactos en la práctica (sabemos ~50 req/s teórico, pero no lo hemos probado). (3) Si hay límites de migración por cuenta de Deezer (free vs premium). (4) El sistema de internacionalización: ¿archivos de traducción por idioma? ¿Un servicio? Aún no lo sabemos.

---

## 2026-08-31 · Pasos 6-8 — Fase de planificación técnica (Stack → Tareas)

- **QUÉ SE DECIDIÓ** — Stack: Next.js + TypeScript (todo en uno). Hosting: Vercel (0€/mes). La IA no interviene en el MVP (100% determinista). 65 tareas en 12 hitos para la implementación.

- **ALTERNATIVAS DESCARTADAS** — (1) Python + FastAPI (backend) + JS vanilla (frontend): dos proyectos separados, dos lenguajes, más piezas que romperse. (2) Python + FastAPI + React: mismo problema de dos proyectos. (3) Node.js + Express + React: demasiado para una principiante (3 cosas nuevas a la vez). (4) IA en el fallback de búsqueda: decidimos no construirla preventivamente; si la precisión determinista es < 85% se añade después.

- **POR QUÉ ESTA** — Next.js es un solo proyecto (frontend + backend), un solo lenguaje (TypeScript), deploy en 1 clic (Vercel), y es el stack más demandado del mercado. La alumna no construye manualmente (vibe code), así que la prioridad es robustez y menos errores, no simplicidad de código.

- **QUÉ SE ROMPIÓ** — Nada roto. Pero se detectó un punto de decisión importante: la alumna clarificó que ella vibe codea (yo construyo, ella aprende), lo que cambia la recomendación de stack de "lo más simple" a "lo más profesional".

- **QUÉ QUEDA PENDIENTE** — (1) Registrar apps en Spotify Developer Dashboard y Deezer Developer Portal (T11, T21). (2) Configurar Redirect URIs en ambas plataformas (T63, T64). (3) El sistema de internacionalización: ¿next-intl? ¿i18next? Aún no se ha investigado.

---

## 2026-09-01 · Paso 10 — Hito 1 (setup) + decisión de naming

- **QUÉ SE DECIDIÓ** — (1) Proyecto Next.js 16 + TypeScript + Tailwind creado y compilando (tareas T01-T04, Hito 1 cerrado). (2) La app pasa a llamarse **TuneHop**, antes **PlayMigrate**: rebranding ejecutado en 14 archivos, 56 sustituciones (commit 2b0dc75).

- **ALTERNATIVAS DESCARTADAS** — Nombres evaluados con rúbrica de branding (semántica, sonoridad, distintivo, corto, colisión): PlayMigrate (49/100), Shift (60/100), TunePort (81), RelayTunes (79), SongSwitch, Melodio. También se consideró quedarse con PlayMigrate para no perder tiempo.

- **POR QUÉ ESTA** — TuneHop tiene 2 sílabas, comunica categoría y acción a la vez (tune = música, hop = saltar de plataforma) con emoción ligera. "PlayMigrate" sonaba a herramienta de IT: "migrate" es lenguaje de departamento técnico y "Play" es el prefijo más saturado del mundo musical (Google Play, PlayStation...). "Shift" era potente pero genérico: sin dominio posible, sin registro de marca, y la competencia líder de nuestra categoría (SongShift) ya ocupa esa palabra. TuneHop pasó verificación: tunehop.com/.app sin sitio activo, ninguna app de migración conocida con ese nombre. Decisión de marca tomada con criterio de marketing, no improvisada.

- **QUÉ SE ROMPIÓ** — create-next-app falló con "Could not create a project called 'Spotify' because of npm naming restrictions" (npm prohíbe mayúsculas en el nombre del paquete). Solución: generar el proyecto en /tmp con nombre válido y mover los archivos al repo. También: detener el servidor dev con pkill colgó la shell de opencode dos veces (cosmético, sin impacto). next-env.d.ts se regeneró automáticamente al compilar (Next 16 apunta a .next/types en build de producción) — comportamiento normal.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La alumna declara haber entendido todo lo de la sesión (generación del proyecto, instalación, estructura). Pendientes prácticos: (1) registrar el dominio tunehop.com; (2) T07 sustituirá la landing de bienvenida en inglés por la landing oficial de TuneHop.
