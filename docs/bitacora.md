# Bitácora del proyecto

Cuaderno de decisiones del proyecto PlayMigrate. Cada entrada registra por qué se tomó una decisión, qué se descartó, qué se rompió y qué queda pendiente. Úsalo en los Pasos 19 y 20.

---

## 2026-08-31 · Pasos 1-5 — Fase de definición (Problema → Spec)

- **QUÉ SE DECIDIÓ** — PlayMigrate es una app web que migra playlists de Spotify a Deezer (MVP) con un clic. Usa OAuth para conectarse, ISRC para buscar canciones, y procesa en tandas de 50. Clasificada como riesgo mínimo bajo el AI Act y con obligaciones RGPD completas. Posicionamiento público neutro: no ataca a Spotify.

- **ALTERNATIVAS DESCARTADAS** — (1) Incluir TIDAL en el MVP: descartado por los "access tiers" de la API que pueden bloquear la búsqueda de tracks. (2) Posicionamiento agresivo contra Spotify: descartado por riesgo de rechazo del usuario. (3) Migración inversa: descartada porque el problema solo contempla Spotify → destino. (4) Selección manual de alternativas para no encontradas: descartada para v2 por complejidad.

- **POR QUÉ ESTA** — Deezer tiene API pública completa y gratuita desde el registro (zero friction). TIDAL tiene un matiz de access tiers que es un riesgo innecesario para el MVP. El posicionamiento neutro es más profesional y no cierra puertas a usuarios que no tienen motivación política. La spec-driven development (escribir QUÉ antes de CÓMO) evita teclear antes de tiempo.

- **QUÉ SE ROMPIÓ** — Nada roto en esta fase. Se verificó la viabilidad técnica de OAuth en las 3 plataformas antes de escribir historias, lo que evitó un problema potencial (TIDAL podría no estar disponible para todos los endpoints).

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — (1) Confirmar si el tier THIRD_PARTY de TIDAL cubre los endpoints de búsqueda de tracks (relevante para v2). (2) Cómo maneja Deezer los rate limits exactos en la práctica (sabemos ~50 req/s teórico, pero no lo hemos probado). (3) Si hay límites de migración por cuenta de Deezer (free vs premium). (4) El sistema de internacionalización: ¿archivos de traducción por idioma? ¿Un servicio? Aún no lo sabemos.
