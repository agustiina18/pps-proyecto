let mapa;
let marcador;

function cargarDatosEmpresa() {
    const empresa = JSON.parse(localStorage.getItem("perfilEmpresa"));
    if (!empresa) return;

    const campos = {
        empresaNombre: empresa.nombre,
        empresaCuit: empresa.cuit,
        empresaRubro: empresa.rubro,
        empresaRubro2: empresa.rubro2,
        empresaTelefono: empresa.telefono,
        empresaEmail: empresa.email,
        "input-provincia": empresa.provincia,
        "input-municipio": empresa.municipio,
        "input-localidad": empresa.localidad,
        "input-calle": empresa.calle,
        "input-altura": empresa.altura,
        "input-adicional": empresa.adicional,
    };

    Object.keys(campos).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = campos[id] || "";
    });

    if (empresa.logo) {
        document.getElementById("logoPreview").src = empresa.logo;
    }

    if (empresa.latitud && empresa.longitud) {
        document.getElementById("latitud").value = empresa.latitud;
        document.getElementById("longitud").value = empresa.longitud;

        setTimeout(() => {
            marcador.setLatLng([empresa.latitud, empresa.longitud]);
            mapa.setView([empresa.latitud, empresa.longitud], 16);
        }, 500);
    }
}

/* BOTONES DE MODIFICACIÓN */
function configurarBotonesEditar() {
    document.querySelectorAll(".btn-modificar").forEach(boton => {
        boton.addEventListener("click", () => {
            const target = boton.getAttribute("data-target");
            const input = document.getElementById(target);

            if (!input) return;

            input.disabled = false;
            input.focus();
        });
    });
}

/* CAMBIO DE LOGO */
function configurarCambioLogo() {
    const inputLogo = document.getElementById("archivoLogo");
    const btnCambiarLogo = document.getElementById("btnCambiarLogo");
    const imgPreview = document.getElementById("logoPreview");

    btnCambiarLogo.addEventListener("click", () => inputLogo.click());

    inputLogo.addEventListener("change", () => {
        const file = inputLogo.files[0];
        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Solo se permiten imágenes JPG o PNG.");
            return;
        }

        const lector = new FileReader();
        lector.onload = e => imgPreview.src = e.target.result;
        lector.readAsDataURL(file);
    });
}

/* MAPA LEAFLET */
function iniciarMapa() {
    const latInicial = -34.6037;
    const lngInicial = -58.3816;

    mapa = L.map("mapa").setView([latInicial, lngInicial], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(mapa);

    marcador = L.marker([latInicial, lngInicial], { draggable: true }).addTo(mapa);

    actualizarCoordenadas(latInicial, lngInicial);

    mapa.on("click", e => {
        marcador.setLatLng(e.latlng);
        actualizarCoordenadas(e.latlng.lat, e.latlng.lng);
    });

    marcador.on("dragend", () => {
        const pos = marcador.getLatLng();
        actualizarCoordenadas(pos.lat, pos.lng);
    });

    setTimeout(() => mapa.invalidateSize(), 300);
}

/* MOSTRAR COORDENADAS Y GUARDAR HIDDEN */
function actualizarCoordenadas(lat, lng) {
    const texto = document.getElementById("texto-coordenadas");
    texto.style.display = "block";
    texto.textContent = `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    document.getElementById("latitud").value = lat;
    document.getElementById("longitud").value = lng;
}

/* BUSCAR DIRECCIÓN (Nominatim) */
function configurarBusquedaDireccion() {
    document.getElementById("btn-buscar").addEventListener("click", async () => {

        const provincia = document.getElementById("input-provincia").value.trim();
        const municipio = document.getElementById("input-municipio").value.trim();
        const localidad = document.getElementById("input-localidad").value.trim();
        const calle = document.getElementById("input-calle").value.trim();
        const altura = document.getElementById("input-altura").value.trim();

        if (!provincia || !municipio || !localidad || !calle || !altura) {
            alert("Completa todos los campos de dirección.");
            return;
        }

        const direccion = `${calle} ${altura}, ${localidad}, ${municipio}, ${provincia}, Argentina`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

        try {
            const r = await fetch(url);
            const datos = await r.json();

            if (!datos.length) {
                alert("No se encontró la dirección.");
                return;
            }

            const lat = parseFloat(datos[0].lat);
            const lon = parseFloat(datos[0].lon);

            marcador.setLatLng([lat, lon]);
            mapa.setView([lat, lon], 16);
            actualizarCoordenadas(lat, lon);

        } catch (error) {
            alert("Error al buscar la dirección.");
        }
    });
}

/* GUARDAR PERFIL FINAL */
function configurarSubmitPerfil() {
    const form = document.getElementById("formPerfilEmpresa");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const empresa = {
            nombre: document.getElementById("empresaNombre").value,
            cuit: document.getElementById("empresaCuit").value,
            rubro: document.getElementById("empresaRubro").value,
            rubro2: document.getElementById("empresaRubro2").value,
            telefono: document.getElementById("empresaTelefono").value,
            email: document.getElementById("empresaEmail").value,

            provincia: document.getElementById("input-provincia").value,
            municipio: document.getElementById("input-municipio").value,
            localidad: document.getElementById("input-localidad").value,
            calle: document.getElementById("input-calle").value,
            altura: document.getElementById("input-altura").value,
            adicional: document.getElementById("input-adicional").value,

            latitud: document.getElementById("latitud").value,
            longitud: document.getElementById("longitud").value,

            logo: document.getElementById("logoPreview").src
        };

        localStorage.setItem("perfilEmpresa", JSON.stringify(empresa));

        alert("Perfil de empresa actualizado con éxito ✓");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    cargarDatosEmpresa();
    configurarCambioLogo();
    configurarBotonesEditar();
    configurarBusquedaDireccion();
    configurarSubmitPerfil();
});