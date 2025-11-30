/* ============================================================
   DATA DE PRUEBA
============================================================ */
const datosPrueba = {
    servicios: [
        { id: 1, nombre: 'Corte de Cabello', descripcion: 'Corte y peinado profesional', duracion: '30 min', precio: 3500 },
        { id: 2, nombre: 'Coloración', descripcion: 'Tinte y tratamiento de color', duracion: '90 min', precio: 9000 },
        { id: 3, nombre: 'Limpieza Facial', descripcion: 'Tratamiento completo de limpieza', duracion: '45 min', precio: 5000 },
        { id: 4, nombre: 'Manicura', descripcion: 'Manicura y esmaltado', duracion: '45 min', precio: 4500 },
        { id: 5, nombre: 'Pedicura', descripcion: 'Pedicura completa y esmaltado', duracion: '45 min', precio: 4800 },
        { id: 6, nombre: 'Masaje Relajante', descripcion: 'Masaje corporal relajante', duracion: '60 min', precio: 6000 },
    ],
    profesionales: [
        { id: 1, nombre: 'María García', especialidad: 'Estilista', avatar: 'M' },
        { id: 2, nombre: 'Juan López', especialidad: 'Barbero', avatar: 'J' },
        { id: 3, nombre: 'Ana Martínez', especialidad: 'Estetilista', avatar: 'A' },
        { id: 4, nombre: 'Otro', especialidad: 'A convenir por empresa', avatar: 'A' },
    ],
    fechas: [
        '2025-01-24', '2025-01-25', '2025-01-26', '2025-01-27',
        '2025-01-28', '2025-01-29', '2025-01-30'
    ],
    horas: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
};

/* VARIABLES DE SELECCIÓN */
let servicioSeleccionado = null;
let profesionalSeleccionado = null;
let fechaSeleccionada = null;
let horaSeleccionada = null;

/* SISTEMA DE PASOS REAL*/
let pasoActual = 1;

/* Actualizar indicador superior */
function actualizarIndicadorPasos() {
    const indicadores = document.querySelectorAll("#indicadorPasos .flex-1 div");

    indicadores.forEach((indi, index) => {
        if (index === pasoActual - 1) {
            indi.classList.remove("bg-gray-300", "text-gray-600");
            indi.classList.add("bg-[#AC0505]", "text-white");
        }
        else if (index < pasoActual - 1) {
            indi.classList.remove("bg-gray-300", "text-gray-600");
            indi.classList.add("bg-green-600", "text-white");
        }
        else {
            indi.classList.remove("bg-[#AC0505]", "text-white", "bg-green-600");
            indi.classList.add("bg-gray-300", "text-gray-600");
        }
    });

    const lineas = document.querySelectorAll(".linea-indicadora");
    lineas.forEach((linea, index) => {
        if (index < pasoActual - 1) linea.classList.add("activo");
        else linea.classList.remove("activo");
    });
}

/* Mostrar la sección correcta */
function mostrarPaso(n) {
    pasoActual = n;

    document.querySelectorAll("section[id^='paso-']").forEach(sec => sec.classList.add("hidden"));

    if (n === 1) document.getElementById("paso-servicio").classList.remove("hidden");
    if (n === 2) document.getElementById("paso-profesional").classList.remove("hidden");
    if (n === 3) document.getElementById("paso-hora").classList.remove("hidden");
    if (n === 4) document.getElementById("paso-resumen").classList.remove("hidden");

    actualizarIndicadorPasos();
}

/* BOTÓN SIGUIENTE */
window.siguientePaso = function () {

    if (pasoActual === 1) {
        if (!servicioSeleccionado) return;
        renderizarProfesionales();
        mostrarPaso(2);
    }

    else if (pasoActual === 2) {
        if (!profesionalSeleccionado) return;
        renderizarFechasYHoras();
        mostrarPaso(3);
    }

    else if (pasoActual === 3) {
        if (!fechaSeleccionada || !horaSeleccionada) return;
        renderizarResumen();
        mostrarPaso(4);
    }
};

/* BOTÓN ANTERIOR*/
window.pasoAnterior = function () {
    if (pasoActual > 1) mostrarPaso(pasoActual - 1);
};

/* SERVICIO */
function renderizarServicios() {
    const cont = document.getElementById("listaServicios");

    cont.innerHTML = datosPrueba.servicios.map(s => `
        <div class="tarjeta-servicio bg-white border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#AC0505]" 
             onclick="seleccionarServicio(${s.id}, event)">

            <h3 class="font-bold text-gray-800 text-lg">${s.nombre}</h3>

            <p class="text-sm text-gray-600 mt-2">${s.descripcion}</p>

            <p class="text-sm text-gray-500 mt-3">⏱ ${s.duracion}</p>

            <p class="text-base font-semibold text-[#AC0505] mt-3">
                $ ${s.precio} ARS
            </p>

        </div>
    `).join('');
}


