const params = new URLSearchParams(window.location.search);
const empresaId = Number(params.get("id"));


const empresa = Array.isArray(datosEmpresas)
    ? datosEmpresas.find(e => e.id === empresaId)
    : null;


if (empresa) {
    const nombreEl = document.getElementById("empresaNombre");
    const rubroEl = document.getElementById("empresaRubro");
    const direccionEl = document.getElementById("empresaDireccion");
    const telefonoEl = document.getElementById("empresaTelefono");
    const calificacionEl = document.getElementById("empresaCalificacion");
    const logoEl = document.getElementById("empresaLogo");
    const linkMapsEl = document.getElementById("empresaLinkMaps");
    const emailEl = document.getElementById("empresaEmail");
    const btnReservar = document.getElementById("btnReservar");

    if (nombreEl) nombreEl.textContent = empresa.nombre || "";

    // Rubro + segundo rubro
    if (rubroEl) {
        if (empresa.rubro2) {
            rubroEl.textContent = `${empresa.rubro} - ${empresa.rubro2}`;
        } else {
            rubroEl.textContent = empresa.rubro || "";
        }
    }

    if (direccionEl) direccionEl.textContent = empresa.direccion || "";

    if (telefonoEl) telefonoEl.textContent = empresa.telefono || "—";

    if (emailEl) emailEl.textContent = empresa.email || "—";


    if (calificacionEl) {
        if (empresa.calificacion !== undefined && empresa.calificacion !== null) {
            const calificacion = empresa.calificacion;

            const estrellasLlenas = Math.floor(calificacion);
            const mediaEstrella = calificacion % 1 >= 0.5 ? 1 : 0;
            const estrellasVacias = 5 - estrellasLlenas - mediaEstrella;

            let html = "";
            html += "⭐".repeat(estrellasLlenas);
            html += mediaEstrella ? "✩" : "";
            html += "☆".repeat(estrellasVacias);

            calificacionEl.innerHTML = `${html} <span class="calificacion-num">(${calificacion})</span>`;
        } else {
            calificacionEl.textContent = "—";
        }
    }

    if (logoEl && empresa.logo) {
        logoEl.src = empresa.logo;
    }

    if (linkMapsEl) {
        if (empresa.linkMaps) {
            linkMapsEl.href = empresa.linkMaps;
            linkMapsEl.style.display = "inline";
        } else {
            linkMapsEl.style.display = "none";
        }
    }

    if (btnReservar) {
        btnReservar.onclick = () => {
            window.location.href =
                `../reservar-turno/reservar-turno.html?id=${empresaId}`;
        };
    }
} else {
    console.warn("No se encontró la empresa con id:", empresaId);
}


//   FAVORITOS


let favoritos = JSON.parse(localStorage.getItem("favoritosEmpresas")) || [];

function estaEnFavoritos(id) {
    return favoritos.some(f => f.id === id);
}

function actualizarBotonFavorito() {
    const btn = document.getElementById("btnFavorito");
    if (!btn || !empresa) return;

    if (estaEnFavoritos(empresa.id)) {
        btn.textContent = "★ Quitar de favoritos";
        btn.classList.add("remover");
    } else {
        btn.textContent = "★ Agregar a favoritos";
        btn.classList.remove("remover");
    }
}

// Inicializar estado del botón de favoritos
if (empresa) {
    actualizarBotonFavorito();

    const btnFavorito = document.getElementById("btnFavorito");
    if (btnFavorito) {
        btnFavorito.onclick = () => {
            if (estaEnFavoritos(empresa.id)) {
                // Quitar
                favoritos = favoritos.filter(f => f.id !== empresa.id);
                alert("Empresa quitada de favoritos");
            } else {
                // Agregar
                favoritos.push({
                    id: empresa.id,
                    nombre: empresa.nombre,
                    rubro: empresa.rubro,
                    rubro2: empresa.rubro2,
                    direccion: empresa.direccion,
                    telefono: empresa.telefono,
                    email: empresa.email,
                    logo: empresa.logo || "../../img/icono-perfil.png",
                    calificacion: empresa.calificacion
                });
                alert("Empresa agregada a favoritos");
            }

            localStorage.setItem(
                "favoritosEmpresas",
                JSON.stringify(favoritos)
            );
            actualizarBotonFavorito();
        };
    }
}
