/* === DATOS DE PRUEBA === */
const MOCK = [
    {
        id: 1,
        usuario_nombre: "Juan",
        usuario_apellido: "Pérez",
        usuario_dni: "12345678",
        fecha_hora: "2024-04-15T16:00",
        estado_turno: "cumplido",
        nombre_de_servicio: "Corte de Pelo",
        profesional_nombre: "Laura",
        profesional_apellido: "Gómez"
    },
    {
        id: 2,
        usuario_nombre: "María",
        usuario_apellido: "López",
        usuario_dni: "98765432",
        fecha_hora: "2024-04-16T11:30",
        estado_turno: "cancelado",
        nombre_de_servicio: "Coloración",
        profesional_nombre: null,
        profesional_apellido: null
    }
];

let historial = [...MOCK];

/* === FORMATO DE ESTADO === */
function formatoEstado(e) {
    if (!e) return "";
    return e.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
}

/* === RENDER === */
function render() {
    const cont = document.getElementById("listaHistorial");
    cont.innerHTML = "";

    historial.forEach(t => {
        const fecha = new Date(t.fecha_hora);
        const fechaForm = fecha.toLocaleDateString();
        const horaForm = fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const card = document.createElement("div");
        card.className = `turno-card ${t.estado_turno}`;

        card.innerHTML = `
            <div class="turno-header">
                <span>${t.usuario_nombre} ${t.usuario_apellido}</span>
                <span class="badge ${t.estado_turno}">${formatoEstado(t.estado_turno)}</span>
            </div>

            <div class="turno-dato"><b>Fecha:</b> ${fechaForm}</div>
            <div class="turno-dato"><b>Hora:</b> ${horaForm}</div>
            <div class="turno-dato"><b>Servicio:</b> ${t.nombre_de_servicio}</div>

            <button class="btn-detalle">Ver detalle</button>
        `;

        card.querySelector(".btn-detalle").onclick = () => abrirModal(t);

        cont.appendChild(card);
    });
}

/* === MODAL === */
const modal = document.getElementById("modalDetalle");
document.getElementById("btnCerrarDetalle").onclick = () => modal.classList.remove("show");

function abrirModal(t) {
    const fecha = new Date(t.fecha_hora);

    document.getElementById("detalleCliente").innerText =
        `${t.usuario_nombre} ${t.usuario_apellido}`;
    document.getElementById("detalleServicio").innerText = t.nombre_de_servicio;
    document.getElementById("detalleProfesional").innerText =
        t.profesional_nombre ? `${t.profesional_nombre} ${t.profesional_apellido}` : "Sin profesional";
    document.getElementById("detalleFecha").innerText = fecha.toLocaleDateString();
    document.getElementById("detalleHora").innerText =
        fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("detalleEstado").innerText = formatoEstado(t.estado_turno);

    modal.classList.add("show");
}

/* === FILTROS === */
document.getElementById("filtroFecha").onchange =
document.getElementById("filtroEstado").onchange = aplicarFiltros;

function aplicarFiltros() {
    const fFecha = document.getElementById("filtroFecha").value;
    const fEstado = document.getElementById("filtroEstado").value;

    historial = MOCK.filter(t => {
        const fechaTurno = t.fecha_hora.split("T")[0];

        const cumpleFecha = fFecha ? fechaTurno === fFecha : true;
        const cumpleEstado = fEstado ? t.estado_turno === fEstado : true;

        return cumpleFecha && cumpleEstado;
    });

    render();
}

/* === INICIO === */
render();
