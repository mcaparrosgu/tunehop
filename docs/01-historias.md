# Paso 2 — Historias de usuario

> Producto: PlayMigrate — migra tus playlists de Spotify a plataformas éticas (Deezer, TIDAL).
> Usuario de referencia: María, no técnica, móvil y ordenador.

---

## BLOQUE A — Conexión a Spotify (origen)

### H1 — Conectar cuenta de Spotify — IMPRESCINDIBLE

> Como María, quiero conectar mi cuenta de Spotify con un solo clic, para que la app pueda leer mis playlists sin que yo tenga que compartir mi contraseña.

**Criterios de aceptación:**
1. Dado que estoy en la portada, cuando pulso "Conectar con Spotify", entonces se abre la pantalla de autorización oficial de Spotify.
2. Dado que le doy permiso a la app, cuando Spotify redirige a la app, entonces la app muestra mis playlists cargadas.
3. Dado que cancelo la autorización, cuando vuelvo a la app, entonces veo un mensaje claro de que no se conectó y un botón para reintentar.
4. Dado que ya me conecté antes, cuando vuelvo a la app, entonces no tengo que volver a autorizar.

### H2 — Requisito: credenciales de Spotify para el desarrollo — IMPRESCINDIBLE

> Como desarrolladora, quiero registrar la app en Spotify Developer Dashboard, para obtener un Client ID que permita el flujo OAuth.

**Criterios de aceptación:**
1. Dado que me registro en Spotify Developer Dashboard, cuando creo una app, entonces obtengo un Client ID.
2. Dado que tengo el Client ID, cuando lo configuro en las variables de entorno, entonces la app puede iniciar el flujo OAuth.
3. Dado que la API cambia condiciones, cuando algo falla en OAuth, entonces recibo un error descriptivo y puedo diagnosticarlo.

---

## BLOQUE B — Selección de playlists

### H3 — Ver y seleccionar playlists — IMPRESCINDIBLE

> Como María, quiero ver mi lista de playlists con una casilla de verificación en cada una, para elegir solo las que quiero migrar.

**Criterios de aceptación:**
1. Dado que he conectado Spotify, cuando se cargan mis playlists, entonces veo el nombre, el número de canciones y una casilla de verificación en cada una.
2. Dado que tengo muchas playlists, cuando la lista es larga, entonces puedo desplazarme y ver todas.
3. Dado que no tengo playlists creadas por mí, cuando cargo la lista, entonces veo un mensaje claro de que no hay playlists propias.
4. Dado que selecciono playlists, cuando son varias, entonces veo un contador de seleccionadas.
5. Dado que tengo muchas playlists y no quiero elegirlas una a una, cuando pulso "Seleccionar todo", entonces se marcan todas las playlists disponibles.
6. Dado que todas están seleccionadas, cuando pulso "Quitar selección", entonces se desmarcan todas.

---

## BLOQUE C — Conexión a plataforma destino

### H4 — Conectar una plataforma destino (Deezer o TIDAL) — IMPRESCINDIBLE

> Como María, quiero conectar con la plataforma a la que quiero mover mis playlists, para que la app pueda crearlas allí con mi autorización.

**Criterios de aceptación:**
1. Dado que he seleccionado playlists, cuando elijo la plataforma destino, entonces se abre la autorización oficial de esa plataforma.
2. Dado que autorizo la plataforma destino, cuando vuelvo a la app, entonces veo confirmado que está conectada.
3. Dado que elijo una plataforma sin dar permiso, cuando cancelo, entonces veo un mensaje y puedo elegir otra o reintentar.

---

## BLOQUE D — Ejecución de la migración

### H5 — Migrar playlists seleccionadas — IMPRESCINDIBLE

> Como María, quiero pulsar un botón "Migrar" para que la app copie todas mis playlists seleccionadas a la nueva plataforma de una sola vez.

**Criterios de aceptación:**
1. Dado que he seleccionado al menos una playlist y conectado el destino, cuando pulso "Migrar ahora", entonces se crean las playlists en el destino.
2. Dado que migro varias playlists, cuando el proceso avanza, entonces veo el progreso de cada una.

### H6 — Ver progreso en tiempo real — IMPORTANTE

> Como María, quiero ver cuántas canciones se han encontrado de cada playlist, para saber si la migración avanza y si hay problemas.

**Criterios de aceptación:**
1. Dado que estoy migrando, cuando el proceso avanza, entonces veo "Playlist X — Y/Z canciones encontradas".
2. Dado que una playlist es grande, cuando la migración tarda, entonces veo una barra de progreso que indica el avance.
3. Dado que algo se queda esperando, cuando no hay avance durante un tiempo, entonces veo un indicador de carga y puedo cancelar.

