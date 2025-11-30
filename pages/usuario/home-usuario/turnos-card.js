// ========================================
//        DATOS DE EJEMPLO - TURNOS
// ========================================
const datosTurnos = [
    {
        id: 1,
        hora: '10:30',
        fecha: 'Sábado, 29 de Noviembre',
        tiempoRestante: 'Faltan 4 días y 2 horas',
        estado: 'confirmado',
        servicio: 'Corte de Cabello',
        empresa: 'Studio de Belleza Premium',
        ubicacion: 'Av. Principal 123',
        profesional: 'Lucía Giménez',
        duracion: '1:00 hs',
        precio: '$3500',
        detallesCita: 'Llegar 10 minutos antes para la consulta. Se recomienda cabello seco.',
        linkMaps: 'https://maps.app.goo.gl/EjemploStudio1'
    },
    {
        id: 2,
        hora: '14:00',
        fecha: 'Miércoles, 29 de Enero',
        tiempoRestante: 'Faltan 6 días y 4 horas',
        estado: 'cancelado-usuario',
        servicio: 'Coloración',
        empresa: 'Salón de Belleza Centro',
        ubicacion: 'Calle Mayor 456',
        profesional: 'Martín López',
        duracion: '2:30 hs',
        precio: '$5000',
        detallesCita: 'Traer imágenes de referencia para el color deseado.',
        linkMaps: 'https://maps.app.goo.gl/EjemploSalon2'
    },
    {
        id: 3,
        hora: '09:15',
        fecha: 'Martes, 21 de Enero',
        tiempoRestante: 'Hace 3 días',
        estado: 'cumplido',
        servicio: 'Limpieza Facial',
        empresa: 'Centro Estético Deluxe',
        ubicacion: 'Paseo del Centro 789',
        profesional: 'Andrea Ruiz',
        duracion: '0:45 hs',
        precio: '$4000',
        detallesCita: 'No aplicar cremas o maquillaje antes de la limpieza.',
        linkMaps: 'https://maps.app.goo.gl/EjemploCentro3'
    },
    {
        id: 4,
        hora: '15:45',
        fecha: 'Jueves, 23 de Enero',
        tiempoRestante: 'Hace 1 día',
        estado: 'cancelado-empresa',
        servicio: 'Manicura',
        empresa: 'Nails & Beauty Studio',
        ubicacion: 'Calle Nueva 321',
        profesional: 'Sofía Díaz',
        duracion: '1:15 hs',
        precio: '$3200',
        detallesCita: 'El servicio incluye esmaltado semipermanente. Traer uñas sin esmalte previo.',
        linkMaps: 'https://maps.app.goo.gl/EjemploNails4'
    },
    {
        id: 5,
        hora: '11:00',
        fecha: 'Domingo, 19 de Enero',
        tiempoRestante: 'Hace 5 días',
        estado: 'no-cumplido',
        servicio: 'Pedicura',
        empresa: 'Spa Relax Center',
        ubicacion: 'Av. Spa 654',
        profesional: 'Paula Vega',
        duracion: '1:00 hs',
        precio: '$2800',
        detallesCita: 'Usar ropa cómoda. Hay batas disponibles.',
        linkMaps: 'https://maps.app.goo.gl/EjemploSpa5'
    },
    {
        id: 6,
        hora: '16:30',
        fecha: 'Sábado, 18 de Enero',
        tiempoRestante: 'Hace 6 días',
        estado: 'confirmado',
        servicio: 'Masaje Relajante',
        empresa: 'Wellness Pro Spa',
        ubicacion: 'Carrera Bienestar 987',
        profesional: 'Juan Pérez',
        duracion: '0:50 hs',
        precio: '$4500',
        detallesCita: 'Se ofrece té de cortesía al finalizar el masaje. No cenar pesado antes.',
        linkMaps: 'https://maps.app.goo.gl/EjemploWellness6'
    }
];

// ========================================
//         CONFIGURACIÓN DE ESTADOS
// ========================================
const configuracionEstado = {
    confirmado: { label: 'Confirmado', class: 'status-confirmado' },
    cumplido: { label: 'Cumplido', class: 'status-cumplido' },
    'no-cumplido': { label: 'No cumplido', class: 'status-no-cumplido' },
    'cancelado-usuario': { label: 'Cancelado por usuario', class: 'status-cancelado-usuario' },
    'cancelado-empresa': { label: 'Cancelado por empresa', class: 'status-cancelado-empresa' }
};

// ========================================
//       ESTADO GLOBAL
// ========================================
let estadoApp = {
    filtroActivo: 'todos',
    busqueda: ''
};

// ========================================
//     RENDERIZAR TARJETAS
// ========================================
function renderizarTarjetas() {
    const contenedor = document.getElementById('cardsContainer');
    if (!contenedor) return;

    contenedor.innerHTML = "";
    let turnos = datosTurnos;

    // búsqueda
    if (estadoApp.busqueda.trim()) {
        const b = estadoApp.busqueda.toLowerCase();
        turnos = turnos.filter(t =>
            t.servicio.toLowerCase().includes(b) ||
            t.empresa.toLowerCase().includes(b)
        );
    }

    if (turnos.length === 0) {
        contenedor.innerHTML = `<div style="text-align:center; padding:30px; color:#777;">No se encontraron turnos</div>`;
        return;
    }

    turnos.forEach(t => contenedor.appendChild(crearTarjeta(t)));
}

