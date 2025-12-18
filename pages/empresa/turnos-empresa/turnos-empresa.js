const USE_BACKEND = false;
const API_URL = "http://localhost:8000";
const empresaId = 1;

/* =========================
   ELEMENTOS DOM
========================= */
const listaTurnos = document.getElementById("listaTurnos");

const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");
const filtroProfesional = document.getElementById("filtroProfesional");

const modalTurno = document.getElementById("modalTurno");

const mCliente = document.getElementById("mCliente");
const mDni = document.getElementById("mDni");
const mFecha = document.getElementById("mFecha");
const mHora = document.getElementById("mHora");
const mServicio = document.getElementById("mServicio");
const mDuracion = document.getElementById("mDuracion");
const mPrecio = document.getElementById("mPrecio");
const mAclaracion = document.getElementById("mAclaracion");
const mProfesional = document.getElementById("mProfesional");
const mProfesionalDni = document.getElementById("mProfesionalDni");

const btnCumplido = document.getElementById("btnCumplido");
const btnNoCumplido = document.getElementById("btnNoCumplido");
const btnCancelarTurno = document.getElementById("btnCancelarTurno");
const btnEliminarTurno = document.getElementById("btnEliminarTurno");
const btnCerrarModal = document.getElementById("btnCerrarModal");

btnCerrarModal.onclick = () => modalTurno.classList.remove("show");

let turnoSeleccionado = null;

/* =========================
   MOCK INICIAL
========================= */
const turnosMock = [
    {
        id: 1,
        usuario_nombre: "Mora",
        usuario_apellido: "Gómez",
        usuario_dni: 30222111,
        fecha_hora: "2025-02-05T15:30",
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
        fecha_hora: "2025-02-06T17:00",
        nombre_de_servicio: "Corte de pelo",
        duracion: 45,
        precio: 4000,
        aclaracion_de_servicio: null,
        profesional_nombre: null,
        profesional_apellido: null,
        profesional_dni: null,
        estado_turno: "cumplido"
    },

        {
        id: 3,
        usuario_nombre: "Laura",
        usuario_apellido: "Gómez",
        usuario_dni: 30222211,
        fecha_hora: "2025-02-05T15:30",
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
        id: 4,
        usuario_nombre: "Laura",
        usuario_apellido: "Gómez",
        usuario_dni: 30222111,
        fecha_hora: "2025-02-08T15:30",
        nombre_de_servicio: "Manicura completa",
        duracion: 60,
        precio: 6000,
        aclaracion_de_servicio: "Incluye esmalte",
        profesional_nombre: "María",
        profesional_apellido: "Ruiz",
        profesional_dni: 25000888,
        estado_turno: "no_cumplido"
    },

        {
        id: 5,
        usuario_nombre: "Laura",
        usuario_apellido: "Esquivel",
        usuario_dni: 33222111,
        fecha_hora: "2025-02-10T15:30",
        nombre_de_servicio: "Manicura completa",
        duracion: 60,
        precio: 6000,
        aclaracion_de_servicio: "Incluye diseño floral",
        profesional_nombre: "María",
        profesional_apellido: "Bosh",
        profesional_dni: 25100888,
        estado_turno: "cancelado"
    }

    
];

/* =========================
   STORAGE 
========================= */
const storageActivos = JSON.parse(
    localStorage.getItem("turnosEmpresaActivos")
);

let turnosEmpresaActivos =
    storageActivos && storageActivos.length > 0
        ? storageActivos
        : turnosMock;

let turnosEmpresaHistorial =
    JSON.parse(localStorage.getItem("turnosEmpresaHistorial")) || [];

/* =========================
   HELPERS
========================= */
function formatEstado(e) {
    return e.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
}

function formatFecha(fechaISO) {
    const f = new Date(fechaISO);
    if (isNaN(f)) return "—";
    return `${String(f.getDate()).padStart(2, "0")}/${String(f.getMonth() + 1).padStart(2, "0")}/${f.getFullYear()}`;
}

function formatHora(fechaISO) {
    const f = new Date(fechaISO);
    if (isNaN(f)) return "—";
    return `${String(f.getHours()).padStart(2, "0")}:${String(f.getMinutes()).padStart(2, "0")}`;
}

