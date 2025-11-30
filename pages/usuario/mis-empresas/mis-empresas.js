
//   DATOS DE LAS EMPRESAS 

const misEmpresas = [
    {
        id: 1,
        nombre: "Nails & Beauty Studio",
        rol: "Rol",
        logo: "../../img/icono-perfil.png"
    },
    {
        id: 2,
        nombre: "Barbería Los Pibes",
        rol: "Rol",
        logo: "../../img/icono-perfil.png"
    }

];



//   CARGAR EMPRESAS DINÁMICAMENTE


document.addEventListener("DOMContentLoaded", () => {
    cargarMisEmpresas();
});

function cargarMisEmpresas() {
    const contenedor = document.getElementById("empresasContainer");

    if (!misEmpresas || misEmpresas.length === 0) {
        contenedor.innerHTML = "<p>No tenés empresas asociadas.</p>";
        return;
    }

    contenedor.innerHTML = misEmpresas
        .map(emp => crearCardEmpresa(emp))
        .join("");
}



// CARD DE EMPRESA 

function crearCardEmpresa(emp) {
    return `
        <div class="empresa-card" onclick="irAEmpresa(${emp.id})">

            <div class="empresa-card-header">
                <img src="${emp.logo}" class="empresa-logo">

                <div class="empresa-info">
                    <h3 class="empresa-nombre">${emp.nombre}</h3>
                    <p class="empresa-rol">${emp.rol}</p>
                </div>
            </div>

        </div>
    `;
}



//         ACCESO A HOME-EMPRESA

function irAEmpresa(id) {
    // Esto va a la home de empresa con parámetros
    window.location.href = `../../empresa/home-empresa/home-empresa.html?id=${id}`;
}
