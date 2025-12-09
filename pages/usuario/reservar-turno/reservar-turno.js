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
        { id: 3, nombre: 'Ana Martínez', especialidad: 'Estilista', avatar: 'A' },
        { id: 4, nombre: 'Otro', especialidad: 'A convenir por empresa', avatar: 'A' },
    ]
};

/* VARIABLES DE SELECCIÓN */
let servicioSeleccionado = null;
let profesionalSeleccionado = null;
let fechaSeleccionada = null;
let horaSeleccionada = null;

/* PASOS */
let pasoActual = 1;

/* ============================================================
   INDICADORES SUPERIORES DE PASOS
============================================================ */
function actualizarIndicadorPasos() {
    const indicadores = document.querySelectorAll("#indicadorPasos .flex-1 div");

    indicadores.forEach((indi, index) => {
        if (index === pasoActual - 1) {
            indi.classList.remove("bg-gray-300", "text-gray-600");
            indi.classList.add("bg-[#AC0505]", "text-white");
        } else if (index < pasoActual - 1) {
            indi.classList.remove("bg-gray-300", "text-gray-600");
            indi.classList.add("bg-green-600", "text-white");
        } else {
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

function mostrarPaso(n) {
    pasoActual = n;
    document.querySelectorAll("section[id^='paso-']").forEach(sec => sec.classList.add("hidden"));

    if (n === 1) document.getElementById("paso-servicio").classList.remove("hidden");
    if (n === 2) document.getElementById("paso-profesional").classList.remove("hidden");
    if (n === 3) document.getElementById("paso-hora").classList.remove("hidden");
    if (n === 4) document.getElementById("paso-resumen").classList.remove("hidden");

    actualizarIndicadorPasos();
}

window.siguientePaso = function () {
    if (pasoActual === 1) {
        if (!servicioSeleccionado) return;
        renderizarProfesionales();
        mostrarPaso(2);
    }
    else if (pasoActual === 2) {
        if (!profesionalSeleccionado) return;
        prepararCalendario();
        mostrarPaso(3);
    }
    else if (pasoActual === 3) {
        if (!fechaSeleccionada || !horaSeleccionada) return;
        renderizarResumen();
        mostrarPaso(4);
    }
};

window.pasoAnterior = function () {
    if (pasoActual > 1) mostrarPaso(pasoActual - 1);
};

/* ============================================================
   PASO 1 – SERVICIOS
============================================================ */
function renderizarServicios() {
    const cont = document.getElementById("listaServicios");

    cont.innerHTML = datosPrueba.servicios.map(s => `
        <div class="tarjeta-servicio bg-white border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#AC0505]"
             onclick="seleccionarServicio(${s.id}, event)">
            <h3 class="font-bold text-gray-800 text-lg">${s.nombre}</h3>
            <p class="text-sm text-gray-600 mt-2">${s.descripcion}</p>
            <p class="text-sm text-gray-500 mt-3">⏱ ${s.duracion}</p>
            <p class="text-base font-semibold text-[#AC0505] mt-3">$ ${s.precio} ARS</p>
        </div>
    `).join('');
}

window.seleccionarServicio = (id, e) => {
    document.querySelectorAll(".tarjeta-servicio").forEach(c => c.classList.remove("seleccionado"));
    e.currentTarget.classList.add("seleccionado");

    servicioSeleccionado = datosPrueba.servicios.find(s => s.id === id);
    document.getElementById("btnSiguienteServicio").disabled = false;
};

/* ============================================================
   PASO 2 – PROFESIONALES
============================================================ */
function renderizarProfesionales() {
    const cont = document.getElementById("listaProfesionales");

    cont.innerHTML = datosPrueba.profesionales.map(p => `
        <div class="tarjeta-profesional bg-white border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#AC0505]"
             onclick="seleccionarProfesional(${p.id}, event)">
            <div class="w-16 h-16 bg-[#e5e5e5] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                ${p.avatar}
            </div>
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

/* ============================================================
   PASO 3 – FECHA Y HORA 
============================================================ */

let diasCalendario = [];
let disponibilidadDias = {};
let horariosGenerados = [];
let indiceSemanaActual = 0;
let maxSemana = 0;

/* Genera 56 días + disponibilidad aleatoria para la simulacion*/
function generarDiasCalendario() {
    const hoy = new Date();
    diasCalendario = [];
    disponibilidadDias = {};

    for (let i = 0; i < 56; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);

        const iso = fecha.toISOString().split("T")[0];

        const diaSemana = fecha.toLocaleString("es-ES", { weekday: "short" }).toUpperCase();
        const mesLower = fecha.toLocaleString("es-ES", { month: "short" }).toLowerCase();

        diasCalendario.push({
            fechaISO: iso,
            dia: fecha.getDate(),
            mes: mesLower,
            diaSemana: diaSemana
        });

        disponibilidadDias[iso] = Math.random() < 0.7;
    }

    maxSemana = Math.ceil(diasCalendario.length / 7) - 1;  
}

/* Horarios cada 5 minutos */
function generarHorariosDia() {
    const horarios = [];
    for (let h = 9; h <= 19; h++) {
        for (let m = 0; m < 60; m += 5) {
            horarios.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
        }
    }
    return horarios;
}

/* Preparar calendario */
function prepararCalendario() {
    generarDiasCalendario();
    horariosGenerados = generarHorariosDia();

    fechaSeleccionada = null;
    horaSeleccionada = null;
    indiceSemanaActual = 0;

    document.getElementById("listaHoras").innerHTML = "";
    document.getElementById("mensaje-disponibilidad").textContent =
        "Selecciona una fecha para ver los horarios disponibles.";

    document.getElementById("btnSiguienteHora").disabled = true;

    renderSemanaActual();
}

/* Pintar semana actual */
function renderSemanaActual() {
    const cont = document.getElementById("listaFechas");
    const inicio = indiceSemanaActual * 7;
    const fin = inicio + 7;
    const semana = diasCalendario.slice(inicio, fin);

    let html = `<div class="fechas-wrapper">`;

    html += `
        <button class="nav-fecha" onclick="cambiarSemana(-1)" ${indiceSemanaActual === 0 ? "disabled" : ""}>
            «
        </button>
    `;

    semana.forEach(d => {
        const disponible = disponibilidadDias[d.fechaISO];
        const activo = fechaSeleccionada === d.fechaISO;

        const clases = ["boton-fecha"];
        if (disponible) clases.push("disponible");
        else clases.push("sin-turnos");
        if (activo) clases.push("seleccionado");

        const clickAttr = disponible
            ? `onclick="seleccionarFecha('${d.fechaISO}', event)"`
            : "";

        html += `
            <button class="${clases.join(" ")}" ${clickAttr}>
                <span class="fecha-mes">${d.mes}</span>
                <span class="fecha-dia-semana">${d.diaSemana}</span>
                <span class="fecha-dia-numero">${d.dia}</span>
            </button>
        `;
    });

    html += `
        <button class="nav-fecha" onclick="cambiarSemana(1)" ${indiceSemanaActual === maxSemana ? "disabled" : ""}>
            »
        </button>
    `;

    html += `</div>`;

    cont.innerHTML = html;
}

/* Cambiar semana */
window.cambiarSemana = function (delta) {
    const nuevo = indiceSemanaActual + delta;
    if (nuevo < 0 || nuevo > maxSemana) return;

    indiceSemanaActual = nuevo;
    renderSemanaActual();
};

/* Seleccionar fecha */
window.seleccionarFecha = (fechaISO, e) => {
    if (!disponibilidadDias[fechaISO]) {
        fechaSeleccionada = null;
        horaSeleccionada = null;
        document.getElementById("listaHoras").innerHTML = "";
        document.getElementById("mensaje-disponibilidad").textContent =
            "No hay horarios disponibles para este día.";
        document.getElementById("btnSiguienteHora").disabled = true;
        return;
    }

    fechaSeleccionada = fechaISO;

    document.querySelectorAll(".boton-fecha").forEach(b => b.classList.remove("seleccionado"));
    if (e && e.currentTarget) e.currentTarget.classList.add("seleccionado");

    document.getElementById("mensaje-disponibilidad").textContent =
        "Selecciona un horario disponible:";

    renderHorariosParaFecha();
};

/* Renderizar horarios */
function renderHorariosParaFecha() {
    const cont = document.getElementById("listaHoras");

    cont.innerHTML = horariosGenerados.map(h => `
        <button class="boton-hora"
                onclick="seleccionarHora('${h}', event)">
            ${h}
        </button>
    `).join("");

    horaSeleccionada = null;
    document.getElementById("btnSiguienteHora").disabled = true;
}

window.seleccionarHora = (h, e) => {
    horaSeleccionada = h;

    document.querySelectorAll(".boton-hora").forEach(b => b.classList.remove("seleccionado"));
    if (e && e.currentTarget) e.currentTarget.classList.add("seleccionado");

    document.getElementById("btnSiguienteHora").disabled = false;
};

/* ============================================================
   PASO 4 – RESUMEN
============================================================ */
function renderizarResumen() {
    document.getElementById("resumen-servicio").textContent = servicioSeleccionado.nombre;
    document.getElementById("resumen-precio").textContent = servicioSeleccionado.precio + " ARS";
    document.getElementById("resumen-profesional").textContent = profesionalSeleccionado.nombre;
    document.getElementById("resumen-fecha").textContent = fechaSeleccionada;
    document.getElementById("resumen-hora").textContent = horaSeleccionada;
}

/* ============================================================
   MODAL CONFIRMACIÓN
============================================================ */
window.mostrarModalReserva = function () {
    document.getElementById("modalReserva").style.display = "flex";

    document.getElementById("modal-resumen-servicio").textContent = servicioSeleccionado.nombre;
    document.getElementById("modal-resumen-profesional").textContent = profesionalSeleccionado.nombre;
    document.getElementById("modal-resumen-fechahora").textContent =
        `${fechaSeleccionada} - ${horaSeleccionada}`;
    document.getElementById("precioConfirmado").textContent = servicioSeleccionado.precio + " ARS";
};

window.cerrarModalReserva = function (irAMisTurnos = false) {
    document.getElementById("modalReserva").style.display = "none";

    if (irAMisTurnos) {
        window.location.href = '../../usuario/home-usuario/home-usuario.html';
    }
};

/* ============================================================
   INICIALIZAR
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    renderizarServicios();
    mostrarPaso(1);
});