window.seleccionarServicio = (id, e) => {
    document.querySelectorAll(".tarjeta-servicio").forEach(c => c.classList.remove("seleccionado"));
    e.currentTarget.classList.add("seleccionado");

    servicioSeleccionado = datosPrueba.servicios.find(s => s.id === id);

    document.getElementById("btnSiguienteServicio").disabled = false;
};

/* PROFESIONALES*/
function renderizarProfesionales() {
    const cont = document.getElementById("listaProfesionales");

    cont.innerHTML = datosPrueba.profesionales.map(p => `
        <div class="tarjeta-profesional bg-white border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#AC0505]"
             onclick="seleccionarProfesional(${p.id}, event)">
            <div class="w-16 h-16 bg-[#e5e5e5] text-white rounded-full flex items-center justify-center text-2xl font-bold">${p.avatar}</div>
            <h3 class="font-bold text-gray-800 mt-3">${p.nombre}</h3>
            <p class="text-sm text-gray-600">${p.especialidad}</p>
        </div>
    `).join('');

    document.getElementById("btnSiguienteProfesional").disabled = true;
}

window.seleccionarProfesional = (id, e) => {
    document.querySelectorAll(".tarjeta-profesional").forEach(c => c.classList.remove("seleccionado"));
    e.currentTarget.classList.add("seleccionado");

    profesionalSeleccionado = datosPrueba.profesionales.find(p => p.id === id);
    document.getElementById("btnSiguienteProfesional").disabled = false;
};

/* FECHAS Y HORAS*/
function renderizarFechasYHoras() {

    const fechas = document.getElementById("listaFechas");
    fechas.innerHTML = datosPrueba.fechas.map(f =>
        `<button class="boton-fecha border-2 px-4 py-3 rounded-lg" 
                 onclick="seleccionarFecha('${f}', event)">
            ${new Date(f).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
        </button>`
    ).join('');

    const horas = document.getElementById("listaHoras");
    horas.innerHTML = datosPrueba.horas.map(h =>
        `<button class="boton-hora border-2 px-4 py-3 rounded-lg" 
                 onclick="seleccionarHora('${h}', event)">
            ${h}
        </button>`
    ).join('');

    document.getElementById("btnSiguienteHora").disabled = true;
}

window.seleccionarFecha = (f, e) => {
    fechaSeleccionada = f;

    document.querySelectorAll(".boton-fecha").forEach(b => b.classList.remove("seleccionado"));
    e.currentTarget.classList.add("seleccionado");

    habilitarSiguienteHora();
};

window.seleccionarHora = (h, e) => {
    horaSeleccionada = h;

    document.querySelectorAll(".boton-hora").forEach(b => b.classList.remove("seleccionado"));
    e.currentTarget.classList.add("seleccionado");

    habilitarSiguienteHora();
};

function habilitarSiguienteHora() {
    document.getElementById("btnSiguienteHora").disabled = !(fechaSeleccionada && horaSeleccionada);
}

/* RESUMEN FINAL*/
function renderizarResumen() {
    document.getElementById('resumen-servicio').textContent = servicioSeleccionado.nombre;
    document.getElementById('resumen-precio').textContent = servicioSeleccionado.precio + " ARS";
    document.getElementById('resumen-profesional').textContent = profesionalSeleccionado.nombre;
    document.getElementById('resumen-fecha').textContent = fechaSeleccionada;
    document.getElementById('resumen-hora').textContent = horaSeleccionada;
}

/* MODAL DE CONFIRMACIÓN*/
window.mostrarModalReserva = function () {
    document.getElementById("modalReserva").style.display = "flex";

    document.getElementById("modal-resumen-servicio").textContent = servicioSeleccionado.nombre;
    document.getElementById("modal-resumen-profesional").textContent = profesionalSeleccionado.nombre;
    document.getElementById("modal-resumen-fechahora").textContent = `${fechaSeleccionada} - ${horaSeleccionada}`;
    document.getElementById("precioConfirmado").textContent = servicioSeleccionado.precio + " ARS";
};

window.cerrarModalReserva = function (irAMisTurnos = false) {
    document.getElementById("modalReserva").style.display = "none";

    if (irAMisTurnos) {
        window.location.href = '../../usuario/home-usuario/home-usuario.html';
    }
};

/* INICIALIZAR AL CARGAR */
document.addEventListener("DOMContentLoaded", () => {
    renderizarServicios();
    mostrarPaso(1);
});
