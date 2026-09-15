# Glosario

Términos técnicos que aparecen en el proyecto, en orden alfabético. Cada entrada tiene definición breve + analogía cotidiana + ejemplo real.

---

### Access tier
Nivel de permiso que una API te da al registrarte como desarrollador. Es como las categorías de cliente en un banco: cliente normal, VIP, banca privada.
**Ejemplo real**: TIDAL tiene tiers THIRD_PARTY (público), PARTNER y INTERNAL. Nosotros somos THIRD_PARTY y eso nos da acceso a playlists, pero no a todo el catálogo.

### AI Act
Reglamento Europeo de Inteligencia Artificial. Clasifica los sistemas de IA en 4 niveles de riesgo (prohibido, alto, limitado, mínimo) y asigna obligaciones según el nivel.
**Ejemplo real**: TuneHop es riesgo mínimo porque no usa IA, solo OAuth y búsqueda por código.

### Arquitectura de marca
La estructura que organiza cómo se relacionan la marca principal con sus productos, sub-marcas o líneas de negocio. Es como el árbol genealógico de una familia: ves quién es el abuelo, los hijos, los nietos y si todos usan el mismo apellido.
**Ejemplo real**: TuneHop tiene arquitectura de marca única (un solo producto, un solo nombre); si mañana saca "TuneHop Analytics" para artistas, sería marca madre con sub-marcas.

### Batch / Tanda
Procesar elementos en grupos pequeños en vez de todos a la vez. Es como ir al supermercado: llevas 20 cosas en vez de 200 de golpe.
**Ejemplo real**: Migrar 50 playlists por tanda para no saturar las APIs de Spotify y Deezer.

### Brand book (Manual de marca)
Documento único que consolida toda la identidad de una marca (verbal, visual, legal, usos) para que cualquiera la aplique coherente sin reinventarla. Es como la partitura de una orquesta: cada músico lee lo mismo y suena junto.
**Ejemplo real**: docs/marketing/08-manual-marca.md de TuneHop — resume posicionamiento, tono, mensajes, logo, color, tipografía, estado legal, usos correctos/incorrectos, checklist y tokens JSON.

### Briefing
Documento breve con el encargo y el contexto de negocio antes de crear nada. Es como la nota que deja el chef al equipo de cocina antes del servicio: qué plato, para quién, con qué recursos.
**Ejemplo real**: docs/marketing/00-briefing.md — qué es TuneHop, quién está detrás, con qué presupuesto y qué significa éxito.

### Casa de marcas
Modelo donde cada producto tiene su propia marca independiente, sin vínculo visible con la empresa madre (ej. Procter & Gamble: Ariel, Pampers, Gillette no llevan el nombre "P&G" en el envase). Es como una familia donde cada hijo tiene un apellido distinto y nadie sabe que son hermanos.
**Ejemplo real**: No aplica a TuneHop; sería el caso si la fundadora vendiera la app a un tercero y este la operara bajo otro nombre.

### Checklist de coherencia
Lista de verificación rápida (sí/no) para revisar cualquier pieza de comunicación antes de publicarla. Es como la lista de pre-vuelo de un piloto: no confías en la memoria, marcas cada punto.
**Ejemplo real**: El manual de TuneHop incluye checklist de 4 bloques (visual, verbal, legal/técnico, calidad) — se usa antes de lanzar un post, un email, una landing, un ticket de soporte.

### Claim regulado
Afirmación publicitaria que la ley somete a requisitos especiales de prueba, veracidad o formulación (publicidad comparativa, superlativos, salud, finanzas, sostenibilidad, privacidad). Es como un medicamento: no basta con que funcione, hay que demostrarlo con el protocolo que exige la autoridad.
**Ejemplo real**: "TIDAL paga ~3-7x más por stream que Spotify" es claim comparativo cuantitativo (Ley 3/1991 Art. 10); "la plataforma que paga mejor" es superlativo absoluto (Autocontrol); "privacidad radical / borrado real" es claim de RGPD (Arts. 5, 17, 25).

