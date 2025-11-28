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

