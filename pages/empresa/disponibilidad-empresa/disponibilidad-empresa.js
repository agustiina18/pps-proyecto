// ===================== MOCK =====================
const DIAS_BASE = [
    { nombre: "Lunes", activo: true, apertura: "09:00", cierre: "18:00" },
    { nombre: "Martes", activo: true, apertura: "09:00", cierre: "18:00" },
    { nombre: "Miércoles", activo: true, apertura: "09:00", cierre: "18:00" },
    { nombre: "Jueves", activo: true, apertura: "09:00", cierre: "18:00" },
    { nombre: "Viernes", activo: true, apertura: "09:00", cierre: "18:00" },
    { nombre: "Sábado", activo: false, apertura: "", cierre: "" },
    { nombre: "Domingo", activo: false, apertura: "", cierre: "" }
];

let disponibilidad = [...DIAS_BASE];

// ===================== RENDER =====================
function renderDias() {
    const cont = document.getElementById("listaDias");
    cont.innerHTML = "";

    disponibilidad.forEach((dia, index) => {
        const card = document.createElement("div");
        card.className = "dia-card";

        card.innerHTML = `
            <div class="dia-header">
                <span>${dia.nombre}</span>
                <div class="toggle ${dia.activo ? "activo" : ""}" data-index="${index}"></div>
            </div>

            ${
                dia.activo
                    ? `<div class="horarios">
                        <input type="time" class="input-apertura" value="${dia.apertura}">
                        <input type="time" class="input-cierre" value="${dia.cierre}">
                       </div>`
                    : ""
            }
        `;

        cont.appendChild(card);
    });

    agregarListeners();
}

// ===================== EVENTOS =====================
function agregarListeners() {
    document.querySelectorAll(".toggle").forEach(toggle => {
        toggle.onclick = () => {
            const idx = toggle.dataset.index;
            disponibilidad[idx].activo = !disponibilidad[idx].activo;
            renderDias();
        };
    });
}

// ===================== GUARDAR =====================
document.getElementById("btnGuardar").onclick = () => {
    document.querySelectorAll(".dia-card").forEach((card, i) => {
        if (disponibilidad[i].activo) {
            disponibilidad[i].apertura = card.querySelector(".input-apertura").value;
            disponibilidad[i].cierre = card.querySelector(".input-cierre").value;
        }
    });

    document.getElementById("modalOverlay").classList.add("show");
};

document.getElementById("btnCerrarModal").onclick = () => {
    document.getElementById("modalOverlay").classList.remove("show");
};

// ===================== INICIO =====================
renderDias();
