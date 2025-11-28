// Datos de ejemplo - Turnos
const datosTurnos = [
    {
        id: 1,
        hora: '10:30',
        fecha: 'Lunes, 27 de Enero',
        tiempoRestante: 'Faltan 4 días y 2 horas',
        estado: 'confirmado',
        servicio: 'Corte de Cabello',
        empresa: 'Studio de Belleza Premium',
        ubicacion: 'Av. Principal 123',
        profesional: 'Lucía Giménez',
        duracion: '1:00 hs',
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
        detallesCita: 'Usar ropa cómoda. Hay batas disponibles.',
        linkMaps: 'https://maps.app.goo.gl/EjemploSpa5'
    },
    {
        id: 6,
        hora: '16:30',
        fecha: 'Sábado, 18 de Enero',
        tiempoRestante: 'Hace 6 días',
        estado: 'vencido',
        servicio: 'Masaje Relajante',
        empresa: 'Wellness Pro Spa',
        ubicacion: 'Carrera Bienestar 987',
        profesional: 'Juan Pérez',
        duracion: '0:50 hs',
        detallesCita: 'Se ofrece té de cortesía al finalizar el masaje. No cenar pesado antes.',
        linkMaps: 'https://maps.app.goo.gl/EjemploWellness6'
    }
];

// Estado de la aplicación
let estadoApp = {
    filtroActivo: 'todos',
    busqueda: ''
};

// Mapeo de estados para el filtro (se necesita para mostrar el nombre del estado)
const configuracionEstado = {
    confirmado: { label: 'Confirmado', class: 'status-confirmado' },
    'cancelado-usuario': { label: 'Cancelado por usuario', class: 'status-cancelado-usuario' },
    cumplido: { label: 'Cumplido', class: 'status-cumplido' },
    'no-cumplido': { label: 'No cumplido', class: 'status-no-cumplido' },
    vencido: { label: 'Vencido', class: 'status-vencido' },
    'cancelado-empresa': { label: 'Cancelado por empresa', class: 'status-cancelado-empresa' }
};

// Renderizar tarjetas
function renderizarTarjetas() {
    const contenedor = document.getElementById('cardsContainer'); 
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    let turnosFiltrados = datosTurnos;

    // Aplicar filtro de estado
    if (estadoApp.filtroActivo !== 'todos') {
        turnosFiltrados = turnosFiltrados.filter(turno => {
            if (estadoApp.filtroActivo === 'confirmados') {
                return turno.estado === 'confirmado';
            }
            
            // Los 'Pendientes' son los que todavía están activos y no confirmados (solo los de los mocks)
            if (estadoApp.filtroActivo === 'pendientes') {
                return ['vencido'].includes(turno.estado); // Usamos 'vencido' en el mock como próximo/pendiente
            }
            
            // Los 'Pasados' son todos los finalizados: cumplidos, no cumplidos o cancelados
            if (estadoApp.filtroActivo === 'pasados') {
                return ['cumplido', 'no-cumplido', 'cancelado-usuario', 'cancelado-empresa'].includes(turno.estado);
            }
            
            return true;
        });
    }

    // Aplicar búsqueda
    if (estadoApp.busqueda.trim()) {
        const busquedaLower = estadoApp.busqueda.toLowerCase();
        turnosFiltrados = turnosFiltrados.filter(turno => 
            turno.servicio.toLowerCase().includes(busquedaLower) ||
            turno.empresa.toLowerCase().includes(busquedaLower)
        );
    }

    // Renderizar cada tarjeta
    if (turnosFiltrados.length > 0) {
        turnosFiltrados.forEach(turno => {
            const tarjeta = crearTarjeta(turno);
            contenedor.appendChild(tarjeta);
        });
    } else {
        // Mostrar mensaje si no hay resultados
        const mensajeVacio = document.createElement('div');
        mensajeVacio.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: #999;';
        mensajeVacio.innerHTML = '<p>No se encontraron turnos con los criterios seleccionados</p>';
        contenedor.appendChild(mensajeVacio);
    }
}

// Tarjeta individual 
function crearTarjeta(turno) {
    const tarjeta = document.createElement('div');
    tarjeta.className = `card ${turno.estado}`;
    tarjeta.setAttribute('onclick', `mostrarDetalleTurno(${turno.id})`); 

    const estado = configuracionEstado[turno.estado];

    tarjeta.innerHTML = `
        <div class="card-header-top">
            <div class="card-time-info">
                <div class="card-time">${turno.hora}</div>
                <div class="card-date">${turno.fecha}</div>
            </div>
            <span class="card-status ${estado.class}">${estado.label}</span>
        </div>
        
        <div class="card-time-left">${turno.tiempoRestante}</div>

         <div class="card-details">
            <div class="card-detail-item">
                <div class="card-detail-label">Servicio</div>
                <div class="card-detail-value">${turno.servicio}</div>
            </div>
            
            <div class="card-detail-item">
                <div class="card-detail-label">Empresa</div>
                <div class="card-detail-value">${turno.empresa}</div>
            </div>
        </div>
        
        <div class="card-footer">
            <a href="#" class="card-link" onclick="event.stopPropagation(); return mostrarUbicacion('${turno.ubicacion}')">
                <i class="fas fa-map-marker-alt"></i>
                <span>Ver Dirección</span>
            </a>
        </div>
    `;

    return tarjeta;
}