### H7 — Migrar canciones no encontradas de forma asistida — DESEABLE

> Como María, quiero ver qué canciones no se encontraron en la plataforma destino, para poder decidir si busco alternativas o las dejo fuera.

**Criterios de aceptación:**
1. Dado que una canción no se encuentra, cuando termina la migración, entonces aparece en una lista de "no encontradas".
2. Dado que hay canciones no encontradas, cuando amplío la lista, entonces veo el título y el artista de cada una.

### H7b — Buscar alternativas para las canciones no encontradas — DESEABLE

> Como María, quiero que la app intente resolver automáticamente las canciones que no encontró, para no tener que buscarlas yo manualmente.

**Criterios de aceptación:**
1. Dado que una canción no se encontró por ISRC, cuando la re-busco, entonces la app la intenta encontrar por título y artista.
2. Dado que igualmente no hay coincidencia, cuando agota la búsqueda automática, entonces la deja en la lista de "no encontradas" y me avisa.
3. Dado que la app encuentra una alternativa probable, cuando la valida, entonces me informa qué alternativa eligió y la migra.

---

## BLOQUE E — Resultados

### H8 — Ver resumen de la migración — IMPRESCINDIBLE

> Como María, quiero ver un resumen final de lo que se migró y lo que no, para saber si algo quedó pendiente.

**Criterios de aceptación:**
1. Dado que termina la migración, cuando veo el resumen, entonces veo "X canciones migradas, Y no encontradas" con el desglose por playlist.
2. Dado que hay canciones no encontradas, cuando veo el resumen, entonces tengo un enlace para ver el detalle de cuáles son.

### H9 — Ver las playlists migradas en la plataforma destino — DESEABLE

> Como María, quiero confirmar que mis playlists están en la plataforma destino, para saber que la migración fue real.

**Criterios de aceptación:**
1. Dado que termina la migración, cuando elijo ver las playlists, entonces se abre la plataforma destino mostrando mis playlists nuevas.
2. Dado que hay varias playlists migradas, cuando veo la lista, entonces todas aparecen con su nombre original.

---

## BLOQUE F — Calidad de la búsqueda

### H10 — Encontrar canciones por identificador único (ISRC) — IMPRESCINDIBLE

> Como María, quiero que la app busque mis canciones usando su código universal (ISRC), para que la coincidencia sea exacta y no haya versiones equivocadas.

**Criterios de aceptación:**
1. Dado que una canción de Spotify tiene ISRC, cuando la busco en el destino, entonces se usa el ISRC como identificador principal.
2. Dado que el ISRC no existe en el destino, cuando la canción no se encuentra por ISRC, entonces se intenta buscar por nombre y artista.
3. Dado que varias canciones coinciden, cuando hay ambigüedad, entonces se elige la coincidencia más probable por título, artista y duración.

---

## BLOQUE G — Robustez y errores

### H11 — Frenar correctamente un token caducado — IMPRESCINDIBLE

> Como María, quiero que si mi sesión con Spotify o el destino caduca durante la migración, la app me lo avise y me deje reconectar sin perder el progreso.

**Criterios de aceptación:**
1. Dado que un token caduca, cuando la app intenta usarlo, entonces veo un mensaje de "Sesión caducada".
2. Dado que mi sesión caducó, cuando reconecto, entonces continúo desde donde me quedé (no repito canciones ya migradas).

### H12 — Reintentar la migración si algo falla — IMPORTANTE

> Como María, quiero que si un paso falla, la app me deje reintentar, para no perder la migración por un error puntual de red o de la API.

**Criterios de aceptación:**
1. Dado que un paso falla por un error temporal, cuando lo reintento, entonces la app lo vuelve a intentar automáticamente.
2. Dado que un fallo persiste, cuando agota los reintentos, entonces veo un mensaje de error claro y qué playlist quedó pendiente.

### H13 — Avisar cuando el servicio no está disponible — DESEABLE

> Como María, quiero que si la plataforma destino está caída o muy lenta, la app me avise, para no pensar que mi migración fracasó.

**Criterios de aceptación:**
1. Dado que la plataforma destino responde muy lento, cuando lanza la migración, entonces veo un aviso de lentitud.
2. Dado que la plataforma destino está caída, cuando intento migrar, entonces veo un mensaje de "servicio temporalmente no disponible, inténtalo más tarde".

---

## BLOQUE H — Qué ve el usuario mientras espera

### H14 — Feedback visual en cada paso — IMPORTANTE