### Clases de Niza
Sistema internacional (Arreglo de Niza) que agrupa productos y servicios en 45 clases para el registro de marcas. Es como los pasillos de un supermercado: cada marca se registra en el pasillo (clase) donde vende.
**Ejemplo real**: TuneHop debería registrar en Clase 9 (software/apps), 38 (streaming/telecom), 41 (entretenimiento/música), 42 (SaaS/desarrollo).

### Consent screen / Pantalla de autorización
Pantalla oficial de Spotify/Deezer donde el usuario ve qué permisos pide tu app y decide si acepta o no.
**Ejemplo real**: Cuando pulsa "Conectar con Spotify" y aparece la pantalla de Spotify que dice "TuneHop quiere acceder a tus playlists".

### Consentimiento (RGPD)
Permiso explícito que el usuario da antes de que proceses sus datos personales. Debe ser libre, informado, específico e inequívoco.
**Ejemplo real**: El checkbox obligatorio de TuneHop antes de conectar Spotify: "He leído la Política de Privacidad y acepto que procese mis datos."

### Cookie
Pequeño archivo que un sitio web guarda en tu navegador para recordarte. Es como una pulsera de hospital con tu número: la llevas puesta mientras estás en el sitio.
**Ejemplo real**: No

### Crear playlist (API)
Operación de la API de una plataforma musical para generar una playlist nueva en la cuenta del usuario.
**Ejemplo real**: TuneHop usa POST /playlists en la API de TIDAL v2 para crear la playlist destino vacía antes de añadir las canciones encontradas.

### create-next-app
Herramienta oficial de Next.js que genera la estructura inicial de un proyecto (carpetas, package.json, config, plantillas).
**Ejemplo real**: `npx create-next-app@latest Spotify --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` creó el esqueleto de TuneHop.

### CTA (Call To Action / Llamada a la acción)
Elemento que pide al visitante hacer algo concreto (botón, enlace, formulario). Es como el portero de una discoteca: la gente solo entra si la invitación es clara.
**Ejemplo real**: El botón "Conectar con Spotify" de la home de TuneHop es la CTA principal; hasta hoy estaba en inglés ("Connect Spotify") y se corrigió por coherencia de marca.

### CTA (Call To Action / Llamada a la acción)
Elemento que pide al visitante hacer algo concreto (botón, enlace, formulario). Es como el portero de una discoteca: la gente solo entra si la invitación es clara.
**Ejemplo real**: El botón "Conectar con Spotify" de la home de TuneHop es la CTA principal; hasta hoy estaba en inglés ("Connect Spotify") y se corrigió por coherencia de marca.

### Deezer
Plataforma de streaming musical con API pública REST. Fue el destino original del MVP de TuneHop; se cambió a TIDAL porque Deezer cerró el registro de nuevas apps en 2024.
**Ejemplo real**: En la bitácora (2026-09-03) se registró el cambio: "El destino de escritura pasa de Deezer a TIDAL: Deezer cerró el registro de nuevas apps".

### Derecho de supresión (RGPD)
Derecho del interesado a obtener la supresión de sus datos personales sin dilación indebida (Art. 17 RGPD). Es como pedir que te borren del registro de un gimnasio al darte de baja: deben hacerlo.
**Ejemplo real**: El botón "Eliminar datos y cerrar" de TuneHop ejecuta el derecho de supresión: borra cookies, sessionStorage y cualquier rastro de la sesión.

### Design tokens
Valores de diseño (color, tipografía, espaciado, radio, motion) codificados como pares nombre-valor, independientes de plataforma. Es como la receta de un plato: da igual la cocina (web, iOS, Android), los ingredientes y proporciones son los mismos.
**Ejemplo real**: TuneHop define `--color-accent: #00E5A0`, `--font-primary: Space Grotesk`, `--spacing-base: 4px` en un JSON que la skill `frontend` consume para generar CSS, Tailwind config, y componentes React coherentes.

