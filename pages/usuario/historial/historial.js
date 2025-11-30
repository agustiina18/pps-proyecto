document.addEventListener("DOMContentLoaded", () => {
    mostrarHistorial();
});

function mostrarHistorial() {

    const contenedor = document.getElementById("historialContainer");
    let historial = JSON.parse(localStorage.getItem("turnosHistorial")) || [];

    if (historial.length === 0) {
        contenedor.innerHTML = `<p>No hay turnos en el historial.</p>`;
        return;
    }

    contenedor.innerHTML = historial.map(turno => {
        return `
        <div class="turno-card">

            <div class="turno-header">
                <div class="turno-header-left">
                    <img src="../../img/icono-perfil.png" alt="Logo" class="turno-logo">
                    <div class="turno-empresa-info">
                        <h3 class="turno-empresa">${turno.empresa}</h3>
                    </div>
                </div>

                <span class="turno-estado ${getEstadoClase(turno.estado)}">
                    ${formatearEstado(turno.estado)}
                </span>
            </div>

            <p class="turno-item">
                <i class="fa-solid fa-location-dot"></i>
                ${turno.ubicacion}
            </p>

            <p class="turno-item">
                <i class="fa-solid fa-scissors"></i>
                ${turno.servicio}
            </p>

            <p class="turno-item">
                <i class="fa-solid fa-user"></i>
                ${turno.profesional}
            </p>

            <p class="turno-item">
                <i class="fa-solid fa-clock"></i>
                ${turno.duracion}
            </p>

        </div>
    `;
    }).join("");
}



// FORMATEAR ESTADO 

function formatearEstado(estado) {
    if (estado === "cancelado-usuario") return "Cancelado por Usuario";
    if (estado === "cancelado-empresa") return "Cancelado por Empresa";
    if (estado === "no-cumplido") return "No cumplido";
    if (estado === "cumplido") return "Cumplido";
    if (estado === "confirmado") return "Confirmado";
    return estado;
}



// COLOR POR ESTADO 

function getEstadoClase(estado) {
    const e = estado.toLowerCase().trim();

    if (e === "cumplido") return "cumplido";
    if (e === "no-cumplido" || e === "no cumplido") return "no-cumplido";
    if (e === "cancelado-usuario" || e === "cancelado por usuario") return "cancelado-usuario";
    if (e === "cancelado-empresa" || e === "cancelado por empresa") return "cancelado-empresa";

    return "";
}


// ELIMINAR DEL HISTORIAL


function eliminarHistorial(id) {
    let historial = JSON.parse(localStorage.getItem("turnosHistorial")) || [];

    historial = historial.filter(t => t.id != id);

    localStorage.setItem("turnosHistorial", JSON.stringify(historial));

    mostrarHistorial(); // refresca la vista
}