> Como María, quiero ver siempre qué está pasando la app (conectar, cargando, migrando, terminado), para no pensar que se ha colgado.

**Criterios de aceptación:**
1. Dado que la app está en cualquier estado (conectando, cargando, migrando), cuando espero, entonces veo un indicador de carga y un texto de qué está haciendo.
2. Dado que la migración termina, cuando veo el estado final, entonces el indicador desaparece.

### H15 — Abandonar/cancelar una migración — DESEABLE

> Como María, quiero poder cancelar una migración que estoy haciendo si me arrepiento o me llevo demasiado tiempo, para no quedar bloqueada.

**Criterios de aceptación:**
1. Dado que hay una migración en curso, cuando pulso cancelar, entonces se detiene el proceso y no se crean más playlists.
2. Dado que cancelo la migración, cuando se detiene, entonces veo un resumen de lo que sí se llegó a migrar.

---

## BLOQUE H2 — Migración de colecciones completas (álbumes, artistas, gustos)

### H16 — Migrar álbumes guardados — DESEABLE

> Como María, quiero migrar también los álbumes que tengo guardados en Spotify, para no perder mi colección de álbumes favoritos al cambiar de plataforma.

**Criterios de aceptación:**
1. Dado que tengo álbumes guardados en Spotify, cuando elijo migrar álbumes, entonces se crean/marcan esos álbumes en la plataforma destino.
2. Dado que migro varios álbumes, cuando termina, entonces veo cuántos se migraron y cuáles no se encontraron.

### H17 — Migrar artistas seguidos — DESEABLE

> Como María, quiero migrar también los artistas que sigo en Spotify, para seguir sus novedades en la nueva plataforma sin perder mi lista de favoritos.

**Criterios de aceptación:**
1. Dado que sigo artistas en Spotify, cuando elijo migrar artistas, entonces se siguen/marcan esos artistas en la plataforma destino.
2. Dado que migro varios artistas, cuando termina, entonces veo cuántos se migraron y cuáles no se encontraron.

### H18 — Migrar canciones guardadas (Liked Songs) — DESEABLE

> Como María, quiero migrar también mi lista completa de canciones guardadas ("Me gusta") de Spotify, para no perder esa colección que he construido durante años.

**Criterios de aceptación:**
1. Dado que tengo canciones guardadas en Spotify, cuando elijo migrar "Mis gustos", entonces se crea una playlist o se marcan en la plataforma destino.
2. Dado que la lista de "Me gusta" es muy larga, cuando la migro, entonces veo el progreso y cuántas quedan.
3. Dado que hay canciones guardadas que no existen en el destino, cuando termina, entonces veo cuáles no se encontraron.

---

## BLOQUE I — Eliminar Spotify

### H19 — Instrucciones para eliminar la cuenta de Spotify — DESEABLE

> Como María, quiero encontrar instrucciones claras para eliminar mi cuenta de Spotify después de haber migrado, para poder cerrar el ciclo sin complicaciones.

**Criterios de aceptación:**
1. Dado que he migrado mis playlists, cuando pulso "Eliminar mi cuenta de Spotify", entonces veo los pasos para solicitar la eliminación en Spotify.
2. Dado que veo los pasos, cuando sigo las instrucciones, entonces la app explica claramente qué pasa con mis datos y cuánto tarda la eliminación.

---

## HUECOS DETECTADOS (fuera del alcance actual, anotados para el Paso 3 MVP)

- **Migración inversa (de otras plataformas hacia Spotify o entre ellas)**: El problema solo contempla Spotify → destino. La migración entre plataformas no-Spotify no está definida.
- **Playlists colaborativas: regla de COPIA, no traslado**: Las playlists colaborativas se copiarán igual que las propias, pero **nunca se mueven ni se borran de Spotify**. La app solo lee de Spotify (OAuth de lectura), no elimina nada del origen. Los colaboradores originales no se ven afectados. Confirmar si las colaborativas entran en el MVP.
- **Límite de tasa (rate limits) de las APIs**: No hay historia específica sobre manejar los límites de peticiones por segundo de Spotify/TIDAL. H13 lo bordea pero no lo define.
- **Selección manual de alternativas para no encontradas**: H7b resuelve las no encontradas de forma automática, pero no hay historia para que el usuario elija manualmente una alternativa entre varias candidatas. DESEABLE post-MVP.
- **Privacidad de los datos**: No hay historia sobre qué pasa con los tokens OAuth (dónde se guardan, se revocan, caducan). Importante para RGPD y seguridad.

---

*Historia base: docs/00-problema.md*
*Siguiente paso: Paso 3 — Recortar hasta el MVP.*