### Distintividad (marca)
Capacidad de una marca para identificar el origen empresarial de un producto/servicio y distinguirlo de los demás. Escala: genérica (no registrable) → descriptiva (difícil) → sugerente (registrable) → arbitraria/fantástica (fuerte).
**Ejemplo real**: "TuneHop" es sugerente (evoca música + salto, no describe la función literal) → registrable si no hay colisión. "Playlist Migrator" sería descriptiva → difícil de registrar.

### DPIA (Data Protection Impact Assessment)
Evaluación de impacto en la protección de datos: análisis obligatorio bajo RGPD cuando el tratamiento puede entrañar alto riesgo para derechos y libertades.
**Ejemplo real**: TuneHop no requiere DPIA (solo lectura OAuth, datos en sesión, sin profiling), pero el análisis se documenta en docs/03-legal.md.

### Fallback
Plan B automático cuando la vía principal falla. Es como llevar llave de repuesto: si la principal no abre, usas la otra sin parar el viaje.
**Ejemplo real**: Si no se encuentra la canción por ISRC, TuneHop hace fallback buscando por nombre + artista en varios países (US, ES, GB, MX, DE).

### Fase A (Cimientos de marca)
Primera fase del método de marketing (22 pasos): Pasos 1-9 (Briefing → Auditoría → Investigación → Arquitectura → Estrategia → Identidad verbal → Identidad visual → Protección legal → Manual de marca). Define QUIÉN es la marca ANTES de decidir QUÉ decir y DÓNDE.
**Ejemplo real**: TuneHop completó la Fase A el 2026-09-11; el brand book (Paso 9) la cierra. Fase B (La idea y su validación) empieza con Paso 10.

### GDPR / RGPD
Reglamento General de Protección de Datos (UE 2016/679). Marco legal que regula cómo se tratan los datos personales en la UE.
**Ejemplo real**: TuneHop cumple RGPD: consentimiento previo (checkbox), minimización (solo lectura playlists), supresión real (botón borrar datos), transparencia (política de privacidad).

### Glifo
Símbolo gráfico que representa una marca, a menudo extraído o derivado de una letra del logotipo. Es como la inicial iluminada de un manuscrito: nace de la letra, pero vive solo como señal.
**Ejemplo real**: El glifo de TuneHop nace de la pierna derecha de la 'h' de "hop": se alarga, curva y aterriza en un punto preciso (el salto). Funciona solo como favicon/app icon.

### Hipótesis sin verificar
Afirmación que se usa como base de trabajo pero no tiene fuente primaria confirmada en la sesión actual. Es como cocinar con la sal que *crees* que hay en el bote: funcionará, pero mejor verificar antes de servir.
**Ejemplo real**: En la investigación, "TuneMyMusic freemium con límite" está marcado como hipótesis porque su página de precios dio 404.

### HTTP vs. HTTPS
HTTP envía datos en claro; HTTPS los cifra (TLS). Es como enviar una postal (HTTP) vs. una carta cerrada con lacre (HTTPS): cualquiera lee la postal; la carta solo la abre el destinatario.
**Ejemplo real**: Todo el tráfico de TuneHop (Vercel) es HTTPS obligatorio; los callbacks de OAuth exigen HTTPS en producción.

### Identidad visual
El conjunto de elementos que hacen reconocible una marca a la vista: logo, colores, tipografía, iconos. Es como el uniforme de un equipo: sin él no sabes quién juega.
**Ejemplo real**: TuneHop hoy no tiene identidad visual propia (favicon y tipografía de plantilla de Next.js); se construirá en el Paso 7 de marketing.

### Insight
La tensión o deseo profundo que explica por qué alguien actúa como actúa, más allá de lo que dice o de sus datos demográficos. Es como saber que alguien bebe café no por el sabor, sino porque necesita el ritual para arrancar el día.
**Ejemplo real**: La Switcher Ética (María) *dice* que quiere irse de Spotify, pero su insight es: "No estoy dispuesta a perder horas ni a pagar una suscripción solo para irme". El insight revela el bloqueo real.

