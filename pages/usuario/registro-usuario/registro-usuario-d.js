/* ============================================================
    =============== ELEMENTOS DEL DOM ==========================
=============================================================== */

const seccionUsuario = document.getElementById("seccion-usuario");
const seccionDomicilio = document.getElementById("seccion-domicilio");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnAnterior = document.getElementById("btn-anterior");
const formularioUsuario = document.getElementById("formulario-usuario");

let mapa;
let marcador;


/* ============================================================
    =============== MODAL ESTILO REGISTRO USUARIO ==============
=============================================================== */

function crearModal(titulo, mensaje, tipo, callback = null) {
    const color = tipo === "success" ? "#28a745" : "#dc3545";
    const icono = tipo === "success" ? "fa-check-circle" : "fa-times-circle";

    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    overlay.style = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(4px);
        display: flex; justify-content: center; align-items: center;
        z-index: 2000; opacity: 0; transition: opacity .25s ease;
    `;

    const card = document.createElement("div");
    card.style = `
        background: white; padding: 35px; width: 90%; max-width: 380px;
        border-radius: 18px; text-align: center;
        transform: scale(0.8); transition: transform .25s ease;
        font-family: 'Poppins';
    `;

    card.innerHTML = `
        <i class="fas ${icono}" style="font-size: 60px; color: ${color}; margin-bottom: 15px;"></i>
        <h2 style="margin-bottom:10px; font-size:22px; font-weight:700;">${titulo}</h2>
        <p style="font-size:16px; margin-bottom:20px; color:#555;">${mensaje}</p>
        <button id="modal-cerrar" class="btn-rojo" 
            style="padding:10px 20px; width:100%; border-radius:12px; font-size:16px;">
            Aceptar
        </button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = "1";
        card.style.transform = "scale(1)";
    }, 10);

    const cerrar = () => {
        overlay.style.opacity = "0";
        card.style.transform = "scale(0.8)";
        setTimeout(() => overlay.remove(), 250);
        if (callback) callback();
    };

    document.getElementById("modal-cerrar").onclick = cerrar;
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cerrar();
    });
}


/* ============================================================
    ===================== MAPA LEAFLET =========================
=============================================================== */

function iniciarMapa() {
    if (mapa) {
        setTimeout(() => mapa.invalidateSize(), 300);
        return;
    }

    const latInicial = -34.6037;
    const lngInicial = -58.3816;

    mapa = L.map("mapa").setView([latInicial, lngInicial], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapa);

    marcador = L.marker([latInicial, lngInicial], { draggable: true }).addTo(mapa);

    actualizarCoordenadas(latInicial, lngInicial);

    mapa.on("click", (e) => {
        marcador.setLatLng(e.latlng);
        actualizarCoordenadas(e.latlng.lat, e.latlng.lng);
    });

    marcador.on("dragend", () => {
        const pos = marcador.getLatLng();
        actualizarCoordenadas(pos.lat, pos.lng);
    });

    setTimeout(() => mapa.invalidateSize(), 300);
}

function actualizarCoordenadas(lat, lng) {
    document.getElementById("latitud").value = lat;
    document.getElementById("longitud").value = lng;
}


/* ============================================================
    =================== BUSCAR DIRECCIÓN ========================
=============================================================== */

document.getElementById("btn-buscar").addEventListener("click", async () => {

    const provincia = document.getElementById("input-provincia").value.trim();
    const municipio = document.getElementById("input-municipio").value.trim();
    const localidad = document.getElementById("input-localidad").value.trim();
    const calle = document.getElementById("input-calle").value.trim();
    const altura = document.getElementById("input-altura").value.trim();

    if (!provincia || !municipio || !localidad || !calle || !altura) {
        crearModal("Campos incompletos", "Por favor completa todos los datos antes de buscar la dirección.", "error");
        return;
    }

    const direccion = `${calle} ${altura}, ${localidad}, ${municipio}, ${provincia}, Argentina`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.length) {
            crearModal("Dirección no encontrada", "No se pudo encontrar la ubicación ingresada.", "error");
            return;
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        marcador.setLatLng([lat, lon]);
        mapa.setView([lat, lon], 16);
        actualizarCoordenadas(lat, lon);

    } catch (err) {
        crearModal("Error", "Ocurrió un problema al buscar la dirección.", "error");
    }
});


/* ============================================================
    ================= CAMBIO DE PASO (Siguiente / Anterior) ====
=============================================================== */

btnSiguiente.addEventListener("click", () => {
    const requeridos = seccionUsuario.querySelectorAll("input[required]");

    for (let input of requeridos) {
        if (!input.value.trim()) {
            input.reportValidity();
            return;
        }
    }

    seccionUsuario.classList.remove("activa");
    seccionDomicilio.classList.add("activa");

    iniciarMapa();
    scrollTo({ top: 0, behavior: "smooth" });
});

btnAnterior.addEventListener("click", () => {
    seccionDomicilio.classList.remove("activa");
    seccionUsuario.classList.add("activa");
    scrollTo({ top: 0, behavior: "smooth" });
});


/* ============================================================
    ======================= SUBMIT FINAL ========================
=============================================================== */

formularioUsuario.addEventListener("submit", (e) => {
    e.preventDefault();

    crearModal(
        "Registro exitoso",
        "Tu cuenta fue creada exitosamente. Serás redirigido al inicio de sesión.",
        "success",
        () => window.location.href = "../login/login-usuario.html"
    );
});


/* ============================================================
    =========== SUBIR FOTO PERFIL (MISMO QUE EMPRESA) ==========
=============================================================== */

const inputLogo = document.getElementById("archivoLogo");
const btnSubir = document.querySelector(".btn-subir");
const imgPreview = document.querySelector(".logo-previo");
const spanFalso = document.querySelector(".input-falso");

if (inputLogo) {
    btnSubir.addEventListener("click", () => inputLogo.click());

    inputLogo.addEventListener("change", () => {
        const file = inputLogo.files[0];
        if (!file) return;

        if (!["image/jpeg","image/jpg","image/png"].includes(file.type)) {
            crearModal("Formato inválido", "Solo se permiten imágenes JPG o PNG.", "error");
            inputLogo.value = "";
            return;
        }

        spanFalso.textContent = file.name.length > 20 
            ? file.name.substring(0,17)+"..."
            : file.name;

        const reader = new FileReader();
        reader.onload = (e) => imgPreview.src = e.target.result;
        reader.readAsDataURL(file);
    });
}