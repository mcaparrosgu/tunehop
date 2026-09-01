# Paso 5 — Especificación Funcional (Spec)

> **REGLA**: Esta spec describe QUÉ y POR QUÉ. No menciona tecnología, lenguaje, framework ni base de datos.
> La tecnología se decide en el Paso 6 (plan técnico).

---

## 1. OBJETIVO

TuneHop es una aplicación web que permite a cualquier persona con cuenta de Spotify migrar sus playlists, álbumes guardados, artistas seguidos y canciones guardadas a plataformas musicales alternativas (Deezer en el MVP, TIDAL en v2). El proceso es en un clic: conectar, seleccionar, migrar. La app busca las canciones por código universal (ISRC) para garantizar coincidencia exacta, con fallback a nombre y artista. Muestra progreso en tiempo real y un resumen detallado al terminar. Respeta la privacidad del usuario: no guarda datos después de la sesión. No es un reproductor de música, no es una red social, no es un gestor de playlists. Es una herramienta de migración simple, rápida y transparente.

---

## 2. USUARIOS Y PERMISOS

| Tipo de usuario | Puede hacer |
|---|---|
| **Visitante** (sin conectar) | Ver la landing, leer la Política de Privacidad, aceptar consentimiento |
| **Usuario conectado** (Spotify autorizado) | Ver sus playlists, seleccionarlas, migrarlas, ver resultado, ver detalle de no encontradas, borrar datos |
| **No hay admin, moderador ni ningún otro rol.** | |

---

## 3. RECORRIDOS

### Pantalla 1 — Landing

**Qué ve María:**
- Título de la app: "TuneHop"
- Subtítulo: "Migra tus playlists de Spotify a otras plataformas musicales"
- Botón grande: "Connect Spotify"
- Texto de privacidad visible: "Tus datos se borran al cerrar la sesión. No guardamos nada."
- Enlace a la Política de Privacidad

**Qué hace María:**
- Lee la información
- Pulsa "Connect Spotify"

**Resultado:** Se abre la Pantalla 2 (consentimiento).

---

### Pantalla 2 — Consentimiento (antes de conectar)

**Qué ve María:**
- Checkbox obligatorio: "He leído la Política de Privacidad y acepto que TuneHop procese mis datos de Spotify para migrar mis playlists"
- Aviso informativo: "Las playlists pueden contener datos personales. TuneHop no analiza ni almacena estos títulos más allá de la migración"
- Botón "Conectar con Spotify" (desactivado si el checkbox no está marcado)

**Qué hace María:**
- Marca el checkbox
- Pulsa "Conectar con Spotify"

**Resultado:** Se abre la pantalla de autorización oficial de Spotify. Tras aceptar, vuelve a TuneHop (Pantalla 3).

**Regla legal:** El botón "Conectar" solo se activa si el checkbox está marcado (RGPD Art. 7).

---

### Pantalla 3 — Selección de playlists

**Qué ve María:**
- Título: "Tus playlists (N)"
- Botón "Seleccionar todo" / "Quitar selección"
- Lista de playlists: nombre + nº de canciones + checkbox (desmarcado por defecto)
- Contador: "X seleccionadas"
- Botón "Continuar" (solo activo si hay ≥1 seleccionada)

**Qué hace María:**
- Ve su lista completa de playlists
- Marca las que quiere migrar (o pulsa "Seleccionar todo")
- Pulsa "Continuar"

**Resultado:** Se abre la Pantalla 4.

**Caso límite:** Si no tiene playlists propias, se muestra: "No tienes playlists creadas. Crea al menos una en Spotify y vuelve."

---

### Pantalla 4 — Conectar destino

**Qué ve María:**
- Título: "Elige plataforma destino"
- Botón: "Connect Deezer"
- Texto informativo: "Tus playlists se copiarán a Deezer como playlists nuevas. No se borra nada de Spotify."
- Texto informativo: "TIDAL estará disponible próximamente"

**Qué hace María:**
- Pulsa "Connect Deezer"
- Se abre la pantalla de autorización oficial de Deezer
- Tras aceptar, vuelve a TuneHop

**Resultado:** Se abre la Pantalla 5.

**Regla de negocio:** Si Deezer ya tiene una playlist con el mismo nombre, se pregunta al usuario: "Ya tienes una playlist llamada 'X' en Deezer. ¿Qué quieres hacer?" con opciones: "Añadir canciones a la existente" / "Crear nueva playlist con otro nombre" / "Cancelar esta playlist".

---

### Pantalla 5 — Progreso de migración

**Qué ve María:**
- Título: "Migrando..."
- Nombre de la playlist actual: "Playlist 1/3: Road Trip Mix"
- Barra de progreso con contador: "18/24 canciones encontradas"
- Información de tanda: "Tanda 1 de 1" (si hay múltiples tandas de 50)
- Botón "Cancelar"