### ISRC (International Standard Recording Code)
Código único e internacional que identifica una grabación sonora concreta (no la obra, la grabación). Es como el ISBN de un libro, pero para cada versión grabada de una canción.
**Ejemplo real**: TuneHop busca canciones en TIDAL por ISRC (multi-país: US, ES, GB, MX, DE) para encontrar la grabación exacta que el usuario tiene en Spotify.

### Layout raíz (layout.tsx)
Archivo de Next.js App Router que define la estructura HTML común a toda la app (<html>, <head>, <body>, fuentes, metadata global).
**Ejemplo real**: src/app/layout.tsx de TuneHop define metadata, fuentes Geist, y el providers wrapper para next-intl.

### Liked Songs / Canciones guardadas
Biblioteca personal de tracks guardados por el usuario en Spotify (corazón). No es una playlist, pero se comporta como una en la API.
**Ejemplo real**: TuneHop no migra "Liked Songs" en el MVP (solo playlists creadas por el usuario); está documentado como fuera de alcance en docs/02-mvp.md.

### Likelihood of confusion (riesgo de confusión)
Estándar legal para denegar una marca: si el consumidor medio puede creer que dos marcas vienen de la misma empresa (por similitud visual, fonética, conceptual + proximidad de productos/servicios). Es como dos gemelos vestidos igual en la misma fiesta: la gente confunde quién es quién.
**Ejemplo real**: "TuneHop" vs "SongShift" — fonética distinta, conceptual distinta (hop vs shift), misma clase → riesgo bajo. Pero lo decide un abogado con búsqueda de similitud profesional.

### Mapa de competencia
Tabla o representación visual de quiénes compiten en tu categoría, qué venden, con qué tono y a qué precio. Es como el plano de un centro comercial: ves qué tienda hay en cada esquina y dónde queda el hueco vacío.
**Ejemplo real**: En la investigación de TuneHop, el mapa compara Soundiiz, TuneMyMusic, FreeYourMusic, SongShift y MusConv en propuesta, tono y modelo de precio.

### Marca madre con sub-marcas
Modelo donde una marca principal respalda a productos con nombre propio pero vinculado (ej. "Google Maps", "Google Drive", "YouTube by Google"). Es como una madre que presenta a sus hijos: "Este es mi hijo Pablo, esta es mi hija Ana".
**Ejemplo real**: Si TuneHop lanza "TuneHop Sync" y "TuneHop Export", pasaría a marca madre con sub-marcas.

### Marca única
Modelo de arquitectura donde un solo nombre cubre todo el negocio. Es como una tienda que solo vende una cosa y se llama igual que la cosa.
**Ejemplo real**: TuneHop hoy es marca única: el negocio, la web, la app y el producto se llaman TuneHop.

### Minimización (RGPD)
Principio de RGPD: solo recoger y tratar los datos estrictamente necesarios para el fin declarado. Es como llevar a la playa solo la toalla y el protector: lo justo, nada de "por si acaso".
**Ejemplo real**: TuneHop solo lee playlists (scope playlist-read-private), no pide perfil, email, ni biblioteca completa.

### Monolineal
Estilo de iconografía o letra donde todos los trazos tienen el mismo grosor (una sola línea). Es como dibujar con un rotulador de punta fina sin variar la presión: limpio, técnico, escalable.
**Ejemplo real**: La iconografía de TuneHop es monolineal 2px, esquinas 2px, óptico 20x20px. Coherente en todo el sistema, sin rellenos ni duotono.

### MVP (Minimum Viable Product)
Versión mínima de un producto que entrega valor real a usuarios reales y permite aprender. No es "incompleto", es "lo mínimo que sirve".
**Ejemplo real**: TuneHop MVP = migrar playlists Spotify → TIDAL via ISRC con revisión manual, sin sync, sin multi-destino, sin cuentas de usuario propias.

### npm ci
Instalación limpia y reproducible de dependencias usando package-lock.json (ignora package.json). Es como seguir la receta exacta con pesadas, no "a ojo".
**Ejemplo real**: CI de GitHub Actions usa `npm ci` para que el build sea idéntico al local.

