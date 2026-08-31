# Paso 3 — Documento Legal (AI Act + RGPD)

**Fecha**: 31/08/2026
**Estado**: ✅ Verificado con la alumna
**Proyecto**: PlayMigrate — Migra tus playlists de Spotify a plataformas éticas

---

## 1. QUÉ HACE ESTE SISTEMA EN TÉRMINOS LEGALES

### Finalidad
PlayMigrate es una herramienta que permite a un usuario copiar sus playlists, álbumes guardados, artistas seguidos y canciones guardadas de Spotify a otra plataforma musical (Deezer o TIDAL).

### Datos personales que tratamos

| Dato | Origen | Para qué lo usamos | Cuánto se guarda |
|---|---|---|---|
| Email del usuario | OAuth Spotify/Deezer | Identificar al usuario, mostrar "Hola, María" | Sesión únicamente |
| Token de acceso (access_token) | OAuth | Hacer peticiones a la API de Spotify/Deezer | Sesión únicamente |
| Token de actualización (refresh_token) | OAuth | Mantener la sesión viva | Sesión únicamente |
| Nombre de playlist | API de Spotify | Mostrar lista de playlists, migrarlas al destino | Sesión únicamente |
| Canciones (título, artista, álbum, ISRC) | API de Spotify | Buscar y copiar canciones a la plataforma destino | Sesión únicamente |

### Datos que NO tratamos
- Contraseñas (nunca las vemos; el OAuth las maneja)
- Datos de pago
- Ubicación GPS
- Datos biométricos
- Historial de escucha (solo playlists, no qué escucha ni cuándo)
- Contenido de audio (no reproducimos ni descargamos música)

### Quién responde (responsable del tratamiento)
Tú, la desarrolladora del proyecto. PlayMigrate no tiene empresa propia; eres tú quien controla los datos. Si algún día constituyes una empresa, el responsable pasa a ser esa entidad.

### A quién afecta
Cualquier persona con cuenta de Spotify que use la app para migrar sus playlists.

---

## 2. CLASIFICACIÓN AI ACT

### Veredicto: RIESGO MÍNIMO

**Por qué no es alto riesgo:**
- PlayMigrate NO es un sistema de inteligencia artificial.
- No usa LLMs, no genera contenido, no recomienda, no profiling.
- Es una app **determinista**: OAuth → leer playlists → buscar por ISRC (código exacto) → crear playlist en destino.
- La "búsqueda" es coincidencia técnica (ISRC = DNI de la canción), no análisis inteligente.

**Analogía**: Es como un traductor automático de una sola palabra: busca el código y lo copia. No "piensa", no "interpreta", no "decide".

**Clasificación AI Act**: Riesgo mínimo (Art. 6). No hay obligaciones específicas del AI Act.

### NOTA IMPORTANTE
Si en el futuro se añade:
- Recomendación de playlists basada en gustos → **riesgo limitado** (transparencia)
- Perfilado del usuario → **alto riesgo** (Anexo III)
- Generación de descripciones con IA → **riesgo limitado** (transparencia)

**Esto NO está en el MVP. Si se añade, hay que re-evaluar.**

---

## 3. OBLIGACIONES RGPD CONVERTIDAS EN REQUISITOS VERIFICABLES

### Base legal: Interés legítimo (Art. 6.1.f RGPD)
Procesamos los datos estrictamente necesarios para provide el servicio que el usuario nos pide (migrar playlists). Sin fines comerciales, sin profiling, sin cesión a terceros.

**Justificación del interés legítimo:**
- El usuario nos pide expresamente que migre sus datos de un servicio a otro.
- No hay alternativa menos intrusiva: necesitamos los tokens para acceder a las APIs y los nombres de playlist para migrarlas.
- El impacto en el usuario es mínimo: no guardamos datos, no los analizamos, no los compartimos.

### Requisitos verificables

