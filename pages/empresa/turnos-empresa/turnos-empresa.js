const USE_BACKEND = false;
const API_URL = "http://localhost:8000";
const empresaId = 1;


// ========== ELEMENTOS ==========
const listaTurnos = document.getElementById("listaTurnos");

const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");
const filtroProfesional = document.getElementById("filtroProfesional");

const modalTurno = document.getElementById("modalTurno");

// Campos modal
const mCliente = document.getElementById("mCliente");
const mDni = document.getElementById("mDni");
const mFecha = document.getElementById("mFecha");
const mHora = document.getElementById("mHora");
const mServicio = document.getElementById("mServicio");
const mDuracion = document.getElementById("mDuracion");
const mPrecio = document.getElementById("mPrecio");
const mAclaracion = document.getElementById("mAclaracion");
const mProfesional = document.getElementById("mProfesional");
const mEstado = document.getElementById("mEstado");

document.getElementById("btnCerrarModal").onclick = () => modalTurno.classList.remove("show");
const btnCumplido = document.getElementById("btnCumplido");
const btnNoCumplido = document.getElementById("btnNoCumplido");
const btnCancelarTurno = document.getElementById("btnCancelarTurno");

let turnoSeleccionado = null;


// ========== MOCK DATA ==========
let turnosMock = [
    {
        id: 1,
        usuario_nombre: "Laura",
        usuario_apellido: "Gómez",
        usuario_dni: 30222111,
        fecha_hora: "2025/02/05T15:30:00",
        nombre_de_servicio: "Manicura completa",
        duracion: 60,
        precio: 6000,
        aclaracion_de_servicio: "Incluye esmalte tradicional",
        profesional_nombre: "María",
        profesional_apellido: "Ruiz",
        profesional_dni: 25000888,
        estado_turno: "confirmado"
    },
    {
        id: 2,
        usuario_nombre: "Julián",
        usuario_apellido: "Moreno",
        usuario_dni: 29888666,
        fecha_hora: "2025/02/06T17:00:00",
        nombre_de_servicio: "Corte de pelo",
        duracion: 45,
        precio: 4000,
        aclaracion_de_servicio: null,
        profesional_nombre: null,
        profesional_apellido: null,
        profesional_dni: null,
        estado_turno: "confirmado"
    }
];


// ========== HELPERS ==========
function formatEstado(e) {
    if (!e) return "";
    return e.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
}

function formatFecha(fechaISO) {

    const normalizada = fechaISO.replace(/\//g, "-");
    const fecha = new Date(normalizada);

    if (isNaN(fecha)) return "—";

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();

    return `${dia}/${mes}/${año}`;
}

function formatHora(fechaISO) {
    const normalizada = fechaISO.replace(/\//g, "-");
    const fecha = new Date(normalizada);

    if (isNaN(fecha)) return "—";

    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${horas}:${minutos}`;
}


// ========== RENDER ==========
function renderTurnos(lista) {
    listaTurnos.innerHTML = "";

    lista.forEach(t => {
        const div = document.createElement("div");

        div.className = `turno-card ${t.estado_turno}`;

        div.innerHTML = `
            <div class="turno-header">
                <span>${t.usuario_apellido}, ${t.usuario_nombre}</span>
                <span class="badge ${t.estado_turno}">${formatEstado(t.estado_turno)}</span>
            </div>

            <div class="turno-dato"><b>DNI:</b> ${t.usuario_dni}</div>
            <div class="turno-dato"><b>Fecha:</b> ${formatFecha(t.fecha_hora)}   <b>Hora:</b> ${formatHora(t.fecha_hora)}</div>
            <div class="turno-dato"><b>Servicio:</b> ${t.nombre_de_servicio}</div>

            <div class="turno-botones">
                <button class="btn-detalle">Ver detalle</button>
            </div>
        `;

        div.querySelector(".btn-detalle").onclick = () => abrirModalDetalle(t);

        listaTurnos.appendChild(div);
    });


}


// ========== FILTROS ==========
function aplicarFiltros() {
    let lista = [...turnosMock];

    if (filtroFecha.value) {
        lista = lista.filter(t => {
            const normalizada = t.fecha_hora.replace(/\//g, "-");
            return normalizada.startsWith(filtroFecha.value);
        });
    }

    if (filtroEstado.value) {
        lista = lista.filter(t => t.estado_turno === filtroEstado.value);
    }

    if (filtroProfesional.value) {
        lista = lista.filter(t => {
            const nombre = t.profesional_nombre && t.profesional_apellido
                ? `${t.profesional_nombre} ${t.profesional_apellido}`
                : "Sin asignar";

            return nombre === filtroProfesional.value;
        });
    }

    renderTurnos(lista);
}

[filtroFecha, filtroEstado, filtroProfesional].forEach(el => {
    el.onchange = aplicarFiltros;
});


// ========== CARGAR PROFESIONALES ==========
function cargarFiltroProfesional(lista) {
    const unicos = new Set();

    lista.forEach(t => {
        if (t.profesional_nombre && t.profesional_apellido) {
            unicos.add(`${t.profesional_nombre} ${t.profesional_apellido}`);
        } else {
            unicos.add("Sin asignar");
        }
    });

    filtroProfesional.innerHTML = `
        <option value="">Todos los profesionales</option>
    `;

    unicos.forEach(nombre => {
        filtroProfesional.innerHTML += `
            <option value="${nombre}">${nombre}</option>
        `;
    });
}


// ========== MODAL DETALLE ==========
function abrirModalDetalle(turno) {
    turnoSeleccionado = turno;

    mCliente.textContent = `${turno.usuario_apellido}, ${turno.usuario_nombre}`;
    mDni.textContent = turno.usuario_dni;

    mFecha.textContent = formatFecha(turno.fecha_hora);
    mHora.textContent = formatHora(turno.fecha_hora);

    mServicio.textContent = turno.nombre_de_servicio;
    mDuracion.textContent = turno.duracion + " min";
    mPrecio.textContent = "$" + turno.precio;
    mAclaracion.textContent = turno.aclaracion_de_servicio || "—";

    mProfesional.textContent =
        turno.profesional_nombre
            ? `${turno.profesional_apellido}, ${turno.profesional_nombre}`
            : "No asignado";

    mProfesionalDni.textContent = turno.profesional_dni ?? "—";

    const estadoBadge = document.getElementById("mEstadoBadge");
    estadoBadge.textContent = formatEstado(turno.estado_turno);
    estadoBadge.className = `badge-modal ${turno.estado_turno}`;

    modalTurno.classList.add("show");
}


// ========== ESTADO ==========
btnCumplido.onclick = () => cambiarEstado("cumplido");
btnNoCumplido.onclick = () => cambiarEstado("no_cumplido");
btnCancelarTurno.onclick = () => cambiarEstado("cancelado");

function cambiarEstado(nuevoEstado) {
    if (!turnoSeleccionado) return;

    if (!USE_BACKEND) {
        turnoSeleccionado.estado_turno = nuevoEstado;
        modalTurno.classList.remove("show");
        renderTurnos(turnosMock);
        return;
    }

    alert("Conectar con backend MiTurno");
}


// ========== INICIO ==========
renderTurnos(turnosMock);
cargarFiltroProfesional(turnosMock); 