document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.getElementById('busquedaTurnos');
    const filtros = document.querySelectorAll('.filter-btn');

    inputBusqueda?.addEventListener('input', e => {
        estadoApp.busqueda = e.target.value;
        renderizarTarjetas();
    });

    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            estadoApp.filtroActivo = btn.dataset.filter;
            renderizarTarjetas();
        });
    });

    renderizarTarjetas();
});

// ========================================
//     CREAR TARJETA INDIVIDUAL
// ========================================
function crearTarjeta(turno) {
    const estado = configuracionEstado[turno.estado];

    const card = document.createElement("div");
    card.className = `card ${turno.estado}`;
    card.onclick = () => mostrarDetalleTurno(turno.id);

    card.innerHTML = `
        <div class="card-header-status">
            <span class="card-status ${estado.class}">${estado.label}</span>
        </div>

        <div class="card-header-main">
            <img src="../../img/icono-perfil.png" class="card-logo">
            <div class="card-header-info">
                <strong>${turno.empresa}</strong>
            </div>
        </div>

        <div class="card-time">${turno.hora}</div>

        <div class="card-date-block">
            <div class="card-date">${turno.fecha}</div>
            <div class="card-time-left">${turno.tiempoRestante}</div>
        </div>

        <div class="card-details">
            <div class="card-detail-label">Servicio</div>
            <div class="card-detail-value">${turno.servicio}</div>
        </div>

       <div class="card-footer">

          <a href="#" class="card-link" onclick="event.stopPropagation(); mostrarUbicacion('${turno.ubicacion}')">
           <i class="fas fa-map-marker-alt"></i> Ver Dirección
     </a>

       </div>
    `;

    return card;
}

// ========================================
//       MODAL → DETALLE DE TURNO
// ========================================
function mostrarDetalleTurno(id) {
    const turno = datosTurnos.find(t => t.id === id);
    const modal = document.getElementById("turnoDetailModal");
    const body = document.getElementById("modalBody");

    if (!turno) return;

    const estado = configuracionEstado[turno.estado];
    const precioMostrado = turno.precio || '—';

    // BOTONES SEGÚN ESTADO
    let botones = `
    <button class="btn-small btn-cumplido">Cumplido</button>
    <button class="btn-small btn-no-cumplido">No cumplido</button>
    <button class="btn-small btn-whatsapp">WhatsApp</button>
`;

    // Si está confirmado → mostrar Cancelar Turno
    if (turno.estado === "confirmado") {
        botones += `
    <button class="btn-cancelar-turno">Cancelar turno</button>
`;
    }

    // Si está cumplido / no cumplido / cancelado por usuario / cancelado por empresa → mostrar Eliminar turno
    if (['cumplido', 'no-cumplido', 'cancelado-usuario', 'cancelado-empresa'].includes(turno.estado)) {
        botones += `<button class="btn-small btn-eliminar">Eliminar turno</button>`;
    }

    body.innerHTML = `
    <div class="modal-right">
        <span class="modal-status ${estado.class}">${estado.label}</span>
    </div>
        <div class="modal-header-top">

            <div class="modal-logo-nombre">
          
                <img src="../../img/icono-perfil.png" class="modal-logo">
                <span class="modal-empresa">${turno.empresa}</span>  
            </div>
        </div>

        <div class="modal-row spacing">
            <i class="fas fa-clock"></i>
            <span>${turno.hora}</span>
            <span>${turno.fecha}</span>
        </div>

        <div class="modal-row">
            <i class="fas fa-hourglass-half"></i>
            <span>${turno.tiempoRestante}</span>
        </div>

        <div class="modal-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>${turno.ubicacion}</span>
            <a href="${turno.linkMaps}" target="_blank" class="modal-ver-direccion">Ver Dirección</a>
        </div>

        <div class="modal-row">
            <i class="fas fa-scissors"></i>
            <span>Servicio: ${turno.servicio}</span>
        </div>

        <div class="modal-row">
            <i class="fas fa-user-tie"></i>
            <span>Profesional: ${turno.profesional}</span>
        </div>

        <div class="modal-row">
            <i class="fas fa-hourglass"></i>
            <span>Duración: ${turno.duracion}</span>
        </div>

<div class="modal-row modal-precio-recordatorio">

    <div class="precio-left">
        <i class="fas fa-dollar-sign"></i>
        <span>Precio: ${precioMostrado}</span>
    </div>

    <div class="recordatorio-right" onclick="abrirRecordatorioOpciones(${turno.id})">
        <i class="fas fa-bell"></i>
        <span class="recordatorio-label">Configurar Recordatorio</span>
    </div>

</div>

        <p class="modal-detalle">${turno.detallesCita}</p>

        <div class="modal-buttons">
            ${botones}
        </div>
    `;

    // eventos
    body.querySelector(".btn-cumplido").onclick = () =>
        abrirModalCalificacion(id, "cumplido");

    body.querySelector(".btn-no-cumplido").onclick = () => {
        const turno = datosTurnos.find(t => t.id === id);
        if (!turno) return;

        turno.estado = "no-cumplido";

        cerrarDetalleTurno();
        renderizarTarjetas();
    };

    body.querySelector(".btn-whatsapp").onclick = () =>
        contactarWhatsapp(id);
    const btnCancelar = body.querySelector(".btn-cancelar-turno");
    if (btnCancelar) btnCancelar.onclick = () => cancelarTurnoConfirmado(id);

    const btnEliminar = body.querySelector(".btn-eliminar");
    if (btnEliminar) btnEliminar.onclick = () => eliminarTurno(id);

    modal.style.display = "flex";
}

