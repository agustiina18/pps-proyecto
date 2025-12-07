// =====================================
// CONFIGURACIÓN GENERAL
// =====================================
const API_URL = "http://localhost:8000"; // Modificar con el url
const USE_BACKEND = false; // Tenemos que cambiarlo a true cuando hagamos la integración del back

// =====================================
// ELEMENTOS DEL DOM
// =====================================
const logoImg = document.getElementById("empresaLogo");
const nombreEl = document.getElementById("empresaNombre");
const rubroEl = document.getElementById("empresaRubro");
const rolEl = document.getElementById("empresaRol");

// =====================================
// EMPRESA SELECCIONADA
// =====================================
let empresaId = localStorage.getItem("empresaSeleccionada");

// Se usa ID ficticio
if (!empresaId) {
    empresaId = 1;
}

// =====================================
// MODO MOCK para Datos simulados
// =====================================
const MOCK_DATA = {
    empresa: {
        id: 1,
        nombre: "Peluquería MiTurno",
        rubro: "Estética",
        rubro2: "Peluquería",
        email: "contacto@miturno.com",
        calificacion: 8.5,
        logo: "../../img/icono-perfil.png",
        telefonos: [[1133224455]],
        direccion: {
            domicilio: "Av. Siempre Viva 742",
            lat: -34.6037,
            lng: -58.3816,
            aclaracion: "Local 3B"
        }
    },
    servicios: [],
    turnos: [],
    miembros: [],
    rol: "propietario"
};

// =====================================
// CARGA INICIAL
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    if (USE_BACKEND) {
        cargarDesdeBackend();
    } else {
        console.warn("▶ MODO MOCK ACTIVADO — Mostrando datos simulados");
        renderizarPanel(MOCK_DATA);
    }
});

// =====================================
// CARGAR DESDE BACKEND MiTurno
// =====================================
async function cargarDesdeBackend() {
    try {
        const response = await fetch(`${API_URL}/empresas/${empresaId}/panel`, {
            credentials: "include"
        });

        if (!response.ok) throw new Error("Error al obtener datos del backend");

        const data = await response.json();
        renderizarPanel(data);

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar al backend. Activando modo mock.");
        renderizarPanel(MOCK_DATA);
    }
}

// =====================================
// RENDERIZA INFORMACIÓN EN PANTALLA
// =====================================
function renderizarPanel(data) {
    const empresa = data.empresa;

    // LOGO
    logoImg.src = empresa.logo || "../../img/icono-perfil.png";

    // NOMBRE
    nombreEl.textContent = empresa.nombre || "Nombre no disponible";

    // RUBRO
    rubroEl.textContent = empresa.rubro || "Sin rubro";

    // ROL DEL USUARIO
    rolEl.textContent = `Rol: ${data.rol}`;

    // Controles por rol
    manejarPermisos(data.rol);
}

// =====================================
// PERMISOS POR ROL
// =====================================
function manejarPermisos(rol) {

    if (rol === "empleado") {
        deshabilitarBoton("Editar Perfil");
        deshabilitarBoton("Empleados");
    }
}

// =====================================
// DESHABILITAR BOTONES
// =====================================
function deshabilitarBoton(texto) {
    const botones = document.querySelectorAll(".boton-menu");

    botones.forEach(btn => {
        if (btn.textContent.includes(texto)) {
            btn.style.opacity = "0.4";
            btn.style.cursor = "not-allowed";
            btn.onclick = () => alert("No tienes permisos para acceder aquí.");
        }
    });
}
