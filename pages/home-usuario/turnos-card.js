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
        ubicacion: 'Av. Principal 123'
    },
    {
        id: 2,
        hora: '14:00',
        fecha: 'Miércoles, 29 de Enero',
        tiempoRestante: 'Faltan 6 días y 4 horas',
        estado: 'cancelado-usuario',
        servicio: 'Coloración',
        empresa: 'Salón de Belleza Centro',
        ubicacion: 'Calle Mayor 456'
    },
    {
        id: 3,
        hora: '09:15',
        fecha: 'Martes, 21 de Enero',
        tiempoRestante: 'Hace 3 días',
        estado: 'cumplido',
        servicio: 'Limpieza Facial',
        empresa: 'Centro Estético Deluxe',
        ubicacion: 'Paseo del Centro 789'
    },
    {
        id: 4,
        hora: '15:45',
        fecha: 'Jueves, 23 de Enero',
        tiempoRestante: 'Hace 1 día',
        estado: 'cancelado-empresa',
        servicio: 'Manicura',
        empresa: 'Nails & Beauty Studio',
        ubicacion: 'Calle Nueva 321'
    },
    {
        id: 5,
        hora: '11:00',
        fecha: 'Domingo, 19 de Enero',
        tiempoRestante: 'Hace 5 días',
        estado: 'no-cumplido',
        servicio: 'Pedicura',
        empresa: 'Spa Relax Center',
        ubicacion: 'Av. Spa 654'
    },
    {
        id: 6,
        hora: '16:30',
        fecha: 'Sábado, 18 de Enero',
        tiempoRestante: 'Hace 6 días',
        estado: 'vencido',
        servicio: 'Masaje Relajante',
        empresa: 'Wellness Pro Spa',
        ubicacion: 'Carrera Bienestar 987'
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
    // CORRECCIÓN ID: Coincide con el ID del home-turnos.html
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

// Crear una tarjeta individual con el nuevo diseño
function crearTarjeta(turno) {
    const tarjeta = document.createElement('div');
    tarjeta.className = `card ${turno.estado}`;

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
            <a href="#" class="card-link" onclick="return mostrarUbicacion('${turno.ubicacion}')">
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

// El archivo home-dropdown.js se encarga de la lógica de los menús (barras y perfil).