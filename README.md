# MiTurno 

Este es un proyecto de desarrollo web para un sistema de gestión de turnos.
Materia: PPS

## Acceso: https://pps-proyecto.vercel.app/

**Stack:** HTML5, CSS3, JavaScript (vanilla) y Tailwind (CDN).


**Estructura principal**
- `index.html` — Landing / login.
- `css/` — Hojas de estilo específica para el index (`style-index-d.css`).
- `js/` — Scripts específico para el index (`index-d.js`) y utilidades.
- `pages/` — Vistas organizadas por rol (`empresa/`, `usuario/`), cada una con sus `.html`, `.css` y `.js`.

**Páginas importantes** (ejemplos)
- [PPS-Proyecto/pages/usuario/home-usuario/home-usuario.html](PPS-Proyecto/pages/usuario/home-usuario/home-usuario.html#L1) — Home usuario.
- [PPS-Proyecto/pages/usuario/registro-usuario/registro-usuario.html](PPS-Proyecto/pages/usuario/registro-usuario/registro-usuario.html#L1) — Registro usuario.
- [PPS-Proyecto/pages/empresa/home-empresa/home-empresa.html](PPS-Proyecto/pages/empresa/home-empresa/home-empresa.html#L1) — Home empresa.

**Instalación**

Abrir `PPS-Proyecto` en VS Code y usar `Live Server`.


**Notas de desarrollo**
- No hay bundler ni sistema de módulos: los archivos `.html` incluyen sus `.css` y `.js` de forma relativa.

**Scripts y responsabilidades**
- `js/index-d.js`: lógica de la landing (login simulado, efectos visuales).
- Cada vista tiene su propio `*.js` (por ejemplo `home-empresa/home-empresa.js`) para mantener separación.

**Despliegue**
- Sitio publicado en Vercel 