function cerrarDetalleTurno() {
    document.getElementById("turnoDetailModal").style.display = "none";
}

// ========================================
//     CALIFICACIÓN (1 al 10)
// ========================================
let turnoCalificacionId = null;
let estadoCalificacionPendiente = null;
let calificacionSeleccionada = null;

function abrirModalCalificacion(id, estadoNuevo) {
    turnoCalificacionId = id;
    estadoCalificacionPendiente = estadoNuevo;
    calificacionSeleccionada = null;

    const cont = document.querySelector(".calificacion-numeros");
    cont.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement("button");
        btn.classList.add("cal-btn");
        btn.innerText = i;

        btn.onclick = () => {
            document.querySelectorAll(".cal-btn")
                .forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            calificacionSeleccionada = i;
        };

        cont.appendChild(btn);
    }

    document.getElementById("calificacionModal").style.display = "flex";
}

function guardarCalificacion() {
    if (!calificacionSeleccionada) {
        alert("Selecciona un puntaje antes de continuar.");
        return;
    }

    const turno = datosTurnos.find(t => t.id === turnoCalificacionId);
    if (!turno) return;

    turno.estado = estadoCalificacionPendiente;
    turno.calificacionUsuario = calificacionSeleccionada;

    cerrarCalificacion();
    cerrarDetalleTurno();
    renderizarTarjetas();

    alert("¡Gracias por tu calificación!");
}

function cerrarCalificacion() {
    document.getElementById("calificacionModal").style.display = "none";
}

// ========================================
//     CONTACTAR POR WHATSAPP
// ========================================
function contactarWhatsapp(id) {
    const turno = datosTurnos.find(t => t.id === id);
    if (!turno) return;

    const numero = "5491122334455";
    const mensaje = `Hola, tengo una consulta sobre mi turno de ${turno.servicio}.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
}

// ========================================
//     ELIMINAR TURNO → envia a historial
// ========================================
function eliminarTurno(id) {
    const index = datosTurnos.findIndex(t => t.id === id);
    if (index === -1) return;

    let historial = JSON.parse(localStorage.getItem("turnosHistorial")) || [];
    historial.push(datosTurnos[index]);
    localStorage.setItem("turnosHistorial", JSON.stringify(historial));

    datosTurnos.splice(index, 1);

    cerrarDetalleTurno();
    renderizarTarjetas();
}

// ========================================
//     MOSTRAR UBICACIÓN
// ========================================
function mostrarUbicacion(ubicacion) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`;
    window.open(url, "_blank");
}

// ========================================
//     RECORDATORIO
// ========================================
let turnoRecordatorioSeleccionado = null;

function abrirRecordatorioOpciones(id) {
    turnoRecordatorioSeleccionado = id;


    document.getElementById('recordatorioModal').style.display = 'flex';
}
function guardarRecordatorioNuevo() {
    const horas = parseInt(document.getElementById("horasRecordatorio").value);
    const minutos = parseInt(document.getElementById("minutosRecordatorio").value);

    // Validación correcta
    if (isNaN(horas) || horas < 0 || horas > 23) {
        alert("Las horas deben estar entre 0 y 23.");
        return;
    }

    if (minutos !== 0 && minutos !== 30) {
        alert("Solo se permite elegir 0 o 30 minutos.");
        return;
    }

    const turno = datosTurnos.find(t => t.id === turnoRecordatorioSeleccionado);
    if (!turno) return;

    let recordatorios = JSON.parse(localStorage.getItem("recordatoriosTurnos")) || [];

    recordatorios.push({
        turnoId: turno.id,
        metodo: "sms",
        horas,
        minutos,
        fechaTurno: turno.fecha,
        horaTurno: turno.hora
    });

    localStorage.setItem("recordatoriosTurnos", JSON.stringify(recordatorios));

    alert("Recordatorio configurado correctamente.");
    cerrarRecordatorio();
}

function cerrarRecordatorio() {
    document.getElementById("recordatorioModal").style.display = "none";
}

function cancelarTurnoConfirmado(id) {
    const turno = datosTurnos.find(t => t.id === id);
    if (!turno) return;

    turno.estado = "cancelado-usuario"; // CAMBIA EL ESTADO

    cerrarDetalleTurno();
    renderizarTarjetas();
}