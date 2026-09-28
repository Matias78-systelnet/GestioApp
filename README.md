# GestioApp — Frontend v2.1

GestioApp es una aplicación que unifica la gestión de microservicios y control de políticas, control de activos, usuarios y auditoría para PyMEs con múltiples sedes. 
HTML + JavaScript (sin frameworks ni compilación) + Bootstrap 5 (solo CSS) + Bootstrap Icons.

- **Listo para conectar un backend**: todas las pantallas pasan por una capa de datos (`Api`) que funciona
  en modo demostración (`mock`, sin servidor) o contra el backend real (`http`) cambiando una línea.
- **Accesible**: WCAG 2.2 AA, verificado con axe-core (0 infracciones). Ver [docs/ACCESIBILIDAD.md](docs/ACCESIBILIDAD.md).
- **Configurable**: endpoints, sesión, catálogos, permisos por rol, textos de descargas e imágenes en un solo archivo.

## Uso rápido

1. Abrir `index.html` en el navegador (doble clic). No requiere servidor ni instalación.
2. Credenciales de demostración:
   - `admin@empresa.cl` / `admin123` → **Administrador** (todo)
   - `c.munoz@empresa.cl` / `demo1234` → **Supervisor** (activos y consulta de usuarios)
   - `j.rojas@empresa.cl` / `demo1234` → **Usuario** (dashboard, descargas, configuración)
3. Los datos de demostración viven en el `localStorage` del navegador. Para volver al inicio:
   **Configuración → Restablecer datos** (como administrador).

> Recomendado en desarrollo: servirlo con cualquier servidor estático (ej. extensión *Live Server* de VS Code)
> para que el comportamiento sea igual al de producción.

## Estructura

```
gestioapp-frontend/
├── index.html                 Punto de entrada (SPA) + orden de carga de scripts
├── css/styles.css             Estilos: tokens de marca en :root, componentes, responsive, accesibilidad
├── docs/
│   ├── API.md                 Contrato con el backend (endpoints, modelos, errores)
│   └── ACCESIBILIDAD.md       Qué se cumple, cómo se verificó y reglas para el equipo
└── js/
    ├── config.js              ★ Configuración central (lo único que se edita por entorno)
    ├── utils.js               Funciones puras: storage, escape HTML, fechas, moneda, CSV
    ├── validators.js          RUT chileno, email, reglas de activo y usuario
    ├── services/
    │   ├── http-client.js     fetch con token, timeout y errores normalizados (ApiError)
    │   ├── mock-data.js       Datos semilla del modo demostración
    │   ├── mock-adapter.js    "Servidor" simulado: misma interfaz y reglas que el backend
    │   └── api.js             Api.* → elige mock o http según CONFIG.api.mode
    ├── a11y.js                Anuncios a lectores de pantalla, trampa de foco, preferencias
    ├── auth.js                Sesión, permisos por rol, cierre por inactividad
    ├── components.js          Plantillas: layout, navbar, hero, modal, campos, badges
    ├── ui.js                  notify, modales, confirmación, errores de formulario, cargando/error
    ├── actions.js             Delegación de eventos (data-action / data-go / data-submit)
    ├── assets.js              Módulo Activos
    ├── users.js               Módulo Usuarios
    ├── audit-page.js          Módulo Auditoría
    ├── downloads.js           Módulo Descargas
    ├── settings.js            Módulo Configuración
    ├── pages.js               Landing, Login, Dashboard y registro de páginas
    ├── router.js              Rutas por hash, protección por sesión y permiso, foco al navegar
    └── main.js                Arranque
```

### Flujo de datos

```
Pantalla (assets.js)  →  Api.assets.create(data)  →  CONFIG.api.mode
                                                        ├─ 'mock' → MockApi (localStorage)
                                                        └─ 'http' → Http.call('assetsCreate') → backend
                         ← objeto o ApiError { status, message, fieldErrors }
Pantalla: éxito → Ui.notify() y recarga · error → Ui.showError() (errores junto a cada campo)
```

## Configuración

Todo está en [`js/config.js`](js/config.js). Secciones:

| Sección | Qué controla |
|---|---|
| `app` | Nombre, versión, `locale` (`es-CL`), moneda, empresa |
| `api` | `mode` (`mock`/`http`), `baseUrl`, `timeoutMs`, `withCredentials`, rutas de cada endpoint |
| `auth` | Minutos de inactividad, `sessionStorage`/`localStorage`, header del token, "recordar email", URL para recuperar la contraseña |
| `mock` | Credenciales y latencia del modo demostración |
| `support` | Email y teléfono de soporte (barra superior y "Solicitar asistencia") |
| `catalogs` | Sedes, roles, áreas, tipos de activo, tipos de auditoría |
| `permissions` | Permisos por rol (`'*'` = todos) |
| `features` | Registrar visitas al dashboard, CSV, separador CSV, activo destacado, tamaños de página |
| `downloads` | Nombre y URL del instalador, componentes y pasos de la guía |
| `images` | Fotos de fondo (conviene alojarlas en el mismo servidor en producción) |

