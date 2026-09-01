# Glosario

Términos técnicos que aparecen en el proyecto, en orden alfabético. Cada entrada tiene definición breve + analogía cotidiana + ejemplo real.

---

### Access tier
Nivel de permiso que una API te da al registrarte como desarrollador. Es como las categorías de cliente en un banco: cliente normal, VIP, banca privada.
**Ejemplo real**: TIDAL tiene tiers THIRD_PARTY (público), PARTNER y INTERNAL. Nosotros somos THIRD_PARTY y eso nos da acceso a playlists, pero no a todo el catálogo.

### AI Act
Reglamento Europeo de Inteligencia Artificial. Clasifica los sistemas de IA en 4 niveles de riesgo (prohibido, alto, limitado, mínimo) y asigna obligaciones según el nivel.
**Ejemplo real**: TuneHop es riesgo mínimo porque no usa IA, solo OAuth y búsqueda por código.

### Batch / Tanda
Procesar elementos en grupos pequeños en vez de todos a la vez. Es como ir al supermercado: llevas 20 cosas en vez de 200 de golpe.
**Ejemplo real**: Migrar 50 playlists por tanda para no saturar las APIs de Spotify y Deezer.

### Consentimiento (RGPD)
Permiso explícito que el usuario da antes de que proceses sus datos personales. Debe ser libre, informado, específico e inequívoco.
**Ejemplo real**: El checkbox obligatorio de TuneHop antes de conectar Spotify: "He leído la Política de Privacidad y acepto que procese mis datos."

### Consent screen / Pantalla de autorización
Pantalla oficial de Spotify/Deezer donde el usuario ve qué permisos pide tu app y decide si acepta o no.
**Ejemplo real**: Cuando pulsa "Conectar con Spotify" y aparece la pantalla de Spotify que dice "TuneHop quiere acceder a tus playlists".

### Cookie
Pequeño archivo que un sitio web guarda en tu navegador para recordarte. Es como una pulsera de hospital con tu número: la llevas puesta mientras estás en el sitio.
**Ejemplo real**: No usamos cookies en TuneHop. Los tokens viven en memoria de la sesión, no en cookies.

### Crear playlist (API)
Operación de la API de una plataforma musical que crea una playlist nueva con el nombre y las canciones que tú le indiques.
**Ejemplo real**: Después de buscar las canciones de "Road Trip Mix" en Deezer, la app llama a Deezer API para crear esa playlist con esas canciones.

### Derecho de supresión (RGPD)
Derecho del usuario a que borres todos sus datos personales que tengas. Debe ser tan fácil como提供 el servicio.
**Ejemplo real**: El botón "Eliminar mis datos y cerrar" de TuneHop. Un clic y todo se borra.

### Deezer
Plataforma de streaming musical francesa. Paga mejor que Spotify (~0.004-0.006$ por stream vs ~0.003$). Tiene API pública completa y gratuita.
**Ejemplo real**: Es el destino de migración del MVP de TuneHop.

### DPIA (Data Protection Impact Assessment)
Evaluación de impacto sobre la privacidad. Obligatoria cuando el tratamiento de datos es de alto riesgo (perfilado masivo, vigilancia, etc.).
**Ejemplo real**: TuneHop NO requiere DPIA porque no es alto riesgo.

### Fallback
Plan B. Cuando el método principal falla, se usa el alternativo. Es como llevar paraguas por si llueve.
**Ejemplo real**: Si el ISRC de una canción no se encuentra en Deezer, se busca por título + artista como fallback.

### GDPR / RGPD
Reglamento General de Protección de Datos. Ley europea que regula cómo tratas datos personales de ciudadanos de la UE.
**Ejemplo real**: TuneHop debe cumplir RGPD porque se ofrece en la UE y trata datos personales (email, tokens, nombres de playlist).

### HTTP vs. HTTPS
HTTP es la comunicación normal entre navegador y servidor. HTTPS es la versión cifrada (la "S" es de Secure). Es como hablar por teléfono normal vs. hablar con una línea encriptada.
**Ejemplo real**: TuneHop usa HTTPS (Vercel/Railway lo hacen por defecto). Todos los tokens viajan cifrados.

### ISRC (International Standard Recording Code)
Código alfanumérico de 12 caracteres que identifica de forma única cada grabación musical en el mundo. Es el DNI de la canción.
**Ejemplo real**: El ISRC de "Blinding Lights" de The Weeknd es el mismo en Spotify que en Deezer. Por eso funciona como identificador para buscar.

