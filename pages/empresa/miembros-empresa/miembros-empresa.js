const API_URL = "http://localhost:8000";
const USE_BACKEND = false;

let empresaId = localStorage.getItem("empresaSeleccionada") || 1;

// MOCK 
const MOCK_DATA = {
    rol: "propietario",
    miembros: [
        {
            id: 1, apellido: "García", nombre: "Lucía", dni: "38.123.456",
            email: "lucia.garcia@mail.com", rol: "gerente"
        },
        {
            id: 2, apellido: "López", nombre: "Marcos", dni: "41.987.222",
            email: "marcos.lopez@mail.com", rol: "empleado"
        },
        {
            id: 3, apellido: "Pérez", nombre: "Ana", dni: "37.555.120",
            email: "ana.perez@mail.com", rol: "empleado"
        }
    ]

};

// DOM
const listaEmpleados = document.getElementById("listaEmpleados");
const btnInvitar = document.getElementById("btnInvitar");


// INICIO
document.addEventListener("DOMContentLoaded", () => {
    if (USE_BACKEND) cargarDesdeBackend();
    else renderizar(MOCK_DATA);
});


// CARGA BACKEND
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
        alert("No se pudo conectar al backend. MODO MOCK.");
        renderizar(MOCK_DATA);
    }
}


// RENDER DE LISTA

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
            <span class="empleado-dato">DNI: ${emp.dni}</span>
            <span class="empleado-dato">Email: ${emp.email}</span>
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

        div.querySelector(".btn-rol").onclick = () => abrirModalCambiarRol(emp, rolUsuario);
        div.querySelector(".btn-eliminar").onclick = () => abrirModalEliminar(emp, rolUsuario);

        listaEmpleados.appendChild(div);
    });
}


// CONTROL PERMISOS

function controlarPermisos(rol) {

    // empleado — sin permiso de invitar
    if (rol === "empleado") {
        btnInvitar.classList.add("deshabilitado");
        btnInvitar.onclick = () => alert("No tienes permisos para invitar.");
    }

    // gerente — solo puede invitar “empleado”
    if (rol === "gerente") {
        const select = document.getElementById("selectRolInvitar");
        select.innerHTML = `<option value="empleado">Empleado</option>`;
    }
}


// MODAL INVITAR EMPLEADO

const modalInvitar = document.getElementById("modalInvitar");

const inputEmailInvitar = document.getElementById("inputEmailInvitar");
const selectRolInvitar = document.getElementById("selectRolInvitar");

document.getElementById("btnInvitar").onclick = () => modalInvitar.classList.add("show");
document.getElementById("btnCancelarInvitacion").onclick =
    () => modalInvitar.classList.remove("show");

document.getElementById("btnEnviarInvitacion").onclick = () => {

    const email = inputEmailInvitar.value.trim();
    const rolSel = selectRolInvitar.value;

    if (!email.includes("@")) {
        alert("Debe ingresar un email válido.");
        return;
    }

    alert(`Invitación MOCK enviada:\nEmail: ${email}\nRol: ${rolSel}`);

    modalInvitar.classList.remove("show");
    inputEmailInvitar.value = "";
};


// MODAL CAMBIAR ROL
const modalCambiarRol = document.getElementById("modalCambiarRol");

const cambiarRolNombre = document.getElementById("cambiarRolNombre");
const cambiarRolActual = document.getElementById("cambiarRolActual");
const cambiarRolNuevo = document.getElementById("cambiarRolNuevo");

let empleadoSeleccionado = null;

function abrirModalCambiarRol(emp, rolUsuario) {

    if (rolUsuario === "empleado")
        return alert("No tienes permisos para cambiar roles.");

    if (rolUsuario === "gerente")
        return alert("Un gerente no puede cambiar roles.");

    if (emp.rol === "propietario")
        return alert("No puedes modificar al propietario.");

    empleadoSeleccionado = emp;

    cambiarRolNombre.textContent = `${emp.apellido}, ${emp.nombre}`;
    cambiarRolActual.value = emp.rol;

    // propietario puede asignar todos los roles
    cambiarRolNuevo.innerHTML = `
        <option value="propietario">Propietario</option>
        <option value="gerente">Gerente</option>
        <option value="empleado">Empleado</option>
    `;

    cambiarRolNuevo.value = emp.rol;

    modalCambiarRol.classList.add("show");
}

document.getElementById("btnCancelarCambioRol").onclick =
    () => modalCambiarRol.classList.remove("show");

document.getElementById("btnGuardarCambioRol").onclick = () => {

    if (!empleadoSeleccionado) return;

    const nuevoRol = cambiarRolNuevo.value;

    // ACTUALIZAR MOCK Y RENDERIZAR
    empleadoSeleccionado.rol = nuevoRol;
    renderizar(MOCK_DATA);

    alert(`✔ Rol actualizado a: ${nuevoRol}`);

    modalCambiarRol.classList.remove("show");
};


// MODAL ELIMINAR EMPLEADO

const modalEliminar = document.getElementById("modalEliminarEmpleado");
const textoEliminar = document.getElementById("textoEliminar");

let empleadoAEliminar = null;

function abrirModalEliminar(emp, rolUsuario) {

    if (rolUsuario === "empleado")
        return alert("No tienes permisos para eliminar.");

    if (rolUsuario === "gerente" && emp.rol === "propietario")
        return alert("No podés eliminar al propietario.");

    empleadoAEliminar = emp;

    textoEliminar.textContent = `¿Eliminar a ${emp.apellido}, ${emp.nombre}?`;

    modalEliminar.classList.add("show");
}

document.getElementById("btnCancelarEliminar").onclick =
    () => modalEliminar.classList.remove("show");

document.getElementById("btnConfirmarEliminar").onclick = () => {

    // ELIMINAR DEL MOCK Y RERENDERIZAR
    MOCK_DATA.miembros = MOCK_DATA.miembros.filter(
        m => m.id !== empleadoAEliminar.id
    );

    renderizar(MOCK_DATA);

    alert(`Empleado eliminado: ${empleadoAEliminar.nombre}`);

    modalEliminar.classList.remove("show");
};
