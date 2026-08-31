# PlayMigrate — Contexto del proyecto

## Qué es este proyecto

PlayMigrate es una app web que migra playlists de Spotify a Deezer (MVP) usando OAuth e ISRC. Next.js + TypeScript, deploy en Vercel.

## Restricción principal del proyecto

**PlayMigrate solo LEE de Spotify y solo ESCRIBE en Deezer.** Nunca modifica, borra ni mueve nada en Spotify. Las playlists se copian, nunca se trasladan.

## Seguridad y datos sensibles

- **NUNCA** escribas API keys, tokens, contraseñas ni credenciales en archivos que se suban a git
- **NUNCA** subas `.env.local` a git (ya está en `.gitignore`)
- Los secretos van en `.env.local` (desarrollo) o en Vercel Environment Variables (producción)
- Los tokens OAuth de los usuarios se procesan en sesión y se eliminan al cerrar. No se persisten
- Todo el tráfico debe ser HTTPS
- Verifica `git diff` antes de cada commit buscando secretos

## Qué NO debe hacer nunca un agente en este repositorio

- **NUNCA** escribas API keys, tokens o contraseñas en el código fuente
- **NUNCA** subas `.env.local` o archivos con secretos a git
- **NUNCA** borres, modifiques o muevas playlists en Spotify. Solo lectura
- **NUNCA** guardes datos personales de usuarios (email, tokens, nombres de playlist) después de la sesión
- **NUNCA** uses datos de usuario para algo que no sea la migración (no profiling, no analytics, no recomendaciones)
- **NUNCA** compartas datos de usuario con terceros
- **NUNCA** instales dependencias nuevas sin verificar que son necesarias y seguras
- **NUNCA** cambies la configuración de TypeScript para desactivar chequeos de tipos (no uses `// @ts-ignore` ni `skipLibCheck: true` sin justificación)
- **NUNCA** hagas commit sin verificar `git diff` en busca de secretos

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Vercel (hosting)
- OAuth 2.0 (Spotify + Deezer)
- Sin base de datos (datos en sesión)

## Orden de los pasos del método

El proyecto sigue el método de 20 pasos. Los docs están en `docs/`:
- `00-problema.md` → `07-tareas.md`: fase de planificación (completada)
- `08-construccion.md` en adelante: fase de construcción

## Contacto

Desarrolladora: mcaparrosgu (GitHub)