### Liked Songs / Canciones guardadas
Lista de canciones que un usuario ha marcado como "me gusta" en Spotify. Puede contener miles de canciones de muchos artistas diferentes.
**Ejemplo real**: María tiene 5.200 canciones guardadas en 8 años. En v2 se podrán migrar con un clic.

### Minimización (RGPD)
Principio de que solo debes tratar los datos estrictamente necesarios para la finalidad. No más.
**Ejemplo real**: TuneHop solo lee playlists y canciones. No lee el historial de escucha, no lee preferencias, no lee perfil social.

### MVP (Minimum Viable Product)
Versión más reducida de un producto que todavía tiene valor para el usuario. La versión que comprueba si la idea funciona sin construir todo.
**Ejemplo real**: El MVP de TuneHop migra playlists de Spotify a Deezer. No migra álbumes, artistas ni Liked Songs (eso es v2).

### OAuth 2.0
Protocolo estándar para autorizar una app a acceder a tus datos en otro servicio sin darle tu contraseña. Es como dar un permiso temporal.
**Ejemplo real**: TuneHop usa OAuth 2.0 para que el usuario autorice a la app a leer sus playlists de Spotify sin compartir su contraseña.

### PKCE (Proof Key for Code Exchange)
Extensión de OAuth 2.0 que añade una capa extra de seguridad. Evita que alguien intercepte el código de autorización. Es como llevar doble cerradura.
**Ejemplo real**: Spotify recomienda PKCE para apps que pueden tener el código expuesto (como apps web sin backend seguro). TuneHop lo usa en Spotify y TIDAL.

### TuneHop
Nombre del proyecto. App web que migra playlists de Spotify a plataformas éticas (Deezer, TIDAL) con un clic.
**Ejemplo real**: tunehop.com — María entra, conecta Spotify, elige playlists, conecta Deezer, migra. 3 minutos.

### Rate limit
Límite de peticiones que una API permite por unidad de tiempo. Si lo superas, te bloquea temporalmente.
**Ejemplo real**: Spotify permite ~30 peticiones/segundo, Deezer ~50. TuneHop usa tandas de 50 playlists con pausas para no superarlos.

### RGPD (ver GDPR)
Mismo concepto, nombre en español: Reglamento General de Protección de Datos.

### Responsive
Diseño web que se adapta automáticamente al tamaño de la pantalla (móvil, tablet, escritorio). No hay versión separada; el mismo sitio se reorganiza.
**Ejemplo real**: TuneHop será responsive: funciona igual en el móvil de María que en su portátil.

### Scope (OAuth)
Permiso específico que una app pide al usuario. No es "dame todo", es "dame esto y solo esto".
**Ejemplo real**: TuneHop pide a Spotify el scope `playlist-read-private` (leer playlists privadas) pero NO pide `user-read-recently-played` (historial de escucha).

### Spec-driven development
Metodología que consiste en escribir la especificación funcional (QUÉ hace la app) ANTES de decidir la tecnología (CÓMO se construye).
**Ejemplo real**: TuneHop usó este enfoque en el Paso 5 (spec) antes del Paso 6 (tecnología).

### TIDAL
Plataforma de streaming musical de alta fidelidad (HiFi). Paga mejor que Spotify (~0.012-0.013$ por stream). Tiene API con sistema de "access tiers".
**Ejemplo real**: Estará disponible como destino de migración en v2 de TuneHop, una vez se confirme que el tier THIRD_PARTY cubre los endpoints de búsqueda.

### Token (OAuth)
Credencial temporal que una API te da tras autenticarte. Es como una pulsera de un evento: te identifica y te da acceso, pero expira.
**Ejemplo real**: El access_token de Spotify dura 1 hora. TuneHop lo renueva automáticamente con el refresh_token.

### WCAG (Web Content Accessibility Guidelines)
Guías internacionales para hacer la web accesible a personas con discapacidades. Niveles: A (básico), AA (estándar), AAA (máximo).
**Ejemplo real**: TuneHop apunta al nivel AA: contraste 4.5:1, navegación por teclado, textos alternativos en imágenes.

### Zona segura (RGPD)
Principio de que los datos personales solo deben almacenarse durante el tiempo estrictamente necesario y eliminarse después.
**Ejemplo real**: TuneHop solo guarda datos durante la sesión. Al cerrar o pulsar "Borrar mis datos", todo se elimina. No hay base de datos persistente.
