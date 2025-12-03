const USE_BACKEND = false;
const API_URL = "http://localhost:8000";

const empresaId = 1; // Simulación 

// ELEMENTOS

const listaServicios = document.getElementById("listaServicios");

const modalServicio = document.getElementById("modalServicio");
const tituloModal = document.getElementById("tituloModal");

const servicioNombre = document.getElementById("servicioNombre");
const servicioDuracion = document.getElementById("servicioDuracion");
const servicioProfesional = document.getElementById("servicioProfesional");
const servicioPrecio = document.getElementById("servicioPrecio");
const servicioDias = document.getElementById("servicioDias");
const servicioHorario = document.getElementById("servicioHorario");
const servicioAclaracion = document.getElementById("servicioAclaracion");


const btnAbrirAgregar = document.getElementById("btnAbrirAgregar");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnGuardarModal = document.getElementById("btnGuardarModal");

const modalEliminar = document.getElementById("modalEliminar");
const textoEliminar = document.getElementById("textoEliminar");

const btnCancelarEliminar = document.getElementById("btnCancelarEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

let servicioEditando = null;
let servicioEliminando = null;


// =====================================================
// MOCK DATA
// =====================================================
let serviciosMock = [
    {
        id: 1,
        nombre: "Corte de pelo",
        duracion: 45,
        profesional: "María Gómez",
        precio: 4000,
        dias: "Lun - Vie",
        horario: "09:00 - 17:00"
    },
    {
        id: 2,
        nombre: "Coloración",
        duracion: 120,
        profesional: "Laura Ruiz",
        precio: 15000,
        dias: "Martes y Viernes",
        horario: "10:00 - 18:00"
    }
];


// =====================================================
// RENDERIZA SERVICIOS
// =====================================================
function renderServicios(lista) {
    listaServicios.innerHTML = "";

    lista.forEach(serv => {
        const div = document.createElement("div");
        div.className = "servicio-card";

        div.innerHTML = `
            <div class="servicio-titulo">${serv.nombre}</div>
            <div class="servicio-dato">Duración: ${serv.duracion} min</div>
            <div class="servicio-dato">Profesional: ${serv.profesional || "No asignado"}</div>
            <div class="servicio-dato">Precio: $${serv.precio}</div>
            <div class="servicio-dato">Días: ${serv.dias}</div>
            <div class="servicio-dato">Horario: ${serv.horario}</div>
            <div class="servicio-dato">Aclaración: ${serv.aclaracion || "—"}</div>

            

            <div class="servicio-acciones">
                <button class="btn-accion btn-editar">Editar</button>
                <button class="btn-accion btn-eliminar">Eliminar</button>
            </div>
        `;

        // eventos
        div.querySelector(".btn-editar").onclick = () => abrirModalEditar(serv);
        div.querySelector(".btn-eliminar").onclick = () => abrirModalEliminar(serv);

        listaServicios.appendChild(div);
    });
}


// =====================================================
// AGREGAR / EDITAR SERVICIO
// =====================================================
function abrirModalAgregar() {
    servicioEditando = null;

    tituloModal.textContent = "Agregar servicio";

    servicioNombre.value = "";
    servicioDuracion.value = "";
    servicioProfesional.value = "";
    servicioPrecio.value = "";
    servicioDias.value = "";
    servicioHorario.value = "";
    servicioAclaracion.value = "";


    modalServicio.classList.add("show");
}

function abrirModalEditar(serv) {
    servicioEditando = serv;

    tituloModal.textContent = "Editar servicio";

    servicioNombre.value = serv.nombre;
    servicioDuracion.value = serv.duracion;
    servicioProfesional.value = serv.profesional;
    servicioPrecio.value = serv.precio;
    servicioDias.value = serv.dias;
    servicioHorario.value = serv.horario;
    servicioAclaracion.value = serv.aclaracion || "";


    modalServicio.classList.add("show");
}

btnAbrirAgregar.onclick = abrirModalAgregar;
btnCancelarModal.onclick = () => modalServicio.classList.remove("show");

btnGuardarModal.onclick = async () => {
    const data = {
        nombre: servicioNombre.value,
        duracion: Number(servicioDuracion.value),
        profesional: servicioProfesional.value,
        precio: Number(servicioPrecio.value),
        dias: servicioDias.value,
        horario: servicioHorario.value,
        aclaracion: servicioAclaracion.value
    };


    // MOCK
    if (!USE_BACKEND) {
        if (servicioEditando) {
            Object.assign(servicioEditando, data);
        } else {
            data.id = Date.now();
            serviciosMock.push(data);
        }

        modalServicio.classList.remove("show");
        renderServicios(serviciosMock);
        return;
    }

    // BACKEND READY (cuando exista endpoint real)
    alert("Conectar a backend MiTurno");
};


// =====================================================
// ELIMINAR SERVICIO
// =====================================================
function abrirModalEliminar(serv) {
    servicioEliminando = serv;
    textoEliminar.textContent = `¿Eliminar "${serv.nombre}"?`;
    modalEliminar.classList.add("show");
}

btnCancelarEliminar.onclick = () => modalEliminar.classList.remove("show");

btnConfirmarEliminar.onclick = async () => {

    // MOCK
    if (!USE_BACKEND) {
        serviciosMock = serviciosMock.filter(s => s.id !== servicioEliminando.id);
        modalEliminar.classList.remove("show");
        renderServicios(serviciosMock);
        return;
    }

    // BACKEND READY
    alert("Conectar a backend MiTurno");
};


// =====================================================
// INICIO
// =====================================================
renderServicios(serviciosMock);
