# Decisión técnica — Modelo de acceso: un motor, varias puertas

**Fecha**: 24/09/2026
**Estado**: ✅ VERIFICADO — fuentes oficiales consultadas el mismo día.
**Decisión**: TuneHop se entrega como **un único motor de migración** con varias **puertas de entrada**. La puerta pública principal es la de **archivo** (no usa la API de Spotify).

---

## 1. El hallazgo que cambia el plan: la puerta de Spotify

La Web API de Spotify tiene dos modos de cuota:

| Modo | Usuarios | Requisitos |
|---|---|---|
| **Desarrollo** (donde está la app hoy) | Máx. **5** usuarios autenticados en *allowlist* | La persona dueña de la app necesita Spotify Premium |
| **Cuota extendida** | Ilimitados + mayor rate limit | Solicitud y revisión |

Requisitos de la **cuota extendida** (verificados en la documentación oficial):

- Desde el **15/05/2025**, Spotify solo acepta solicitudes de **organizaciones**, no de personas individuales.
- Entidad legalmente registrada.
- Servicio **ya lanzado y activo**.
- Mínimo **250.000 usuarios activos al mes (MAU)**.
- Presencia en mercados clave, viabilidad comercial y adherencia a los términos.
- Revisión de hasta **6 semanas**.

**Consecuencia**: una app pública única con un Client ID propio **no es viable para una persona**. Es un círculo cerrado: para publicar necesitas usuarios, y para tener usuarios necesitas publicar.

> **Nota de auditoría**: este límite **no estaba documentado** en el proyecto. Grep sobre `docs/`, `research/` y `seguridad/` el 24/09/2026: 0 menciones a «5 usuarios», «cuota», «allowlist» o «modo desarrollo». El plan original suponía acceso público que no existe.

### Dos matices que sí nos favorecen

- **Client Credentials** (autenticación servidor-a-servidor, sin login de usuario): **no consume plazas** de los 5, pero solo accede a datos **públicos** (no vale para playlists privadas).
- **PKCE**: Spotify lo recomienda justo cuando el secret no se puede guardar → TuneHop puede operar **sin `*_SECRET`**, simplificando el setup.

### Lo que NO es el problema

- **TIDAL**: API v2 pública de escritura. Las credenciales del proyecto ya funcionan. ✅
- **Deezer**: registro de apps nuevas cerrado. ❌ (ya documentado en `docs/plataformas-alternativas.md`)

---

## 2. El patrón: un motor, varias puertas

El motor es siempre el mismo:

> **recibir una lista de canciones → resolver (ISRC + fallback) → escribir en TIDAL**

Lo único que cambia entre puertas es **por dónde entra la lista**:

| Puerta | Entrada | ¿Usa API de Spotify? | Estado |
|---|---|---|---|
| **1. Beta cerrada** | Login Spotify (5 personas) | Sí (modo desarrollo) | Ya existe |
| **2. Autoalojado (BYO app)** | Login Spotify, con la app propia de cada persona | Sí (la de cada cual) | Pendiente |
| **3. App de escritorio** | = puerta 2 empaquetada | Sí | Descartada por ahora |
| **4. Archivo** ⭐ | Subida de CSV/JSON exportado | **No** | **Pendiente (prioridad)** |
| **5. Playlist pública** | Enlace público (`Client Credentials`) | Sí (sin login) | Pendiente |
| **6. Open source autoalojado** | = puerta 2 + guía de despliegue | Sí | Pendiente |

**Regla de oro**: una sola cocina, varias puertas. No construir cuatro productos.

---

## 3. Acompañamiento por puerta (dónde vive la guía)

La **guía de acompañamiento para personas no técnicas** pertenece a las puertas **2 y 6**, porque ahí hay que crear apps en paneles ajenos y editar configuración.

- Puerta **4**: **no necesita guía**. Exportar → subir → conectar TIDAL. Cero tecnicismo, cero claves, cero terminal.
- Puerta **5**: tampoco. Solo pegar un enlace.
- Puertas **2/6**: aquí vive el asistente `/setup` + README detallado.

> Si se pide una guía para la puerta 4, se está resolviendo un problema que esa puerta no tiene.

---

## 4. Plan de la puerta 4 (archivo)

### Entradas admitidas

| Vía | Formato | ¿Trae ISRC? | Notas |
|---|---|---|---|
| **Exportify** (recomendada) | CSV UTF-8 | **Sí**, por defecto | MIT, activo (último commit 2026-07-22, 4.231 ★) |
| **«Descargar tus datos» oficial** (respaldo) | JSON (ZIP) | No | Depende del emparejamiento por nombre/artista |

El CSV de Exportify incluye: `Track URI`, `Track Name`, `Artist Name(s)`, `Album Name`, `Track Duration (ms)`, **`ISRC`**, entre otros. Al traer ISRC, **el motor de coincidencia actual se reutiliza sin degradarse**.

### Trabajo concreto

1. **Parser CSV** robusto (UTF-8 con/sin BOM, separador, comillas).
2. **Mapeo de columnas** → estructura interna de pista (isrc, name, artists, album, duration).
3. **Reutilizar** las rutas existentes de resolución y escritura (`/api/tidal/search*`, `/api/tidal/create-playlist`, `/api/tidal/add-tracks`).
4. **UI de subida** con previsualización y validación antes de migrar.
5. **Fallback** por nombre/artista cuando falte ISRC (formato oficial).

### Riesgos y mitigación

- El formato de Exportify cambia → parser tolerante y mapeo por nombre de cabecera.
- Exportify deja de funcionar → plan B oficial (JSON, sin ISRC).
- Datos sucios (Excel, codificaciones) → validación + informe de filas descartadas.

---

## 5. Orden de construcción

1. **Motor** — ya existe.
2. **Puerta 4** — la más simple; desbloquea el uso público hoy.
3. **Puerta 5** — Client Credentials, barata.
4. **Puerta 2** — login Spotify propio + guía `/setup`.
5. **Puerta 6** — documentación de autoalojamiento.

Cada puerta se prueba por separado y no toca el motor.

---

## 6. Lo que NO se hará

- **Copiar el Client ID público de Exportify**: funciona porque Spotify les aprobó cuota extendida; depender de su cuota ajena es frágil e inseguro.
- **App de escritorio** (firma, antivirus, mantenimiento) sin tracción demostrada.
- **Secretos en git**: los tokens y claves viven en `.env.local` (ignorado) o en variables de Vercel.

---

## Fuentes (consultadas el 24/09/2026)

- Spotify for Developers — *Quota modes*: `https://developer.spotify.com/documentation/web-api/concepts/quota-modes`
- Spotify for Developers — *Client Credentials flow*: `https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow`
- Spotify for Developers — *Authorization Code with PKCE*: `https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow`
- Spotify Developer Policy (vigente desde 15/05/2025): `https://developer.spotify.com/policy`
- Exportify (repo MIT): `https://github.com/watsonbox/exportify`
- Spotify — *Download your data*: `https://support.spotify.com/us/article/data-rights-and-privacy-settings/`
