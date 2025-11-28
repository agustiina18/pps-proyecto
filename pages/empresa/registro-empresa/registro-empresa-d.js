const seccionEmpresa = document.getElementById("seccion-empresa");
const seccionDomicilio = document.getElementById("seccion-domicilio");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnAnterior = document.getElementById("btn-anterior");

let mapa;
let marcador;

/* Modal elementos */
const modalOverlay = document.getElementById("modal-overlay");
const modalMensaje = document.getElementById("modal-mensaje");
const modalBtn = document.getElementById("modal-btn");


/* ============================================================
   ======================= MAPA LEAFLET ========================
   ============================================================ */

function iniciarMapa() {
    if (mapa) {
        setTimeout(() => mapa.invalidateSize(), 300);
        return;
    }

    const latInicial = -34.6037;
    const lngInicial = -58.3816;

    mapa = L.map("mapa").setView([latInicial, lngInicial], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
    }).addTo(mapa);

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


/* ============================================================
   ==================== COORDENADAS HIDDEN ====================
   ============================================================ */

function actualizarCoordenadas(lat, lng) {
    const texto = document.getElementById("texto-coordenadas");
    texto.style.display = "none";
    texto.textContent = `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    document.getElementById("latitud").value = lat;
    document.getElementById("longitud").value = lng;
}


/* ============================================================
   ===================== BUSCAR DIRECCIÓN ======================
   ============================================================ */

document.getElementById("btn-buscar").addEventListener("click", async () => {

    const provincia = document.getElementById("input-provincia").value.trim();
    const municipio = document.getElementById("input-municipio").value.trim();
    const localidad = document.getElementById("input-localidad").value.trim();
    const calle = document.getElementById("input-calle").value.trim();
    const altura = document.getElementById("input-altura").value.trim();

    if (!provincia || !municipio || !localidad || !calle || !altura) {
        alert("Completa todos los campos para buscar la dirección.");
        return;
    }

    let direccion = `${calle} ${altura}, ${localidad}, ${municipio}, ${provincia}, Argentina`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.length === 0) {
            alert("No se encontró la dirección. Verifica los datos ingresados.");
            return;
        }

        const lat = parseFloat(datos[0].lat);
        const lon = parseFloat(datos[0].lon);

        marcador.setLatLng([lat, lon]);
        mapa.setView([lat, lon], 16);

        actualizarCoordenadas(lat, lon);

    } catch (error) {
        alert("Error buscando la dirección. Intenta nuevamente.");
    }
});


/* ============================================================
   ======================= CAMBIO DE PASO ======================
   ============================================================ */

btnSiguiente.addEventListener("click", () => {

    const inputsRequeridos = seccionEmpresa.querySelectorAll("input[required]");

    for (let input of inputsRequeridos) {
        if (!input.value.trim()) {
            input.reportValidity();
            return;
        }
    }

    seccionEmpresa.classList.remove("activa");
    seccionDomicilio.classList.add("activa");

    iniciarMapa();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

btnAnterior.addEventListener("click", () => {
    seccionDomicilio.classList.remove("activa");
    seccionEmpresa.classList.add("activa");
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ============================================================
   ======================= MODAL FINAL =========================
   ============================================================ */

document.getElementById("formulario-empresa").addEventListener("submit", function (e) {
    e.preventDefault();

    modalMensaje.textContent = "Empresa creada con éxito";
    modalOverlay.classList.add("mostrar");

    setTimeout(() => {
        window.location.href = "../empresa/panel.html";
    }, 2000);
});

modalBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("mostrar");
});


/* ============================================================
   ================== SUBIR LOGO Y PREVISUALIZAR ===============
   ============================================================ */

const inputLogo = document.getElementById("archivoLogo");
const btnSubir = document.querySelector(".btn-subir");
const imgPreview = document.querySelector(".logo-previo");
const spanInputFalso = document.querySelector(".input-falso");

if (inputLogo && btnSubir && imgPreview) {

    // Abrir el selector de archivo al hacer clic en el botón
    btnSubir.addEventListener("click", () => {
        inputLogo.click();
    });

    // Cuando el usuario selecciona un archivo
    inputLogo.addEventListener("change", () => {
        const file = inputLogo.files[0];
        if (!file) return;

        const tipo = file.type;

        // Validar tipo de archivo
        if (
            tipo !== "image/jpeg" &&
            tipo !== "image/jpg" &&
            tipo !== "image/png"
        ) {
            alert("Solo se permiten imágenes JPG o PNG.");
            inputLogo.value = "";
            return;
        }

        // Mostrar nombre en el span "Logo" (opcional)
        if (spanInputFalso) {
            const maxChars = 20;
            let nombre = file.name;
            if (nombre.length > maxChars) {
                nombre = nombre.substring(0, maxChars - 3) + "...";
            }
            spanInputFalso.textContent = nombre;
        }

        // Leer el archivo y actualizar la imagen previa
        const reader = new FileReader();
        reader.onload = (e) => {
            imgPreview.src = e.target.result;   // reemplaza la imagen por la seleccionada
        };
        reader.readAsDataURL(file);
    });
}