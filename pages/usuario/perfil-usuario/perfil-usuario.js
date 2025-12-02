let mapa;
let marcador;

function cargarDatosUsuario() {
    const usuario = JSON.parse(localStorage.getItem("perfilUsuario"));
    if (!usuario) return;

    const campos = {
        usuarioNombre: usuario.nombre,
        usuarioCuit: usuario.cuit,
        usuarioRubro: usuario.rubro,
        usuarioRubro2: usuario.rubro2,
        usuarioTelefono: usuario.telefono,
        usuarioEmail: usuario.email,
        "input-provincia": usuario.provincia,
        "input-municipio": usuario.municipio,
        "input-localidad": usuario.localidad,
        "input-calle": usuario.calle,
        "input-altura": usuario.altura,
        "input-adicional": usuario.adicional,
    };

    Object.keys(campos).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = campos[id] || "";
    });

    if (usuario.latitud && usuario.longitud) {
        document.getElementById("latitud").value = usuario.latitud;
        document.getElementById("longitud").value = usuario.longitud;

        setTimeout(() => {
            marcador.setLatLng([usuario.latitud, usuario.longitud]);
            mapa.setView([usuario.latitud, usuario.longitud], 16);
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
    const form = document.getElementById("formPerfilUsuario");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = {
            nombre: document.getElementById("usuarioNombre").value,
            cuit: document.getElementById("usuarioApellido").value,
            rubro: document.getElementById("usuarioDni").value,
            rubro2: document.getElementById("usuarioTelefono").value,
            telefono: document.getElementById("usuarioEmail").value,
            email: document.getElementById("usuarioPassword").value,

            provincia: document.getElementById("input-provincia").value,
            municipio: document.getElementById("input-municipio").value,
            localidad: document.getElementById("input-localidad").value,
            calle: document.getElementById("input-calle").value,
            altura: document.getElementById("input-altura").value,
            adicional: document.getElementById("input-adicional").value,

            latitud: document.getElementById("latitud").value,
            longitud: document.getElementById("longitud").value,

        };

        localStorage.setItem("perfilUsuario", JSON.stringify(usuario));

        alert("Perfil actualizado con éxito ✓");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    cargarDatosUsuario();
    configurarBotonesEditar();
    configurarBusquedaDireccion();
    configurarSubmitPerfil();
});