| Obligación RGPD | Requisito verificable | Estado |
|---|---|---|
| **Información (Art. 13)** | La app muestra un aviso claro de qué datos trata antes de que el usuario conecte su cuenta | Pendiente |
| **Consentimiento (Art. 7)** | El usuario acepta la política de privacidad antes de conectar Spotify/Deezer | Pendiente |
| **Minimización (Art. 5.1.c)** | Solo se almacenan los datos estrictamente necesarios para la migración. No se guardan datos después de la sesión | Pendiente |
| **Limitación del plazo (Art. 5.1.e)** | Los tokens y datos se eliminan al cerrar la sesión o al completar la migración | Pendiente |
| **Derecho de supresión (Art. 17)** | El usuario puede eliminar todos sus datos en cualquier momento (botón "Borrar mis datos") | Pendiente |
| **Derecho de acceso (Art. 15)** | El usuario puede ver qué datos tiene la app sobre él (mostrar datos procesados) | Pendiente |
| **Seguridad (Art. 32)** | Los tokens se transmiten por HTTPS, nunca se almacenan en texto plano | Pendiente |
| **Transferencia internacional (Art. 44-49)** | Los datos se procesan en servidores de la UE (Vercel/Railway tienen centros en EU) | Pendiente |

---

## 4. CHECKLIST LEGAL

### Obligatorias para el lanzamiento (MVP)

- [ ] **Política de privacidad** — Documento que explica qué datos tratamos, para qué, y cuánto se guardan. Debe estar accesible desde la app antes de conectar cuentas.
- [ ] **Aviso de consentimiento** — Pantalla que aparece ANTES de conectar Spotify, con checkbox: "He leído la política de privacidad y acepto que PlayMigrate procese mis datos de Spotify para migrar mis playlists."
- [ ] **Botón "Borrar mis datos"** — Funcionalidad que elimina todos los tokens y datos procesados del servidor. Debe estar visible en la app.
- [ ] **HTTPS obligatorio** — Todo el tráfico entre el usuario y el servidor debe ser cifrado (Vercel y Railway lo hacen por defecto).
- [ ] **No guardar datos después de la sesión** — Los tokens y datos de playlist se eliminan al cerrar la sesión o al completar la migración.

### Recomendadas (no bloqueantes para el MVP)

- [ ] **Aviso sobre títulos de playlist** — Texto informativo: "Las playlists pueden contener datos personales (nombres propios, situaciones personales). PlayMigrate no analiza ni almacena estos títulos más allá de la migración."
- [ ] **Registro de incidentes** — Si hay una brecha de seguridad, documentar qué pasó, qué datos se vieron afectados, y notificar a la autoridad de control en 72 horas (Art. 33 RGPD).

---

## 5. FUERA DE ALCANCE

Este documento NO cubre:
- Condiciones de uso de Spotify/Deezer/TIDAL (cada plataforma tiene sus propios ToS que debemos respetar)
- Propiedad intelectual de la música (los derechos de autor los gestiona la plataforma, no nosotros)
- Aspectos fiscales o mercantiles (si el proyecto genera ingresos en el futuro)
- Cumplimiento de normativas fuera de la UE (CCPA en California, etc.)

---

## RESUMEN PARA LA ALUMNA

**PlayMigrate es riesgo mínimo bajo el AI Act** (no hay IA). Bajo el RGPD, tenemos obligaciones porque tratamos datos personales (email, tokens, nombres de playlist) de usuarios en la UE.

**Lo que DEBES tener para el lanzamiento:**
1. Política de privacidad
2. Checkbox de consentimiento antes de conectar cuentas
3. Botón "Borrar mis datos"
4. HTTPS (ya lo tenemos con Vercel/Railway)
5. No guardar datos después de la sesión

**Lo que NO necesitas:**
- Evaluar impacto DPIA (no es alto riesgo)
- Designar un DPO (no es obligatorio para este tamaño)
- Registro de tratamientos (recomendable, no obligatorio)

---

*Documento generado en el Paso 4 del método de 20 pasos.*
*Siguiente paso: Paso 5 — Especificación funcional (spec).*
