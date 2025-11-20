// inputs
const correoInput = document.getElementById("correo");
const claveInput = document.getElementById("clave");

// ==== Iniciar sesión ====
function iniciarSesion(event) {
    event.preventDefault();

    // Botón de login
    const botonLogin = document.getElementById("btn-login");

    // Se cambia el texto del botón
    botonLogin.textContent = "Iniciando sesión...";
    botonLogin.disabled = true;

    // Simulación de proceso de inicio de sesión a 2 segundos
    setTimeout(() => {
        botonLogin.textContent = "Iniciar Sesión";
        botonLogin.disabled = false;
    }, 2000);

}

// ==== Olvido de clave ====
function olvidoClave(event) {
    event.preventDefault();
    mostrarModal("Recuperar contraseña", "Por favor aguardar...");
}

// ==== Login con Google ====
function entrarConGoogle() {
    mostrarModal("Iniciando sesión con Google","Por favor aguardar...");
}

// ==== Crear cuenta ====
function crearCuenta() {
    mostrarModal("Crear Cuenta", "Serás redirigido al formulario de registro.");
}

// ================ SISTEMA DE MODALES =================

function mostrarModal(titulo, mensaje) {
    let modal = document.getElementById("modal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal";
        modal.className = "modal-overlay";
        modal.innerHTML = `
            <div class="modal-card">
                <h2 id="modal-titulo"></h2>
                <p id="modal-texto"></p>
                <button id="modal-btn">Aceptar</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("modal-btn").onclick = cerrarModal;
    }

    document.getElementById("modal-titulo").innerHTML = titulo;
    document.getElementById("modal-texto").innerHTML = mensaje;

    modal.classList.add("mostrar");
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("mostrar");
}


// === ESTILOS DEL MODAL ====
const estiloModal = document.createElement('style');
estiloModal.innerHTML = `
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-overlay.mostrar {
    display: flex;
}

.modal-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    animation: fadeIn 0.25s ease;
}

#modal-btn {
    margin-top: 1.5rem;
    background: var(--rojo);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
}

#modal-btn:hover {
    background: #920303;
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(estiloModal);