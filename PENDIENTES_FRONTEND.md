# ⏳ Pendientes del Equipo Frontend

**Actualizado:** 19 de Octubre 2025

---

## 🎯 Próximas Tareas

### ✅ Completado
- [x] Login de usuario
- [x] Registro de usuario
- [x] Configuración de módulos ES6

### 🔴 Prioridad Alta

#### 1. **Home de Usuario - Categorías Dinámicas**

**Archivo a crear:** `js/home-usuario.js`

**Objetivo:** Cargar las 10 categorías desde la API en lugar de tenerlas hardcodeadas.

**Página afectada:** `pages/home-usuario.html`

**Endpoint a consumir:**
```http
GET /api/v1/categorias
Authorization: Bearer {token}
```

**Response esperado:**
```json
[
  {
    "categoria_id": 1,
    "nombre": "Salud",
    "descripcion": "Servicios médicos y de salud"
  },
  {
    "categoria_id": 2,
    "nombre": "Cuidado Personal",
    "descripcion": "Peluquerías, spa, estética"
  }
  // ... 8 más
]
```

**Cambios necesarios:**
1. Crear `js/home-usuario.js`
2. Modificar `home-usuario.html`:
   - Agregar `<script type="module" src="../js/home-usuario.js"></script>`
   - Vaciar el contenido hardcoded del `<section class="categories-grid">`

**Ver código de ejemplo:** `ejemplos/home-usuario.js`

---

#### 2. **Registro de Empresa**

**Archivo a crear:** `js/registro-empresa.js`

**Objetivo:** Integrar el formulario de registro de empresas con el backend.

**Página afectada:** `pages/registro-empresa.html`

**Endpoint a consumir:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Barbería Central",
  "apellido": "",
  "email": "barberia@example.com",
  "telefono": "1122334455",
  "password": "password123",
  "tipo_usuario": "EMPRESA",
  "categoria_id": 2
}
```

**Consideraciones especiales:**
- Requiere `categoria_id` (selector dinámico de categorías)
- Integrar con `map.js` existente para geocodificación
- Validar coordenadas antes de enviar

**Ver código de ejemplo:** `ejemplos/registro-empresa.js`

---

#### 3. **Búsqueda de Empresas**

**Archivo a crear:** `js/buscar-empresas.js`  
**Página a crear:** `pages/buscar-empresas.html`

**Objetivo:** Mostrar empresas filtradas por categoría.

**Endpoint a consumir:**
```http
GET /api/v1/empresas?categoria_id=1
Authorization: Bearer {token}
```

**Response esperado:**
```json
{
  "empresas": [
    {
      "empresa_id": 1,
      "razon_social": "Clínica San José",
      "descripcion": "Atención médica general",
      "categoria_id": 1,
      "telefono": "1122334455",
      "email": "contacto@clinica.com"
    }
  ]
}
```

**Funcionalidades:**
- Listar empresas con tarjetas visuales
- Filtro por categoría (desde home-usuario)
- Click en empresa → Ver detalle
- Botón "Reservar turno"

**Ver código de ejemplo:** `ejemplos/buscar-empresas.js`

---

### 🟡 Prioridad Media

#### 4. **Sistema de Turnos (agenda.html)**

**Archivo a modificar:** `js/app-react.js`

**Objetivo:** Implementar gestión completa de turnos en React.

**Endpoints a consumir:**
```http
GET /api/v1/empresas/{id}/disponibilidad?fecha=2025-10-20
POST /api/v1/turnos/reservar
GET /api/v1/mis-turnos
PUT /api/v1/turnos/{id}/cancelar
```

**Funcionalidades:**
- Ver calendario de disponibilidad
- Reservar turno
- Listar mis turnos
- Cancelar/modificar turno

**Estado actual:** Estructura React básica, requiere integración completa

---

#### 5. **Detalle de Empresa**

**Archivo a crear:** `js/detalle-empresa.js`  
**Página a crear:** `pages/detalle-empresa.html`

**Endpoint a consumir:**
```http
GET /api/v1/empresas/{id}
Authorization: Bearer {token}
```

**Funcionalidades:**
- Mostrar información completa de la empresa
- Ver servicios ofrecidos
- Ver calificaciones
- Botón "Reservar turno" → Ir a disponibilidad

---

### 🟢 Prioridad Baja

#### 6. **Perfil de Usuario**

Crear página de perfil con datos del usuario logueado.

#### 7. **Sistema de Mensajería**

Integrar chat empresa-cliente (endpoints ya disponibles).

#### 8. **Calificaciones**

Permitir al usuario calificar empresas después de un turno completado.

---

## 📚 Recursos Disponibles

### Documentación
- **API Docs interactiva:** http://127.0.0.1:8000/docs
- **Integración completada:** Ver `INTEGRACION.md`

### Ejemplos de Código
- `ejemplos/home-usuario.js` - Cargar categorías
- `ejemplos/registro-empresa.js` - Registro con categoría
- `ejemplos/buscar-empresas.js` - Listado de empresas

### Usuarios de Prueba
```javascript
// Usuario Cliente
{
  email: "test.frontend@miturno.com",
  password: "Test12345"
}

// Empresa (crear primero)
{
  email: "barberia.test@miturno.com",
  password: "Test12345"
}
```

---

## 🔧 Guía Rápida de Integración

### Patrón para consumir API:
```javascript
import { API_URL } from './config.js';

async function consumirEndpoint() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_URL}/api/v1/endpoint`, {
      method: 'GET', // o POST, PUT, etc.
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos) // solo para POST/PUT
    });

    const result = await response.json();

    if (response.ok) {
      // Procesar datos exitosos
      console.log(result);
    } else {
      // Manejar error
      alert(`Error: ${result.detail}`);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor');
  }
}
```

---

## ✅ Checklist de Implementación

Para cada nueva integración:

- [ ] Crear archivo JS con `import { API_URL }`
- [ ] Implementar función async para llamar al endpoint
- [ ] Agregar manejo de errores (try/catch)
- [ ] Incluir token JWT en headers
- [ ] Procesar y renderizar respuesta
- [ ] Agregar `type="module"` al HTML
- [ ] Hacer función global con `window.nombreFuncion =`
- [ ] Probar con backend corriendo
- [ ] Verificar en Network tab del navegador (F12)

---

## 📞 Contacto Backend

Para dudas técnicas o problemas de integración, contactar al equipo de backend.

**Errores comunes:**
- **401 Unauthorized:** Token JWT inválido o expirado
- **CORS error:** Verificar origen en config del backend
- **404 Not Found:** URL del endpoint incorrecta
- **422 Validation Error:** Datos enviados no cumplen el schema

---

**Próxima reunión de integración:** Coordinar según avance