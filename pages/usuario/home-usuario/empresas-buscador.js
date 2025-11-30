//      BUSCADOR DE EMPRESAS 

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("busquedaTurnos");
    const contTurnos = document.getElementById("cardsContainer");
    const contEmpresas = document.getElementById("empresasContainer");
const contFiltros = document.querySelector(".filters");


    input.addEventListener("input", (e) => {
        const texto = e.target.value.trim().toLowerCase();

        //  SI EL BUSCADOR ESTÁ VACÍO

        if (texto === "") {
            contEmpresas.style.display = "none";
            contTurnos.style.display = "grid";
            contFiltros.style.display = "flex";
            return;
        }

        //  SI HAY TEXTO → BUSCAR EMPRESAS

        contTurnos.style.display = "none";
        contFiltros.style.display = "none";

        contEmpresas.style.display = "grid";
        contEmpresas.style.position = "relative";

        const filtradas = datosEmpresas.filter(emp =>
            emp.nombre.toLowerCase().includes(texto) ||
            emp.rubro.toLowerCase().includes(texto)
        );

        contEmpresas.innerHTML = filtradas.length
            ? filtradas.map(emp => crearCardEmpresa(emp)).join("")
            : `<p class="no-resultados">No se encontraron empresas</p>`;
    });
});



//   CREAR TARJETA DE EMPRESA

function crearCardEmpresa(emp) {

    let fullStars = Math.floor(emp.calificacion);
    let halfStar = emp.calificacion % 1 >= 0.5;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let estrellasHTML = '';

    for (let i = 0; i < fullStars; i++)
        estrellasHTML += `<i class="fa-solid fa-star star-full"></i>`;

    if (halfStar)
        estrellasHTML += `<i class="fa-solid fa-star-half-stroke star-full"></i>`;

    for (let i = 0; i < emptyStars; i++)
        estrellasHTML += `<i class="fa-regular fa-star star-empty"></i>`;

    return `
        <div class="empresa-card" onclick="window.location.href='../../usuario/panel-empresa/panel-empresa.html?id=${emp.id}'">
            <img src="${emp.logo}" class="empresa-logo" alt="Logo empresa">

            <div class="empresa-info">
                <h3>${emp.nombre}</h3>
                <p class="empresa-rubro">${emp.rubro}</p>

                <div class="empresa-rating">
                    ${estrellasHTML}
                    <span class="rating-num">${emp.calificacion.toFixed(1)}</span>
                </div>
            </div>
        </div>
    `;
}