// Inicialización de Eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos
    const inputBusqueda = document.getElementById('busquedaTurnos');
    const botonesFiltro = document.querySelectorAll('.filter-btn');

    // Evento: Búsqueda
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            estadoApp.busqueda = e.target.value;
            renderizarTarjetas();
        });
    }

    // Evento: Filtros
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            botonesFiltro.forEach(b => b.classList.remove('active'));
            
            // Añadir clase activa al botón clickeado
            btn.classList.add('active');
            
            // Actualizar filtro
            estadoApp.filtroActivo = btn.dataset.filter;
            renderizarTarjetas();
        });
    });
    
    // Inicializar la aplicación con todos los turnos
    renderizarTarjetas();
});


// Función: Mostrar dirección (simulación de Google Maps)
function mostrarUbicacion(ubicacion) {
    alert(`Dirección: ${ubicacion}\n\nEsta sería redirigida a Google Maps o similar.`);
    return false;
}


// FUNCIONES PARA DETALLE Y CANCELACIÓN

// Función: Abrir el modal de detalle del turno
function mostrarDetalleTurno(id) {
    const turno = datosTurnos.find(t => t.id === id);
    const modal = document.getElementById('turnoDetailModal');
    const modalBody = document.getElementById('modalBody');

    if (!turno || !modal || !modalBody) return;

    const estado = configuracionEstado[turno.estado];
    let botonCancelar = '';

    // Solo se muestra el botón de cancelar si el estado es 'confirmado'
    if (turno.estado === 'confirmado') {
        botonCancelar = `<button class="btn-cancelar-turno" onclick="cancelarTurno(${turno.id})">Cancelar Turno</button>`;
    }
    
    // Contenido detallado del modal
    modalBody.innerHTML = `
        <h3 class="detail-title">${turno.servicio} - ${turno.empresa}</h3>
        <div class="detail-status ${estado.class}">${estado.label}</div>
        
        <div class="detail-row">
            <i class="fas fa-clock"></i>
            <span>${turno.hora}, ${turno.fecha}</span>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-user-tie"></i>
            <span>Profesional: ${turno.profesional}</span>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-hourglass-half"></i>
            <span>Duración Estimada: ${turno.duracion}</span>
        </div>

        <div class="detail-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>Dirección: ${turno.ubicacion}</span>
            <a href="${turno.linkMaps}" target="_blank" class="detail-map-link">
                <i class="fas fa-external-link-alt"></i> Ver en Maps
            </a>
        </div>
        
        <p class="detail-notes">Detalles a tener en cuenta en la cita: ${turno.detallesCita}</p>
        
        <div class="detail-actions">
            ${botonCancelar}
        </div>
    `;

    modal.style.display = 'flex'; 
}

// Función: Cerrar el modal de detalle del turno
function cerrarDetalleTurno() {
    const modal = document.getElementById('turnoDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función: Cancelación del turno
function cancelarTurno(id) {
    if (confirm('¿Está seguro de que desea cancelar este turno? Esta acción no se puede deshacer.')) {
        const turnoIndex = datosTurnos.findIndex(t => t.id === id);
        
        if (turnoIndex !== -1) {
            datosTurnos[turnoIndex].estado = 'cancelado-usuario';
            
            // Actualizar la etiqueta del estado y el tiempo restante
            const fechaActual = new Date().toLocaleDateString('es-ES', { 
                day: 'numeric', month: 'long', year: 'numeric' 
            });
            datosTurnos[turnoIndex].tiempoRestante = `Cancelado el ${fechaActual}`;
            
            // Cerrar el modal
            cerrarDetalleTurno();
            
            // Refrescar la lista de tarjetas
            renderizarTarjetas();
            
            alert('El turno ha sido cancelado exitosamente.');
        } else {
            alert('Error: Turno no encontrado.');
        }
    }
    return false;
}

// ACierre del modal al hacer clic fuera 
window.addEventListener('click', (event) => {
    const modal = document.getElementById('turnoDetailModal');
    if (event.target === modal) {
        cerrarDetalleTurno();
    }
});