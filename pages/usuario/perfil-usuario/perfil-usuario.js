document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
        const campoID = btn.getAttribute("data-campo");
        const input = document.getElementById(campoID);

        input.disabled = !input.disabled;

        if (!input.disabled) {
            input.focus();
            btn.innerHTML = '<i class="fas fa-lock-open"></i>';
        } else {
            btn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        }
    });
});

const inputFoto = document.getElementById("inputFotoPerfil");
const btnCambiarFoto = document.getElementById("btnCambiarFoto");
const imagenPreview = document.getElementById("imagenPerfilPrevia");

btnCambiarFoto.addEventListener("click", () => {
    inputFoto.click();
});

inputFoto.addEventListener("change", () => {
    const archivo = inputFoto.files[0];

    if (archivo) {
        const lector = new FileReader();
        lector.onload = () => {
            imagenPreview.src = lector.result;
            imagenPreview.style.display = "block";
        };
        lector.readAsDataURL(archivo);
    }
});

function actualizarPerfilUsuario(event) {
    event.preventDefault();

    alert("Perfil actualizado con éxito ✓");
}

let mapa;
let marcador;

function iniciarMapa() {
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

document.addEventListener("DOMContentLoaded", iniciarMapa);
