// Objeto de datos de prueba traducido
const datosPrueba = {
    servicios: [
        { id: 1, nombre: 'Corte de Cabello', descripcion: 'Corte y peinado profesional', duracion: '30 min' },
        { id: 2, nombre: 'Coloración', descripcion: 'Tinte y tratamiento de color', duracion: '90 min' },
        { id: 3, nombre: 'Limpieza Facial', descripcion: 'Tratamiento completo de limpieza', duracion: '45 min' },
        { id: 4, nombre: 'Manicura', descripcion: 'Manicura y esmaltado', duracion: '45 min' },
        { id: 5, nombre: 'Pedicura', descripcion: 'Pedicura completa y esmaltado', duracion: '45 min' },
        { id: 6, nombre: 'Masaje Relajante', descripcion: 'Masaje corporal relajante', duracion: '60 min' },
    ],
    profesionales: [
        { id: 1, nombre: 'María García', especialidad: 'Estilista', avatar: 'M' },
        { id: 2, nombre: 'Juan López', especialidad: 'Barbero', avatar: 'J' },
        { id: 3, nombre: 'Ana Martínez', especialidad: 'Esteticien', avatar: 'A' },
    ],
    fechas: [
        '2025-01-24', '2025-01-25', '2025-01-26', '2025-01-27',
        '2025-01-28', '2025-01-29', '2025-01-30'
    ],
    horas: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
};

let pasoActual = 1;
let servicioSeleccionado = null;
let profesionalSeleccionado = null;
let fechaSeleccionada = null;
let horaSeleccionada = null;

// === REFERENCIAS AL MODAL ===
const modalReserva = document.getElementById('modalReserva');
const modalResumenServicio = document.getElementById('modal-resumen-servicio');
const modalResumenProfesional = document.getElementById('modal-resumen-profesional');
const modalResumenFechaHora = document.getElementById('modal-resumen-fechahora');


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarServicios(datosPrueba.servicios);
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    document.getElementById('busquedaServicio').addEventListener('input', (e) => {
        filtrarServicios(e.target.value);
    });
}

// Renderizar servicios
function renderizarServicios(servicios) {
    const listaServicios = document.getElementById('listaServicios');
    listaServicios.innerHTML = servicios.map(servicio => `
        <div class="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#AC0505] transition tarjeta-servicio" 
             data-servicio-id="${servicio.id}"
             onclick="seleccionarServicio(${servicio.id}, event)">
            <h3 class="font-bold text-gray-800 text-lg">${servicio.nombre}</h3>
            <p class="text-sm text-gray-600 mt-2">${servicio.descripcion}</p>
            <p class="text-sm text-gray-500 mt-3">⏱ ${servicio.duracion}</p>
        </div>
    `).join('');
}

