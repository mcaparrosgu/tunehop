# Bitácora del proyecto

Cuaderno de decisiones del proyecto PlayMigrate. Cada entrada registra por qué se tomó una decisión, qué se descartó, qué se rompió y qué queda pendiente. Úsalo en los Pasos 19 y 20.

---

## 2026-08-31 · Pasos 1-5 — Fase de definición (Problema → Spec)

- **QUÉ SE DECIDIÓ** — PlayMigrate es una app web que migra playlists de Spotify a Deezer (MVP) con un clic. Usa OAuth para conectarse, ISRC para buscar canciones, y procesa en tandas de 50. Clasificada como riesgo mínimo bajo el AI Act y con obligaciones RGPD completas. Posicionamiento público neutro: no ataca a Spotify.

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