### OAuth 2.0
Protocolo de autorización que permite a una app acceder a recursos de un usuario en otra plataforma sin ver su contraseña. Es como un vale de hotel: la recepción (Spotify) te da una llave (token) que abre solo tu habitación (playlists), no la master key.
**Ejemplo real**: TuneHop usa OAuth 2.0 con PKCE para Spotify (Authorization Code + PKCE) y Authorization Code para TIDAL v2.

### Oportunidad (marketing)
La frase que resume el hueco que una marca puede ocupar, cruzando audiencia + competencia + cultura + auditoría interna. Es como encontrar el único sitio en la playa donde no hay sombrillas y el sol da perfecto.
**Ejemplo real**: "TuneHop es la migración con criterio: la forma más simple y privada de irte de Spotify a la plataforma que paga mejor a los artistas, sin tocar tu Spotify y sin guardar nada de ti."

### package-lock.json
Archivo generado automáticamente que fija las versiones exactas de todas las dependencias (incluidas sub-dependencias). Garantiza instalaciones idénticas en cualquier máquina.
**Ejemplo real**: El package-lock.json de TuneHop asegura que el build en Vercel use exactamente los mismos paquetes que en local.

### PESTEL
Análisis de los factores externos que afectan a un negocio: Político, Económico, Social, Tecnológico, Ecológico y Legal. Es como revisar el parte meteorológico antes de una excursión: no lo controlas, pero decides con él.
**Ejemplo real**: Para TuneHop, el factor Social es la conciencia creciente sobre el pago a artistas; el Legal, el RGPD y los términos de uso de las APIs de Spotify y TIDAL.

### PKCE (Proof Key for Code Exchange)
Extensión de OAuth 2.0 que previene ataques de interceptación del código de autorización en apps públicas (SPAs, móviles). Es como un código secreto que solo el que inició el baile conoce, para que nadie más pueda cambiar de pareja.
**Ejemplo real**: TuneHop usa PKCE en el flujo Spotify: genera un code_verifier aleatorio, manda su hash (code_challenge) al autorizar, y lo verifica al canjear el código por tokens.

### Posicionamiento (Ries & Trout)
Frase estructurada que define el lugar que una marca ocupa en la mente del cliente frente a la competencia. Fórmula: "Para [audiencia], [marca] es la [categoría] que [diferencial], porque [razón para creer]". Es como la frase que dirías al presentar a alguien en una fiesta para que lo recuerden.
**Ejemplo real**: "Para la Switcher Ética, TuneHop es la herramienta de migración que te deja irte a la plataforma que paga mejor a los artistas en minutos, sin tocar tu Spotify y sin guardar nada, porque usa ISRC universal, procesa en sesión y borra al cerrar."

### Propuesta de valor única (UVP)
Lo que ofrece una marca que nadie más ofrece igual — la combinación irrepetible de beneficios. Es como el plato firma de un restaurante: otros pueden tener los mismos ingredientes, pero la receta completa es única.
**Ejemplo real**: TuneHop = (simple para no técnicos) + (destino ético explícito TIDAL) + (privacidad radical) + (dirección única Spotify→TIDAL) + (posicionamiento neutro). Nadie combina las 5.

### Público objetivo
El grupo concreto de personas a las que se dirige un producto o campaña. Es como decidir a quién invitas a la fiesta: si invitas a todos, la música no gusta a nadie.
**Ejemplo real**: La hipótesis inicial de TuneHop es María, 32 años, diseñadora freelance no técnica, con cientos de playlists en Spotify y ganas de apoyar plataformas que paguen mejor a los artistas.

### Rate limit
Límite de peticiones que una API permite en un ventana de tiempo. Es como el semáforo de una autopista: si pasas demasiado rápido, te paran.
**Ejemplo real**: Spotify permite ~100 req/30s por usuario; TuneHop procesa en tandas de 20 tracks y respeta Retry-After para no ser bloqueada.

