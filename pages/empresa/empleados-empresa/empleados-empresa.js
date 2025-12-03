// =====================================
// CONFIG
// =====================================
const API_URL = "http://localhost:8000";
const USE_BACKEND = false; // cambiar a true al integrar nuestro back

let empresaId = localStorage.getItem("empresaSeleccionada") || 1;

// =====================================
// MODO MOCK para Datos simulados
// =====================================
const MOCK_DATA = {
    rol: "propietario",
    miembros: [
        { id: 1, apellido: "García", nombre: "Lucía", rol: "gerente" },
        { id: 2, apellido: "López", nombre: "Marcos", rol: "profesional" },
        { id: 3, apellido: "Pérez", nombre: "Ana", rol: "empleado" },
    ]
};

// =====================================
// DOM
// =====================================
const listaEmpleados = document.getElementById("listaEmpleados");
const btnInvitar = document.getElementById("btnInvitar");

// =====================================
// INICIO
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    if (USE_BACKEND) cargarDesdeBackend();
    else renderizar(MOCK_DATA);
});

// =====================================
// CARGAR DESDE BACKEND Miturno
// =====================================
async function cargarDesdeBackend() {
    try {
        const r = await fetch(`${API_URL}/empresas/${empresaId}/panel`, {
            credentials: "include"
        });

        if (!r.ok) throw new Error("Error al cargar empleados");

        const data = await r.json();
        renderizar(data);

    } catch (err) {
        console.error(err);
        alert("No se pudo conectar al backend. Activando MODO MOCK.");
        renderizar(MOCK_DATA);
    }
}

// =====================================
// RENDERIZA LISTA
// =====================================
function renderizar(data) {
    listaEmpleados.innerHTML = "";

    const rolUsuario = data.rol;

    controlarPermisos(rolUsuario);

    data.miembros.forEach(emp => {
        const div = document.createElement("div");
        div.classList.add("empleado-card");

        div.innerHTML = `
            <div class="empleado-info">
                <span class="empleado-nombre">${emp.apellido}, ${emp.nombre}</span>
                <span class="empleado-rol">Rol: ${emp.rol}</span>
            </div>

            <div class="empleado-acciones">
                <button class="btn-accion btn-rol">
                    <i class="fa-solid fa-user-gear"></i> Rol
                </button>

                <button class="btn-accion btn-eliminar">
                    <i class="fa-solid fa-user-xmark"></i> Eliminar
                </button>
            </div>
        `;

        // EVENTOS (mock)
        div.querySelector(".btn-rol").onclick = () => {
            abrirModalCambiarRol(emp, rolUsuario);
        };

        div.querySelector(".btn-eliminar").onclick = () => {
            abrirModalEliminar(emp, rolUsuario);
        };

        listaEmpleados.appendChild(div);
    });
}

// =====================================
// PERMISOS POR ROL
// =====================================
function controlarPermisos(rol) {
    if (rol === "empleado") {
        btnInvitar.classList.add("deshabilitado");
        btnInvitar.onclick = () => alert("No tienes permisos.");
    }
}

// ====================================================
// MODAL INVITAR EMPLEADO
// ====================================================
const modal = document.getElementById("modalInvitar");
const btnInvitarEmpleado = document.getElementById("btnInvitar");

const inputEmailInvitar = document.getElementById("inputEmailInvitar");
const selectRolInvitar = document.getElementById("selectRolInvitar");

const btnCancelarInvitacion = document.getElementById("btnCancelarInvitacion");
const btnEnviarInvitacion = document.getElementById("btnEnviarInvitacion");


// ABRIR MODAL
btnInvitarEmpleado.addEventListener("click", () => {
    modal.classList.add("show");
});

// CERRAR MODAL
btnCancelarInvitacion.addEventListener("click", () => {
    modal.classList.remove("show");
});


// ====================================================
// ENVIAR INVITACIÓN
// ====================================================
btnEnviarInvitacion.addEventListener("click", async () => {

    const email = inputEmailInvitar.value.trim();
    const rolSeleccionado = selectRolInvitar.value;

    // Validación simple
    if (!email || !email.includes("@")) {
        alert("Debe ingresar un email válido.");
        return;
    }

    // OBJETO A ENVIAR
    const invitacion = {
        usuario_email: email,
        rol: rolSeleccionado
    };

    // MODO MOCK
    if (!USE_BACKEND) {
        alert(`📩 Invitación MOCK enviada a: ${email}\nRol: ${rolSeleccionado}`);
        modal.classList.remove("show");
        inputEmailInvitar.value = "";
        return;
    }

    // ENVÍO AL BACKEND
    try {
        const r = await fetch(`${API_URL}/empresas/${empresaId}/invitar_empleado`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invitacion)
        });

        if (!r.ok) {
            const error = await r.json();
            console.error(error);
            alert("Error al enviar la invitación.");
            return;
        }

        alert("✔ Invitación enviada con éxito.");
        modal.classList.remove("show");
        inputEmailInvitar.value = "";

    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor.");
    }
});