/* =========================
   STORAGE
========================= */
function guardarStorage() {
    localStorage.setItem(
        "turnosEmpresaActivos",
        JSON.stringify(turnosEmpresaActivos)
    );
    localStorage.setItem(
        "turnosEmpresaHistorial",
        JSON.stringify(turnosEmpresaHistorial)
    );
}

/* =========================
   RENDER
========================= */
function renderTurnos(lista) {
    listaTurnos.innerHTML = "";

    lista.forEach(t => {
        const card = document.createElement("div");
        card.className = `turno-card ${t.estado_turno}`;

        card.innerHTML = `
            <div class="turno-header">
                <span>${t.usuario_apellido}, ${t.usuario_nombre}</span>
                <span class="badge ${t.estado_turno}">
                    ${formatEstado(t.estado_turno)}
                </span>
            </div>

            <div class="turno-dato"><b>DNI:</b> ${t.usuario_dni}</div>
            <div class="turno-dato">
                <b>Fecha:</b> ${formatFecha(t.fecha_hora)}
                <b>Hora:</b> ${formatHora(t.fecha_hora)}
            </div>
            <div class="turno-dato"><b>Servicio:</b> ${t.nombre_de_servicio}</div>

            <button class="btn-detalle">Ver detalle</button>
        `;

        card.querySelector(".btn-detalle").onclick = () =>
            abrirModalDetalle(t);

        listaTurnos.appendChild(card);
    });
}

/* =========================
   FILTROS
========================= */
function aplicarFiltros() {
    let lista = [...turnosEmpresaActivos];

    if (filtroFecha.value) {
        lista = lista.filter(t =>
            t.fecha_hora.startsWith(filtroFecha.value)
        );
    }

    if (filtroEstado.value) {
        lista = lista.filter(t =>
            t.estado_turno === filtroEstado.value
        );
    }

    if (filtroProfesional.value) {
        lista = lista.filter(t => {
            const nombre = t.profesional_nombre
                ? `${t.profesional_nombre} ${t.profesional_apellido}`
                : "Sin asignar";
            return nombre === filtroProfesional.value;
        });
    }

    renderTurnos(lista);
}

[filtroFecha, filtroEstado, filtroProfesional]
    .forEach(el => el.onchange = aplicarFiltros);

/* =========================
   FILTRO PROFESIONAL
========================= */
function cargarFiltroProfesional(lista) {
    const set = new Set();

    lista.forEach(t => {
        if (t.profesional_nombre) {
            set.add(`${t.profesional_nombre} ${t.profesional_apellido}`);
        } else {
            set.add("Sin asignar");
        }
    });

    filtroProfesional.innerHTML =
        `<option value="">Todos los profesionales</option>`;

    set.forEach(n =>
        filtroProfesional.innerHTML += `<option value="${n}">${n}</option>`
    );
}

/* =========================
   MODAL
========================= */
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

    // 🔒 mostrar eliminar SOLO si NO es confirmado
    if (turno.estado_turno === "confirmado") {
        btnEliminarTurno.style.display = "none";
    } else {
        btnEliminarTurno.style.display = "inline-block";
    }

    modalTurno.classList.add("show");
}

/* =========================
   CAMBIO DE ESTADO
========================= */
btnCumplido.onclick = () => cambiarEstado("cumplido");
btnNoCumplido.onclick = () => cambiarEstado("no_cumplido");
btnCancelarTurno.onclick = () => cambiarEstado("cancelado");

function cambiarEstado(nuevoEstado) {
    if (!turnoSeleccionado) return;

    turnoSeleccionado.estado_turno = nuevoEstado;

    guardarStorage();
    modalTurno.classList.remove("show");
    aplicarFiltros();
}

/* =========================
   ELIMINAR TURNO
========================= */
btnEliminarTurno.onclick = () => {
    if (!turnoSeleccionado) return;

    if (turnoSeleccionado.estado_turno === "confirmado") {
        return;
    }

    // NO se cambia el estado
    turnosEmpresaActivos = turnosEmpresaActivos.filter(
        t => t.id !== turnoSeleccionado.id
    );

    turnosEmpresaHistorial.push(turnoSeleccionado);

    guardarStorage();

    modalTurno.classList.remove("show");
    aplicarFiltros();
};

/* =========================
   INIT
========================= */
cargarFiltroProfesional(turnosEmpresaActivos);
aplicarFiltros();
