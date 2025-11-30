const cont = document.getElementById("favoritosContainer");
let favoritos = JSON.parse(localStorage.getItem("favoritosEmpresas")) || [];

function renderFavoritos() {
    cont.innerHTML = "";

    if (favoritos.length === 0) {
        cont.innerHTML = "<p>No tienes empresas favoritas aún.</p>";
        return;
    }

    favoritos.forEach(emp => {

        const card = document.createElement("div");
        card.className = "favorito-card";

        card.innerHTML = `
            <img src="${emp.logo}" class="favorito-logo">
            <span class="favorito-nombre">${emp.nombre}</span>
            <span class="favorito-remove">★</span>
        `;

        // CLICK EN LA CARD → ir al panel-empresa
        card.onclick = (e) => {
            // Evitar que el click en la estrella abra el perfil
            if (e.target.classList.contains("favorito-remove")) return;

            window.location.href = `../panel-empresa/panel-empresa.html?id=${emp.id}`;
        };

        // CLICK EN LA ESTRELLA → quitar de favoritos
        card.querySelector(".favorito-remove").onclick = () => {
            favoritos = favoritos.filter(f => f.id !== emp.id);
            localStorage.setItem("favoritosEmpresas", JSON.stringify(favoritos));
            renderFavoritos(); // Recargar lista sin refrescar página
        };

        cont.appendChild(card);
    });
}

renderFavoritos();