### Responsive
Diseño web que se adapta al tamaño de pantalla (móvil, tablet, desktop) sin perder usabilidad. Es como el agua: toma la forma del vaso donde la pones.
**Ejemplo real**: TuneHop usa Tailwind CSS con breakpoints `sm:`, `md:`, `lg:` para que la selección de playlists funcione igual en móvil y desktop.

### RGPD (ver GDPR)
Ver GDPR / RGPD.

### Scope (OAuth)
Permiso concreto que la app solicita al usuario (ej. "playlist-read-private"). Es como pedir la llave solo del trastero, no la de toda la casa.
**Ejemplo real**: TuneHop pide solo `playlist-read-private` y `user-read-email` en Spotify; en TIDAL pide `playlists.modify` y `user.read`.

### Space Grotesk
Familia tipográfica sans-serif geométrica humanista (Google Fonts, variable, SIL OFL). x-height generosa, personalidad en mayúsculas, legible en cuerpo. Gratuita, auto-hospedable, un solo archivo variable (wght 300-700).
**Ejemplo real**: Tipografía primaria de TuneHop — encarna Sabio (orden, criterio) y Explorador (geometría viva), no monoespaciada (no IT), no redonda (no infantil).

### Spec-driven development
Metodología: escribir la especificación funcional (qué hace el producto) ANTES de elegir tecnología ni escribir código. La spec es la fuente de verdad; el código la implementa.
**Ejemplo real**: docs/04-spec.md de TuneHop se escribió antes de docs/05-plan-tecnico.md; el código sigue a la spec, no al revés.

### Squatter (okupa de dominios)
Persona que registra dominios con nombres de marca ajenos para revenderlos caro. Es como quien aparta un número de matrícula bonito para cobrarlo a futuro.
**Ejemplo real**: tunehop.com está libre hoy; si no se compra pronto, un squatter podría registrarlo y pedir cientos de euros por un dominio que cuesta ~10-15 €/año.

### Superlativo publicitario
Claim que sitúa al producto en el grado máximo de una cualidad ("el mejor", "el único", "la número 1", "la más rápida"). La ley exige prueba incontrovertible; si no la hay, es publicidad engañosa.
**Ejemplo real**: "La plataforma que paga mejor a los artistas" (tagline TuneHop) es superlativo → requiere prueba de que NINGUNA otra plataforma paga más (Qobuz, Apple Music también pagan bien).

### Switcher Ética
Perfil de usuario que quiere cambiar de plataforma por valores (pago a artistas, ética corporativa) pero no está dispuesto a pagar el coste de fricción (tiempo, esfuerzo, dinero). Es como quien quiere ir al supermercado ecológico pero no tiene coche: la intención es real, el obstáculo es el acceso.
**Ejemplo real**: María, 32 años, diseñadora freelance: quiere apoyar plataformas que paguen mejor a los artistas, pero no pierde horas migrando manualmente ni paga una suscripción para hacerlo.

### Tagline
Frase corta que resume la promesa central de una marca y acompaña al nombre (a menudo en el logo o hero). Es como el lema que dice un personaje al presentarse: "Soy X, y hago Y".
**Ejemplo real**: TuneHop usa "Tu música, donde pagan mejor. En minutos." como tagline principal (elegida entre 6 opciones en el Paso 6).

### TIDAL
Plataforma de streaming musical con audio HiFi/HiRes y mejor pago por stream (~$0.012-0.013 vs $0.003-0.005 de Spotify). API v2 JSON:API en openapi.tidal.com/v2 (registro en developer.tidal.com).
**Ejemplo real**: Destino de escritura de TuneHop (decisión 2026-09-03). OAuth Authorization Code, scopes: playlists.modify, user.read.

### Tailwind CSS
Framework CSS utility-first: cada clase = un estilo atómico (`text-sm`, `bg-accent`, `rounded-lg`). En v4, `@theme inline` mapea custom properties a utilidades. Ojo: `text-[var(--x)]` se resuelve como COLOR, no font-size — usar `text-[length:var(--x)]` o clase CSS predefinida.
**Ejemplo real**: TuneHop usa Tailwind v4 con tokens en `@theme inline`. El bug del logo pequeño se resolvió cambiando `text-[var(--text-display)]` por la clase `.text-display` predefinida en globals.css.

