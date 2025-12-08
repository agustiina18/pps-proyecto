const cont = document.getElementById("favoritosContainer");
let favoritos = JSON.parse(localStorage.getItem("favoritosEmpresas")) || [];

function generarEstrellas(calificacion) {
    let full = Math.floor(calificacion);
    let half = calificacion % 1 >= 0.5;
    let empty = 5 - full - (half ? 1 : 0);

    let html = "";

    for (let i = 0; i < full; i++) html += `<i class="fa-solid fa-star star-full"></i>`;
    if (half) html += `<i class="fa-solid fa-star-half-stroke star-full"></i>`;
    for (let i = 0; i < empty; i++) html += `<i class="fa-regular fa-star star-empty"></i>`;

    return html;
}

function renderFavoritos() {
    cont.innerHTML = "";

    if (favoritos.length === 0) {
        cont.innerHTML = "<p>No tienes empresas favoritas aún.</p>";
        return;
    }

    favoritos.forEach(emp => {

        const card = document.createElement("div");
        card.className = "favorito-card";

        const rubros = emp.rubro2 ? `${emp.rubro} · ${emp.rubro2}` : emp.rubro;

        card.innerHTML = `
            <img src="${emp.logo}" class="favorito-logo">

            <div class="favorito-info">
                <h3 class="favorito-nombre">${emp.nombre}</h3>
                <p class="favorito-rubro">${rubros}</p>

                <div class="favorito-rating">
                    ${generarEstrellas(emp.calificacion)}
                    <span class="rating-num">${emp.calificacion.toFixed(1)}</span>
                </div>
            </div>

            <span class="favorito-remove">★</span>
        `;

        // Abrir panel de empresa
        card.onclick = (e) => {
            if (e.target.classList.contains("favorito-remove")) return;
            window.location.href = `../panel-empresa/panel-empresa.html?id=${emp.id}`;
        };

        // Quitar favorito
        card.querySelector(".favorito-remove").onclick = () => {
            favoritos = favoritos.filter(f => f.id !== emp.id);
            localStorage.setItem("favoritosEmpresas", JSON.stringify(favoritos));
            renderFavoritos();
        };

        cont.appendChild(card);
    });
}

renderFavoritos();
