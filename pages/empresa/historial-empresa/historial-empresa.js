// ========== MOCK ==========
const MOCK_HISTORIAL = [
    {
        id: 1,
        usuario_nombre: "Juan",
        usuario_apellido: "Pérez",
        usuario_dni: "12345678",
        fecha_hora: "2024-04-15T16:00",
        estado_turno: "cumplido",
        nombre_de_servicio: "Corte de Pelo",
        duracion: 45,
        precio: 3000,
        aclaracion_de_servicio: "Corte clásico.",
        profesional_nombre: "Laura",
        profesional_apellido: "Gómez"
    },
    {
        id: 2,
        usuario_nombre: "María",
        usuario_apellido: "Lopez",
        usuario_dni: "87654321",
        fecha_hora: "2024-04-14T11:30",
        estado_turno: "cancelado",
        nombre_de_servicio: "Manicura",
        duracion: 60,
        precio: 3500,
        aclaracion_de_servicio: "",
        profesional_nombre: null
    }
];

let historialActual = [...MOCK_HISTORIAL];

// ========== RENDER ==========
function cargarHistorial() {
    const contenedor = document.getElementById("listaHistorial");
    contenedor.innerHTML = "";

    historialActual.forEach(turno => {

        const card = document.createElement("div");
        card.className = "turno-card";

        const header = document.createElement("div");
        header.className = "turno-header";

        const nombre = `${turno.usuario_nombre} ${turno.usuario_apellido}`;
        const badgeClass = `badge ${turno.estado_turno}`;

        header.innerHTML = `
            <span>${nombre}</span>
            <span class="${badgeClass}">${formatoEstado(turno.estado_turno)}</span>
        `;

        const fecha = new Date(turno.fecha_hora);
        const fechaForm = fecha.toLocaleDateString();
        const horaForm = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const datos = `
            <div class="turno-dato"><b>Fecha:</b> ${fechaForm}</div>
            <div class="turno-dato"><b>Hora:</b> ${horaForm}</div>
            <div class="turno-dato"><b>Servicio:</b> ${turno.nombre_de_servicio}</div>
        `;

        const detalleBtn = document.createElement("button");
        detalleBtn.className = "btn-detalle";
        detalleBtn.innerText = "Ver detalle";
        detalleBtn.onclick = () => abrirModal(turno);

        card.appendChild(header);
        card.innerHTML += datos;
        card.appendChild(detalleBtn);
        contenedor.appendChild(card);
    });
}

// ========== ESTADOS ==========
function formatoEstado(e) {
    return e
        .replace("_", " ")
        .replace("cancelado", "Cancelado")
        .replace("cumplido", "Cumplido")
        .replace("no cumplido", "No cumplido");
}

// ========== MODAL ==========
const modal = document.getElementById("modalOverlay");
document.getElementById("cerrarModal").onclick = () => modal.classList.remove("show");

function abrirModal(t) {
    modal.classList.add("show");

    const fecha = new Date(t.fecha_hora);
    document.getElementById("modalNombre").innerText = `${t.usuario_nombre} ${t.usuario_apellido}`;
    document.getElementById("modalDni").innerText = t.usuario_dni;
    document.getElementById("modalFecha").innerText = fecha.toLocaleDateString();
    document.getElementById("modalHora").innerText = fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById("modalServicio").innerText = t.nombre_de_servicio;
    document.getElementById("modalDuracion").innerText = t.duracion;
    document.getElementById("modalPrecio").innerText = t.precio;
    document.getElementById("modalAclaracion").innerText = t.aclaracion_de_servicio || "Sin aclaraciones";

    const prof = t.profesional_nombre
        ? `${t.profesional_nombre} ${t.profesional_apellido}`
        : "Sin profesional asignado";
    document.getElementById("modalProfesional").innerText = prof;
}

// ========== INICIO ==========
cargarHistorial();
