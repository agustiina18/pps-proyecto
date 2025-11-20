document.addEventListener("DOMContentLoaded", () => {
    // js de práctica - datos mockeados
    const mockTurnos = [
        {
            servicio: "Corte de pelo y barba",
            empresa: "Barberia Sebastian",
            fecha: "2025-11-21", // Jueves
            hora: "18:00",
            duracion: "40 min",
            estado: "Confirmado",
            direccion: "Av. Corrientes 1353, Bs. As."
        },
        {
            servicio: "Limpieza facial profunda",
            empresa: "Estética Premium",
            fecha: "2025-11-24", // Domingo
            hora: "10:30",
            duracion: "60 min",
            estado: "Cancelado por usuario",
            direccion: "Calle Falsa 123, CABA"
        },
        {
            servicio: "Mantenimiento preventivo",
            empresa: "Taller Mecánico Rápido",
            fecha: "2025-11-01", // Pasado
            hora: "09:00",
            duracion: "120 min",
            estado: "Cumplido",
            direccion: "Ruta 3, KM 50"
        },
        {
            servicio: "Clase de yoga",
            empresa: "Studio Zen",
            fecha: "2025-11-18", // Pasado
            hora: "19:00",
            duracion: "60 min",
            estado: "No cumplido",
            direccion: "Las Heras 400"
        },
        {
            servicio: "Masaje relajante",
            empresa: "Spa Oasis",
            fecha: "2025-11-10", // Pasado, no cumplido
            hora: "15:30",
            duracion: "60 min",
            estado: "Vencido",
            direccion: "Av. Libertador 200"
        }
    ];

    const turnosContainer = document.getElementById("turnos-container");
    const searchInput = document.getElementById("turnos-search-input");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noTurnosMessage = document.getElementById("no-turnos-message");

    let turnosActuales = [...mockTurnos];

    // Función para obtener la diferencia de días y el estado
    function getDaysDifference(dateString, timeString) {
        const appointmentDate = new Date(dateString + ' ' + timeString);
        const today = new Date();
        const diffTime = appointmentDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return '(Hoy)';
        if (diffDays === 1) return '(Mañana)';
        if (diffDays > 1) return `(en ${diffDays} días)`;
        return ''; // Retorna vacío si la fecha es pasada, el estado se manejará por la data
    }
    
    // Función de renderizado principal
    function renderTurnos(turnos, filtroEstado = 'todos', consulta = '') {
        turnosContainer.innerHTML = '';
        noTurnosMessage.style.display = 'none';

        // Aplicar búsqueda
        const busquedaNormalizada = consulta.toLowerCase().trim();
        let turnosFiltrados = turnos.filter(turno => 
            turno.servicio.toLowerCase().includes(busquedaNormalizada) || 
            turno.empresa.toLowerCase().includes(busquedaNormalizada)
        );

        // Aplicar filtro de estado
        if (filtroEstado !== 'todos') {
            const estadoNormalizado = filtroEstado.replace('-', ' ');
            
            if (estadoNormalizado === 'vencido') {
                turnosFiltrados = turnosFiltrados.filter(t => t.estado.toLowerCase().includes('vencido') || t.estado.toLowerCase().includes('cumplido') || t.estado.toLowerCase().includes('no cumplido'));
            } else {
                turnosFiltrados = turnosFiltrados.filter(t => t.estado.toLowerCase().includes(estadoNormalizado));
            }
        }

        if (turnosFiltrados.length === 0) {
            noTurnosMessage.style.display = 'block';
            return;
        }

        // 3. Crear tarjetas
        turnosFiltrados.forEach(turno => {
            const card = document.createElement("div");
            card.classList.add("turno-card");

            const fechaObj = new Date(turno.fecha);
            const fechaDisplay = fechaObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'numeric' });
            const diasDiferencia = getDaysDifference(turno.fecha, turno.hora);
            
            // "Cancelado por usuario" -> "cancelado")
            const estadoClase = turno.estado.toLowerCase().replace(/ /g, '-');
            
            card.innerHTML = `
                <div class="turno-header">
                    <div class="turno-info">
                        <h4>${turno.servicio}</h4>
                        <p>${turno.empresa}</p>
                    </div>
                    <div class="turno-datetime">
                        <span class="time">${turno.hora}</span>
                        <span class="date">${fechaDisplay} ${diasDiferencia}</span>
                    </div>
                </div>

                <div class="turno-footer">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(turno.direccion)}" 
                       target="_blank" 
                       class="turno-direccion">
                        <i class="fas fa-map-marker-alt"></i> Ver Dirección
                    </a>
                    <span class="turno-estado estado-${estadoClase}">
                        ${turno.estado}
                    </span>
                </div>
            `;
            turnosContainer.appendChild(card);
        });
    }

    // Evento para filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filtro = btn.getAttribute('data-estado');
            const consultaActual = searchInput.value;
            renderTurnos(mockTurnos, filtro, consultaActual);
        });
    });

    // Evento para búsqueda
    searchInput.addEventListener('input', (e) => {
        const filtroActivo = document.querySelector('.filter-btn.active').getAttribute('data-estado');
        renderTurnos(mockTurnos, filtroActivo, e.target.value);
    });

    // Inicializar la vista
    renderTurnos(mockTurnos, 'todos', '');
});