// Filtrar servicios
function filtrarServicios(consulta) {
    const listaServicios = document.getElementById('listaServicios');
    const filtrados = datosPrueba.servicios.filter(s =>
        s.nombre.toLowerCase().includes(consulta.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(consulta.toLowerCase())
    );

    if (filtrados.length === 0) {
        listaServicios.innerHTML = '<div class="col-span-2 text-center py-8 text-gray-500">No encontramos servicios que coincidan</div>';
        return;
    }
    renderizarServicios(filtrados);
}

// Seleccionar servicio
window.seleccionarServicio = function(servicioId, event) {
    // Limpiar selección anterior
    document.querySelectorAll('.tarjeta-servicio').forEach(card => card.classList.remove('seleccionado'));
    
    servicioSeleccionado = datosPrueba.servicios.find(s => s.id === servicioId);
    
    // Marcar la tarjeta actual
    event.currentTarget.classList.add('seleccionado');

    document.getElementById('servicioSeleccionadoDisplay').textContent = `Profesionales disponibles para: ${servicioSeleccionado.nombre}`;
    
    // Pasar al siguiente paso 
    renderizarProfesionales();
    mostrarPaso(2);
};

// Renderizar profesionales
function renderizarProfesionales() {
    const listaProfesionales = document.getElementById('listaProfesionales');
    listaProfesionales.innerHTML = datosPrueba.profesionales.map(pro => `
        <div class="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#AC0505] transition tarjeta-profesional" 
             data-pro-id="${pro.id}"
             onclick="seleccionarProfesional(${pro.id}, event)">
            <div class="w-16 h-16 bg-gradient-to-br from-[#AC0505] to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">${pro.avatar}</div>
            <div>
                <h3 class="font-bold text-gray-800">${pro.nombre}</h3>
                <p class="text-sm text-gray-600">${pro.especialidad}</p>
            </div>
        </div>
    `).join('');
    // Deshabilitar el botón hasta que se seleccione uno
    document.getElementById('siguiente-profesional').disabled = true;
}

// Seleccionar profesional
window.seleccionarProfesional = function(proId, event) {
    // Limpiar selección anterior
    document.querySelectorAll('.tarjeta-profesional').forEach(card => card.classList.remove('seleccionado'));
    
    profesionalSeleccionado = datosPrueba.profesionales.find(p => p.id === proId);
    
    // Marcar la tarjeta actual
    event.currentTarget.classList.add('seleccionado');
    
    document.getElementById('siguiente-profesional').disabled = false;
};

// Renderizar fechas y horas
function renderizarFechasYHoras() {
    // Actualizar display del profesional
    document.getElementById('profesionalSeleccionadoDisplay').textContent = `Con: ${profesionalSeleccionado.nombre} (${profesionalSeleccionado.especialidad})`;

    const listaFechas = document.getElementById('listaFechas');
    listaFechas.innerHTML = datosPrueba.fechas.map(fecha => `
        <button class="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-[#AC0505] hover:text-white hover:border-[#AC0505] transition boton-fecha font-semibold" data-fecha="${fecha}" onclick="seleccionarFecha('${fecha}', event)">
            ${new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
        </button>
    `).join('');
    
    const listaHoras = document.getElementById('listaHoras');
    listaHoras.innerHTML = datosPrueba.horas.map(hora => `
        <button class="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-[#AC0505] hover:text-white hover:border-[#AC0505] transition boton-hora font-semibold" data-hora="${hora}" onclick="seleccionarHora('${hora}', event)">
            ${hora}
        </button>
    `).join('');

    // Reiniciar selecciones de fecha/hora y botón
    fechaSeleccionada = null;
    horaSeleccionada = null;
    document.getElementById('siguiente-hora').disabled = true;
}

// Seleccionar fecha
window.seleccionarFecha = function(fecha, event) {
    fechaSeleccionada = fecha;
    
    document.querySelectorAll('.boton-fecha').forEach(btn => {
        btn.classList.remove('seleccionado');
    });
    event.currentTarget.classList.add('seleccionado');
    
    // Habilitar 'Continuar' si ya se seleccionó la hora
    if (fechaSeleccionada && horaSeleccionada) {
        document.getElementById('siguiente-hora').disabled = false;
    }
};

// Seleccionar hora
window.seleccionarHora = function(hora, event) {
    horaSeleccionada = hora;
    
    document.querySelectorAll('.boton-hora').forEach(btn => {
        btn.classList.remove('seleccionado');
    });
    event.currentTarget.classList.add('seleccionado');
    
    // Habilitar 'Continuar' si ya se seleccionó la fecha
    if (fechaSeleccionada && horaSeleccionada) {
        document.getElementById('siguiente-hora').disabled = false;
    }
};

// Renderizar resumen
function renderizarResumen() {
    document.getElementById('resumen-profesional').textContent = profesionalSeleccionado.nombre;
    document.getElementById('resumen-especialidad').textContent = profesionalSeleccionado.especialidad;
    document.getElementById('resumen-servicio').textContent = servicioSeleccionado.nombre;
    document.getElementById('resumen-duracion').textContent = servicioSeleccionado.duracion;
    
    const objetoFecha = new Date(fechaSeleccionada + 'T00:00:00'); // 
    const fechaFormateada = objetoFecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('resumen-fecha').textContent = fechaFormateada;
    document.getElementById('resumen-hora').textContent = horaSeleccionada;
}

// Navegación
function mostrarPaso(paso) {
    const pasos = ['paso-servicio', 'paso-profesional', 'paso-hora', 'paso-resumen'];
    pasos.forEach(s => {
        document.getElementById(s).classList.add('hidden');
    });
    document.getElementById(pasos[paso - 1]).classList.remove('hidden');
    
    // Actualizar indicador de paso (Step Indicator)
    document.querySelectorAll('#indicadorPasos > div:not(.linea-indicadora)').forEach((el, index) => {
        const numeroPaso = index + 1;
        const circulo = el.querySelector('div');

        if (numeroPaso <= paso) {
            circulo.classList.remove('bg-gray-300', 'text-gray-600');
            circulo.classList.add('bg-[#AC0505]', 'text-white');
        } else {
            circulo.classList.add('bg-gray-300', 'text-gray-600');
            circulo.classList.remove('bg-[#AC0505]', 'text-white');
        }
    });

    document.querySelectorAll('.linea-indicadora').forEach((el, index) => {
        const pasoLinea = parseInt(el.getAttribute('data-paso')) + 1;
        if (pasoLinea <= paso) {
            el.classList.add('activo');
        } else {
            el.classList.remove('activo');
        }
    });


    pasoActual = paso;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.siguientePaso = function() {
    if (pasoActual === 1) {
        if (!servicioSeleccionado) return;
        renderizarProfesionales();
        mostrarPaso(2);
    } else if (pasoActual === 2) {
        if (!profesionalSeleccionado) return;
        renderizarFechasYHoras();
        mostrarPaso(3);
    } else if (pasoActual === 3) {
        if (!fechaSeleccionada || !horaSeleccionada) return;
        renderizarResumen();
        mostrarPaso(4);
    }
}

window.volverAtras = function() {
    if (pasoActual > 1) {
        mostrarPaso(pasoActual - 1);
    }
}

// === LÓGICA DEL MODAL DE CONFIRMACIÓN ===

/**
 * Muestra el modal e inyecta los datos de la reserva.
 */
function mostrarModalReserva() {
    if (!servicioSeleccionado || !profesionalSeleccionado || !fechaSeleccionada || !horaSeleccionada) {
        alert("Error: Faltan datos para mostrar el resumen.");
        return;
    }

    const objetoFecha = new Date(fechaSeleccionada + 'T00:00:00'); 
    const fechaFormateada = objetoFecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const fechaHoraFormateada = `${fechaFormateada} a las ${horaSeleccionada}`;

    modalResumenServicio.textContent = servicioSeleccionado.nombre;
    modalResumenProfesional.textContent = profesionalSeleccionado.nombre;
    modalResumenFechaHora.textContent = fechaHoraFormateada;

    modalReserva.style.display = 'flex';
}

/**
 * Oculta el modal y opcionalmente redirige al usuario.
 * @param {boolean} debeRedirigir Indica si se debe redirigir a la página principal.
 */
window.cerrarModalReserva = function(debeRedirigir = false) {
    modalReserva.style.display = 'none';
    if (debeRedirigir) {
        // Redirige al inicio
        window.location.href = '../index.html'; 
    }
}

// confirmar reserva
window.confirmarReserva = function() {
    if (!servicioSeleccionado || !profesionalSeleccionado || !fechaSeleccionada || !horaSeleccionada) {
        alert("Error: Faltan datos para la reserva.");
        return;
    }
    
    // fetch(POST)
    console.log("Datos de reserva enviados al Backend...");
    
    // 2. Muestra el modal de confirmación
    mostrarModalReserva(); 
}

// Globalmente accesible
window.mostrarModalReserva = mostrarModalReserva;
window.cerrarModalReserva = cerrarModalReserva;
window.confirmarReserva = confirmarReserva;
window.siguientePaso = siguientePaso;
window.volverAtras = volverAtras;