**Qué hace María:**
- Observa el progreso
- Puede pulsar "Cancelar" en cualquier momento

**Resultado al terminar:** Se abre la Pantalla 6.

**Resultado al cancelar:** Se muestra "Migración cancelada. Se completaron 1 de 3 playlists." con opción de volver a intentar o cerrar.

---

### Pantalla 6 — Resultado

**Qué ve María:**
- Título: "¡Migración completada!"
- Resumen por playlist:
  - ✅ "Road Trip Mix: 23/24 canciones"
  - ✅ "Chill Vibes: 18/18 canciones"
  - ✅ "Latin Party: 44/45 canciones"
- Contador: "1 canción no encontrada en Deezer"
- Enlace: "Ver detalle" (muestra el título y artista de la canción no encontrada)
- Botón: "Migrar más playlists" (vuelve a Pantalla 3)
- Botón: "Eliminar mis datos y cerrar"
- Botón: "Abrir Deezer" (abre la web de Deezer en nueva pestaña)

**Qué hace María:**
- Revisa el resumen
- Puede ver el detalle de no encontradas
- Puede migrar más playlists
- Puede cerrar y borrar datos
- Puede abrir Deezer para comprobar

---

## 4. DATOS

### Modelo de datos (en lenguaje natural)

**Usuario:**
- Email (de OAuth Spotify/Deezer, solo en sesión)
- Token de acceso de Spotify (solo en sesión)
- Token de actualización de Spotify (solo en sesión)
- Token de acceso de Deezer (solo en sesión)
- Token de actualización de Deezer (solo en sesión)

**Playlist de Spotify:**
- Nombre
- Descripción
- Nº de canciones
- Estado de migración: pendiente / en progreso / completada / parcial / fallida

**Canción:**
- Título
- Artista
- Álbum
- ISRC (código universal)
- Duración (en milisegundos)
- Estado de búsqueda: pendiente / encontrado / no encontrado
- Razón de no encontrado (si aplica: "ISRC no encontrado", "nombre no coincide")

**Migración:**
- Fecha y hora de inicio
- Fecha y hora de fin
- Total de playlists procesadas
- Total de canciones encontradas
- Total de canciones no encontradas
- Estado final: completada / cancelada / fallida
- Error concreto (si falla: "Error de la API de Deezer: rate limit alcanzado", "Token de Spotify caducado", etc.)

**Nota legal:** Todos estos datos se eliminan al cerrar la sesión o pulsar "Borrar mis datos". No persisten en el servidor. Solo se conservan logs anónimos de operación (sin datos personales).

---

## 5. REGLAS DE NEGOCIO

| # | Regla | Por qué |
|---|---|---|
| R1 | La app solo LEE de Spotify, nunca borra ni modifica playlists en Spotify | Regla de copia: siempre copiar, nunca mover ni borrar |
| R2 | Las playlists se COPIAN al destino como playlists nuevas, nunca se trasladan | El usuario mantiene todo en Spotify |
| R3 | ISRC es el identificador principal de búsqueda | Es el código universal de la grabación (el DNI de la canción). Garantiza coincidencia exacta |
| R4 | Si ISRC no existe, se busca por título + artista como fallback | No todas las plataformas tienen ISRC para todas las canciones |
| R5 | Si hay varias coincidencias por nombre, se elige la más probable por título + artista + duración | Minimiza errores en la selección automática |
| R6 | Las tandas de migración son de 50 playlists máximo | Respeta los rate limits de Spotify (~30 req/s) y Deezer (~50 req/s) |
| R7 | Se preserva el orden de las canciones de la playlist original | Algunos usuarios cuidan el orden (ej: listas de reproducción cronológicas) |
| R8 | Se copian las descripciones de las playlist | Completitud de la migración |
| R9 | Las playlists colaborativas se copian igual que las propias | No hay razón para excluir playlists que el usuario tiene guardadas |
| R10 | Si en Deezer ya existe una playlist con el mismo nombre, se pregunta al usuario | Evita duplicados no deseados |
| R11 | No se guardan datos personales después de la sesión | RGPD Art. 5.1.e (limitación del plazo de conservación) |
| R12 | El checkbox de consentimiento es obligatorio antes de conectar cuentas | RGPD Art. 7 (consentimiento) |
| R13 | El botón "Borrar mis datos" elimina todos los datos personales y cierra la sesión | RGPD Art. 17 (derecho de supresión) |
| R14 | El usuario recibe información clara sobre qué no se encontró y por qué | Criterio de éxito del Paso 1 |
| R15 | Los errores se muestran con el mensaje concreto del sistema | Transparencia y facilita el diagnóstico |

---

## 6. CASOS LÍMITE

