# Paso 1 — Problema

## 1. PROBLEMA

**Las personas que quieren dejar de usar Spotify no encuentran una forma sencilla de mover sus playlists a otras plataformas musicales, por lo que se quedan en Spotify aunque quieran irse.**

---

## 2. USUARIO

**María, 32 años, diseñadora gráfica freelance.**

- No sabe programar. Usa la ordenadora para trabajar y para entretenimiento.
- Tiene una cuenta de Spotify con 347 playlists creadas en 8 años (5.200 canciones).
- Ha probado Tidal y Deezer, pero se frustró porque tuvo que buscar canción por canción.
- Usa el móvil y el ordenador por igual. Prefiere cosas que funcionen en ambos sin complicaciones.
- Motivación: quiere apoyar plataformas que paguen mejor a los artistas, pero no está dispuesta a perder horas migrando manualmente.

---

## 3. EJEMPLO CONCRETO

**Escena de uso:**

1. María entra en **tunehop.com** desde su móvil.
2. Pulsar un botón grande que dice **"Conectar con Spotify"**.
3. Spotify le pide permiso. María pulsa "Aceptar".
4. La app carga todas sus playlists automáticamente.
5. María ve la lista de sus playlists con un checkbox al lado de cada una.
6. Selecciona las 5 playlists que quiere migrar.
7. Elige **"Tidal"** como plataforma destino.
8. Pulsar **"Migrar ahora"**.
9. La app le pide que conecte su cuenta de Tidal (OAuth también).
10. Ve una barra de progreso: *"Migrando Playlist 'Road Trip Mix'... 12/24 canciones encontradas"*
11. Al terminar, ve un resumen: *"23 de 24 canciones migradas. 1 no encontrada en Tidal"* con un enlace para ver cuál falta.
12. María abre Tidal y ahí están sus playlists, listas para escuchar.

**Tiempo total: 3 minutos.**

---

## 4. CRITERIO DE ÉXITO

- Un usuario no técnico puede migrar una playlist de Spotify a otra plataforma en **menos de 5 minutos**.
- La app encuentra al menos el **80% de las canciones** en la plataforma destino (usando ISRC como identificador universal).
- El usuario recibe información clara sobre qué canciones no se encontraron y por qué.

---

## 5. QUÉ NO ES

1. **No es un reproductor de música.** No reproduce canciones. Es una herramienta de migración.
2. **No es un gestor de playlists.** No edita, mezcla ni recomienda playlists. Solo las mueve de un sitio a otro.
3. **No es una red social.** No tiene perfiles, seguidores ni feed. Es una utilidad pura.

---

## 6. RIESGOS

1. **Las APIs cambian o restringen acceso.** Spotify, Deezer o Tidal pueden cambiar sus condiciones de uso o limitar la API. Mitigación: usar la documentación oficial y estar preparados para adaptarnos.

2. **No encontrar canciones (ISRC no coincide).** Algunas canciones versionadas, remezcladas o de artistas independientes pueden no tener ISRC o tener uno diferente entre plataformas. Mitigación: usar búsqueda por nombre + artista como fallback.

3. **Cambio de percepción del usuario.** Si el público descubre que la app tiene motivación política (boicot a Spotify), puede generar rechazo en algunos usuarios. Mitigación: el posicionamiento público es "migra tus playlists fácil", sin mencionar motivos políticos. El mensaje es la facilidad, no la protesta.

---

*Documento generado en el Paso 1 del método de 20 pasos.*
*Siguiente paso: Paso 2 — Historias de usuario.*