### Token (OAuth)
Credencial temporal (access token) que autoriza a la app a actuar en nombre del usuario. Tiene expiración (ej. 1h) y se renueva con refresh token. Es como el pase de backstage: caduca al acabar el concierto.
**Ejemplo real**: TuneHop guarda tokens solo en memoria de sesión (server-side), nunca en BD ni localStorage; se borran al cerrar la pestaña.

### Token de diseño
Ver Design tokens.

### Tono de voz
La forma consistente en que una marca "habla" en todos sus puntos de contacto. Se define en ejes (cercano/formal, serio/lúdico, experto/accesible, neutro/apasionado) con posición y ejemplos. Es como la personalidad de alguien: no es lo que dice, es cómo lo dice.
**Ejemplo real**: TuneHop = cercano sin confianzudo, serio en la promesa/ligero en la forma, experto invisible, convencida no evangelizadora.

### Turbopack
Bundler de nueva generación (Rust) incluido en Next.js 15+. Más rápido que Webpack en dev (HMR instantáneo) y compila solo lo que cambia.
**Ejemplo real**: TuneHop usa Turbopack vía `next dev --turbopack` (Next.js 16); los builds en Vercel también lo usan.

### Usos correctos / incorrectos
Tabla de ejemplos pares (✅ sí / ❌ no) que muestra la aplicación práctica de las reglas de marca. No son opiniones: son la traducción operativa de la estrategia. Es como el código de vestimenta de un restaurante: "chaqueta sí / chanclas no" — no hay debate.
**Ejemplo real**: En el manual de TuneHop, logo (espacio de respeto, variante correcta), color (Teal solo CTA primario con texto negro), tipografía (Space Grotesk UI, JetBrains Mono solo código), voz (cercano sin confianzudo, cero palabras prohibidas).

### Variable font
Un solo archivo de fuente que contiene múltiples pesos, anchos, estilos (ej. wght 300-700) en lugar de un archivo por cada peso. Es como una navaja suiza tipográfica: menos peticiones HTTP, más control, mismo diseño.
**Ejemplo real**: Space Grotesk y JetBrains Mono en TuneHop son variable fonts: un archivo cada una cubre Regular, Medium, SemiBold, Bold para UI, hero, código.

### Viewport (Next.js 16)
Export que define metadata del viewport: `themeColor`, `width`, `initialScale`, `maximumScale`. En Next.js 16, `themeColor` se movió de `metadata` a `viewport` (antes daba warning).
**Ejemplo real**: TuneHop define `export const viewport: Viewport = { themeColor: "#0A0A0A" }` en layout.tsx.

### Vocabulario prohibido
Lista de palabras, clichés y giros de la categoría que la marca se compromete a NO usar porque diluyen su posicionamiento o la hacen sonar como la competencia. Es como los alimentos que un celíaco no puede comer: no es preferencia, es supervivencia de la marca.
**Ejemplo real**: TuneHop prohíbe "transferir", "sincronizar", "gratis", "seguro", "fácil", "huir", "plataforma destino" — y define qué usar en su lugar.

### WCAG (Web Content Accessibility Guidelines)
Guías de accesibilidad web (W3C). Niveles A, AA, AAA. AA es el estándar profesional: contraste, navegación teclado, etiquetas ARIA, foco visible.
**Ejemplo real**: TuneHop apunta a WCAG AA: contrastes 4.5:1, focus-visible en botones, labels en inputs, aria-live en estados de carga.

### Zona segura (RGPD)
Concepto operativo: tratar los datos solo dentro del ámbito donde el usuario dio consentimiento y solo mientras dura la finalidad. Fuera de esa zona, no hay dato.
**Ejemplo real**: En TuneHop, la zona segura es la sesión HTTP: tokens en memoria, playlists en variables de request, todo muere al cerrar el navegador.