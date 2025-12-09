// MOCK 

const MOCK = [
    {
        id: 1,
        usuario_nombre: "Juan",
        usuario_apellido: "Pérez",
        usuario_dni: "13245678",
        fecha_hora: "2024-04-15T16:00",
        estado_turno: "cumplido",
        nombre_de_servicio: "Corte de Pelo",
        duracion: "45 min",
        precio: 3500,
        profesional_nombre: "Laura",
        profesional_apellido: "Gómez",
        profesional_dni: "22456789"
    },
    {
        id: 2,
        usuario_nombre: "María",
        usuario_apellido: "López",
        usuario_dni: "98765432",
        fecha_hora: "2024-04-16T11:30",
        estado_turno: "cancelado",
        nombre_de_servicio: "Coloración",
        duracion: "90 min",
        precio: 9000,
        profesional_nombre: null,
        profesional_apellido: null,
        profesional_dni: null
    }
];


// REFERENCIAS DOM

const lista = document.getElementById("listaHistorial");
const modal = document.getElementById("modalDetalle");
const cerrarBtn = document.getElementById("btnCerrarDetalle");

const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");
const filtroProfesional = document.getElementById("filtroProfesional");


// FORMATEO DE ESTADOS

function formatoEstado(estado) {
    switch (estado) {
        case "cumplido": return "Cumplido";
        case "no_cumplido": return "No cumplido";
        case "cancelado": return "Cancelado";
        case "confirmado": return "Confirmado";
        default: return estado;
    }
}


// GENERA LISTA DE PROFESIONALES

function cargarProfesionales() {
    const profesionalesUnicos = new Set();

    MOCK.forEach(t => {
        if (t.profesional_nombre) {
            profesionalesUnicos.add(
                `${t.profesional_nombre} ${t.profesional_apellido}`
            );
        }
    });

    profesionalesUnicos.forEach(nombre => {
        const option = document.createElement("option");
        option.value = nombre;
        option.textContent = nombre;
        filtroProfesional.appendChild(option);
    });
}


// RENDERIZA CARDS

function cargarHistorial(data) {
    lista.innerHTML = "";

    data.forEach(t => {
        const fecha = new Date(t.fecha_hora);
        const fechaStr = fecha.toLocaleDateString();
        const horaStr = fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const card = document.createElement("div");
        card.className = `turno-card ${t.estado_turno}`;

        card.innerHTML = `
    <!-- HEADER: NOMBRE + ESTADO -->
    <div class="turno-header">
        <span class="cliente-nombre"><strong>${t.usuario_apellido}, ${t.usuario_nombre}</strong></span>
        <span class="badge ${t.estado_turno}">
            ${formatoEstado(t.estado_turno)}
        </span>
    </div>

    <!-- DNI -->
    <div class="turno-dato">
        <strong>DNI:</strong> ${t.usuario_dni}
    </div>

    <!-- FECHA + HORA -->
    <div class="turno-dato">
        <strong>Fecha:</strong> ${fechaStr}  
        <strong>Hora:</strong> ${horaStr}
    </div>

    <!-- SERVICIO -->
    <div class="turno-dato">
        <strong>Servicio:</strong> ${t.nombre_de_servicio}
    </div>

    <button class="btn-detalle" data-id="${t.id}">Ver detalle</button>
`;


        lista.appendChild(card);
    });

    // abrir modal
    document.querySelectorAll(".btn-detalle").forEach(btn => {
        btn.addEventListener("click", () => {
            const turno = MOCK.find(t => t.id == btn.dataset.id);
            abrirModal(turno);
        });
    });
}


// FILTROS

function aplicarFiltros() {
    let filtrado = [...MOCK];

    // FILTRO POR FECHA
    const f = filtroFecha.value;
    if (f) filtrado = filtrado.filter(t => t.fecha_hora.startsWith(f));

    // FILTRO POR ESTADO
    const est = filtroEstado.value;
    if (est) filtrado = filtrado.filter(t => t.estado_turno === est);

    // FILTRO POR PROFESIONAL
    const prof = filtroProfesional.value;
    if (prof) {
        filtrado = filtrado.filter(t => {
            const nombreCompleto = t.profesional_nombre
                ? `${t.profesional_nombre} ${t.profesional_apellido}`
                : "";
            return nombreCompleto === prof;
        });
    }

    cargarHistorial(filtrado);
}


// MODAL

function abrirModal(t) {
    const fecha = new Date(t.fecha_hora);

    // CLIENTE
    document.getElementById("detalleCliente").innerText =
        `${t.usuario_apellido}, ${t.usuario_nombre}`;

    document.getElementById("detalleDniCliente").innerText =
        t.usuario_dni ?? "—";

    // FECHA / HORA
    document.getElementById("detalleFecha").innerText =
        fecha.toLocaleDateString();

    document.getElementById("detalleHora").innerText =
        fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // SERVICIO
    document.getElementById("detalleServicio").innerText = t.nombre_de_servicio;
    document.getElementById("detalleDuracion").innerText = t.duracion;
    document.getElementById("detallePrecio").innerText = `$${t.precio}`;



    // PROFESIONAL
    document.getElementById("detalleProfesional").innerText =
        t.profesional_nombre
            ? `${t.profesional_apellido}, ${t.profesional_nombre}`
            : "No asignado";

    document.getElementById("detalleDniProfesional").innerText =
        t.profesional_dni ?? "—";

    // ESTADO badge 
    const estadoElem = document.getElementById("detalleEstado");
    estadoElem.innerText = formatoEstado(t.estado_turno);
    estadoElem.className = `badge-modal ${t.estado_turno}`;

    modal.classList.add("show");
}


cerrarBtn.addEventListener("click", () => modal.classList.remove("show"));


// INICIALIZACIÓN

cargarProfesionales();
cargarHistorial(MOCK);

filtroFecha.addEventListener("change", aplicarFiltros);
filtroEstado.addEventListener("change", aplicarFiltros);
filtroProfesional.addEventListener("change", aplicarFiltros);