// ====================================================
// MODAL CAMBIAR ROL
// ====================================================

const modalCambiarRol = document.getElementById("modalCambiarRol");

const cambiarRolNombre = document.getElementById("cambiarRolNombre");
const cambiarRolActual = document.getElementById("cambiarRolActual");
const cambiarRolNuevo = document.getElementById("cambiarRolNuevo");

const btnCancelarCambioRol = document.getElementById("btnCancelarCambioRol");
const btnGuardarCambioRol = document.getElementById("btnGuardarCambioRol");

// Variable temporal
let empleadoSeleccionado = null;


// ABRIR MODAL CAMBIAR ROL
function abrirModalCambiarRol(emp, rolUsuario) {

    if (rolUsuario === "empleado") {
        return alert("No tienes permisos para cambiar roles.");
    }

    if (emp.rol === "propietario") {
        return alert("No puedes modificar al propietario.");
    }

    empleadoSeleccionado = emp;

    cambiarRolNombre.textContent = `${emp.apellido}, ${emp.nombre}`;
    cambiarRolActual.value = emp.rol;
    cambiarRolNuevo.value = emp.rol;

    modalCambiarRol.classList.add("show");
}


// CERRAR MODAL
btnCancelarCambioRol.addEventListener("click", () => {
    modalCambiarRol.classList.remove("show");
});


// GUARDAR CAMBIO DE ROL
btnGuardarCambioRol.addEventListener("click", async () => {

    const nuevoRol = cambiarRolNuevo.value;

    if (!empleadoSeleccionado) return;

    // MODO MOCK
    if (!USE_BACKEND) {
        alert(`(MODO MOCK)\nRol cambiado:\n${empleadoSeleccionado.nombre}: ${empleadoSeleccionado.rol} → ${nuevoRol}`);
        modalCambiarRol.classList.remove("show");
        return;
    }

    // ENVÍO 
    try {
        const r = await fetch(`${API_URL}/empresas/${empresaId}/modificar_rol`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: empleadoSeleccionado.id,
                nuevo_rol: nuevoRol
            })
        });

        if (!r.ok) throw new Error("Error al actualizar rol");

        alert("✔ Rol actualizado correctamente.");

        modalCambiarRol.classList.remove("show");

        // Recarga lista 
        cargarDesdeBackend();

    } catch (err) {
        console.error(err);
        alert("No se pudo conectar al servidor.");
    }
});

// ====================================================
// MODAL ELIMINAR EMPLEADO
// ====================================================

const modalEliminarEmpleado = document.getElementById("modalEliminarEmpleado");
const textoEliminar = document.getElementById("textoEliminar");

const btnCancelarEliminar = document.getElementById("btnCancelarEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

let empleadoAEliminar = null;

// ABRIR MODAL
function abrirModalEliminar(emp, rolUsuario) {

    if (rolUsuario === "empleado") {
        return alert("No tienes permisos para eliminar miembros.");
    }

    if (emp.rol === "propietario") {
        return alert("No podés eliminar al propietario.");
    }

    empleadoAEliminar = emp;

    textoEliminar.textContent = `¿Eliminar a ${emp.apellido}, ${emp.nombre}?`;

    modalEliminarEmpleado.classList.add("show");
}


// CERRAR MODAL
btnCancelarEliminar.onclick = () => {
    modalEliminarEmpleado.classList.remove("show");
};


// CONFIRMAR ELIMINACIÓN
btnConfirmarEliminar.onclick = async () => {

    if (!empleadoAEliminar) return;

    // MODO MOCK
    if (!USE_BACKEND) {
        alert(`(MODO MOCK)\nEmpleado eliminado: ${empleadoAEliminar.nombre}`);
        modalEliminarEmpleado.classList.remove("show");
        return;
    }

    // BACKEND MiTurno
    try {

        const body = {
            usuario_id: empleadoAEliminar.id
        };

        const r = await fetch(`${API_URL}/empresas/${empresaId}/eliminar_miembro`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!r.ok) {
            const err = await r.json();
            alert(err.detail || "Error al eliminar.");
            return;
        }

        alert("✔ Empleado eliminado correctamente.");

        modalEliminarEmpleado.classList.remove("show");

        cargarDesdeBackend();

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar al servidor.");
    }
};