| Situación | Qué pasa |
|---|---|
| Playlist vacía (0 canciones) | Se salta automáticamente. En el resumen se muestra: "Playlist vacía, nada que migrar" |
| Conexión a Spotify cae a mitad de migración | Se pausa. Se muestra: "Sesión de Spotify caducada. Reconéctate." Botón para reconectar y continuar desde donde se quedó |
| Token de Deezer caduca a mitad de migración | Mismo comportamiento: pausa, aviso, reconexión |
| La playlist destino ya existe en Deezer | Se pregunta al usuario: "¿Añadir a la existente, crear nueva con otro nombre, o cancelar?" |
| Toda la migración falla | Se muestra el error concreto: "Error: [mensaje del sistema]. Inténtalo más tarde." Se eliminan los datos de la sesión |
| El usuario cierra el navegador a mitad de migración | La migración se cancela. Al volver, puede empezar de nuevo. No hay estado persistente |
| Rate limit de la API (demasiadas peticiones) | Se espera 1 segundo y se reintenta. Si persiste tras 3 reintentos, se pausa y se informa al usuario con el error concreto |
| Canción no encontrada ni por ISRC ni por nombre | Se registra como "no encontrada" con la razón ("ISRC no encontrado" o "nombre no coincide") y se muestra en el resumen final |
| El usuario tiene más de 50 playlists seleccionadas | Se procesan en tandas de 50. Se muestra "Tanda 1 de N" en la pantalla de progreso |
| La API de Spotify o Deezer está caída | Se muestra: "Servicio temporalmente no disponible. Inténtalo más tarde." No se inicia la migración |

---

## 7. REQUISITOS NO FUNCIONALES

### Privacidad (RGPD)

| Requisito | Cómo se cumple |
|---|---|
| Consentimiento (Art. 7) | Checkbox obligatorio antes de conectar cuentas |
| Información (Art. 13) | Política de Privacidad accesible desde la landing |
| Minimización (Art. 5.1.c) | Solo se procesan datos estrictos para la migración |
| Limitación del plazo (Art. 5.1.e) | Datos eliminados al cerrar sesión o pulsar "Borrar mis datos" |
| Derecho de supresión (Art. 17) | Botón "Eliminar mis datos y cerrar" en la pantalla de resultado |
| Seguridad (Art. 32) | HTTPS en todo el tráfico. Tokens nunca en texto plano |
| Incidentes (Art. 33) | Logs anónimos de operación para detectar y diagnosticar fallos |

### Accesibilidad

| Requisito | Nivel |
|---|---|
| WCAG 2.1 | Nivel AA |
| Contraste de texto | Mínimo 4.5:1 |
| Navegación por teclado | Todas las pantallas navegables con Tab y Enter |
| Lectores de pantalla | Textos alternativos en imágenes, etiquetas semánticas, roles ARIA |
| Tamaño de texto | Escalable sin romper el diseño |

### Idiomas

**Idiomas oficiales de la UE (24):**
Alemán, búlgaro, checo, danés, eslovaco, esloveno, español, estonio, finlandés, francés, griego, húngaro, irlandés, italiano, letón, lituano, maltés, neerlandés, polaco, portugués, rumano, sueco, croata, macedonio.

**Lenguas regionales/minoritarias europeas:**
Euskera, catalán, gallego, asturiano, aragonés, valenciano, bretón, corso, frisón, gaélico escocés, galés, occitano, sardo, siciliano, silesio, asturleonés, aromunio, catalán valenciano, lucemburgués.

### Dispositivos

| Tipo | Soporte |
|---|---|
| Escritorio | ✅ Completo |
| Tablet | ✅ Responsive |
| Móvil | ✅ Responsive |

### Tiempos de respuesta

| Acción | Tiempo máximo |
|---|---|
| Cargar la landing | 2 segundos |
| Cargar lista de playlists | 3 segundos |
| Completar una tanda de 50 playlists | 60 segundos (depende de las APIs) |

### Tandas de migración

- Máximo 50 playlists por tanda
- Pausa de 1 segundo entre tandas para respetar rate limits
- Si una tanda falla, se muestra el error concreto y se detiene

---

## 8. FUERA DE ALCANCE (MVP)

- Migración de álbumes, artistas y Liked Songs (v2)
- TIDAL como destino (v2)
- Selección manual de alternativas para no encontradas (v2)
- Instrucciones para eliminar cuenta de Spotify (v2)
- Comparativas rotativas de por qué otras plataformas son mejores (v2)
- Migración inversa (otras plataformas → Spotify)
- Funcionalidades sociales (compartir, seguir)
- Reproductor de música
- App móvil nativa
- Pagos o monetización
- Cuentas de usuario (no hay registro, todo es anónimo por sesión)

---

## 9. PREGUNTAS ABIERTAS

**Ninguna.** Todas las preguntas fueron respondidas en la fase de planificación. La spec está cerrada.

---

*Documento generado en el Paso 5 del método de 20 pasos.*
*Siguiente paso: Paso 6 — Plan técnico (elegir stack).*
*Recordatorio: Invocar /bitácora para registrar las decisiones de esta fase.*