**Por entorno, sin tocar `config.js`**: definir `window.GESTIO_CONFIG` en `index.html` antes de los scripts
(hay un ejemplo comentado). Se mezcla en profundidad con los valores por defecto:

```html
<script>
  window.GESTIO_CONFIG = {
    api: { mode: 'http', baseUrl: 'https://api.empresa.cl/v1' },
    auth: { sessionTimeoutMin: 15 },
    downloads: { installerUrl: 'https://descargas.empresa.cl/GestioApp-Setup.exe' }
  };
</script>
```

Colores y tipografía: bloque `:root` al inicio de `css/styles.css` (leer el comentario de contraste antes de cambiarlos).

## Conectar el backend

1. Implementar el contrato de [docs/API.md](docs/API.md). El archivo `js/services/mock-adapter.js` es una
   implementación de referencia que se puede leer como especificación.
2. Poner `api.mode: 'http'` y la `baseUrl` (ver arriba).
3. Si las rutas del backend son otras, cambiarlas en `CONFIG.api.endpoints` (formato `"MÉTODO /ruta/:id"`).
4. Replicar en el servidor: permisos por rol, validaciones (RUT, email, serie única) y reglas
   (último administrador, auto-eliminación). **El frontend no es una barrera de seguridad.**
5. El backend registra la auditoría de cada cambio; el frontend solo envía eventos del navegador
   (`POST /audit/events`).

## Convenciones de código

- **Sin JavaScript en línea.** Las plantillas usan atributos y `actions.js` los enlaza:
  - `data-go="activos"` → navegar
  - `data-action="asset-new"` → clic (registrar con `Actions.register({ 'asset-new': fn })`)
  - `data-input` / `data-change` → escribir / cambiar
  - `<form data-submit="asset-save" novalidate>` → envío (incluye Enter)
  Esto permite una Content-Security-Policy estricta (ver Seguridad).
- **Escapar siempre** datos antes de insertarlos como HTML: `Utils.esc(valor)`. URLs de datos: `Utils.safeUrl()`.
- **Nueva página**: crear `js/mi-pagina.js` con `{ template(), init() }`, agregarlo a `Pages` (pages.js),
  a `ROUTES` (config.js, con su `permission`) y un `<script>` en `index.html` antes de `pages.js`.
- **Formularios**: `Components.field()` / `selectField()`, `Ui.form.read()`, validar con `Validators`,
  mostrar errores con `Ui.form.setErrors()`, enviar con `Ui.busy(boton, async () => …)`.
- Reglas de accesibilidad: ver [docs/ACCESIBILIDAD.md](docs/ACCESIBILIDAD.md#reglas-para-el-equipo).

## Seguridad

- Token en `sessionStorage` por defecto (se borra al cerrar la pestaña). Para mayor seguridad, usar
  cookie `HttpOnly` + `SameSite` y `api.withCredentials: true` (el frontend deja de manejar el token).
- Todos los textos del backend se escapan; las URLs se filtran con `Utils.safeUrl` (bloquea `javascript:`).
- CSP sugerida para producción (ajustar dominios):
  ```
  default-src 'self';
  script-src 'self';
  style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com;
  font-src https://cdn.jsdelivr.net https://fonts.gstatic.com;
  img-src 'self' https://images.unsplash.com data:;
  connect-src 'self' https://api.empresa.cl;
  ```
  Nota: los estilos se aplican por CSSOM (no requieren `'unsafe-inline'`). Para scripts, mover el bloque
  opcional `window.GESTIO_CONFIG` de `index.html` a un archivo `.js` propio.

## Funcionalidades

- **Autenticación**: login con validación en línea, "recordar mi email", roles y permisos, cierre por
  inactividad configurable, sesión expirada (401) → vuelve al login con aviso.
- **Dashboard**: resumen desde `GET /dashboard/summary`, tarjetas de acceso rápido, métricas, barras,
  activo destacado y actividad reciente.
- **Activos**: crear, modificar, eliminar (con confirmación), asignar/desasignar, búsqueda, filtros,
  orden por columna, exportar CSV (UTF-8 con BOM, separador configurable). Selección de filas con teclado.
- **Usuarios**: crear y modificar con validación de RUT y email, eliminar, deshabilitar/habilitar,
  protección del último administrador y de la propia cuenta, respaldos por usuario.
- **Auditoría**: filtros por tipo y paginación en el servidor, autor de cada evento.
- **Descargas**: instalador configurable (real o simulado), componentes y guía de 7 pasos.
- **Configuración**: preferencia "Reducir animaciones", datos de la sesión, información de la instalación,
  restablecer datos de demostración.

## Compatibilidad

Chrome, Edge, Firefox y Safari de los últimos 2 años (usa `inert`, `fetch`, `AbortController`,
`IntersectionObserver`). Diseño adaptable desde 320 px.

## Equipo

Proyecto desarrollado para DuocUC 2026 — Matías Romero, Rodrigo Carreño, Marcelo Figueroa, Cristóbal Seguel.
