// ================================
// ESTILOS DEL MODAL
// ================================
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
    background: #AC0505;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s ease;
}

#modal-btn:hover {
    background: #8c0404;
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(estiloModal);


// ================================
// RESTABLECER CONTRASEÑA (VÍA EMAIL)
// ================================
function resetearClave(event) {
    event.preventDefault();

    const nuevaClave = document.getElementById('nueva-clave').value.trim();
    const confirmacion = document.getElementById('confirmacion-clave').value.trim();

    if (nuevaClave.length < 6) {
        mostrarModal("❌ La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (nuevaClave !== confirmacion) {
        mostrarModal("❌ Las contraseñas no coinciden.");
        return;
    }

    mostrarModal(
        "✅ Tu contraseña ha sido restablecida correctamente.",
        "../../../index.html"
    );
}


// ================================
// MODAL
// ================================
function mostrarModal(mensajeHTML, urlDestino) {
    const overlay = document.getElementById('modal-overlay');
    const mensaje = document.getElementById('modal-mensaje');
    const btn = document.getElementById('modal-btn');

    mensaje.innerHTML = mensajeHTML;
    overlay.classList.add('mostrar');

    btn.onclick = () => {
        overlay.classList.remove('mostrar');
        if (urlDestino) window.location.href = urlDestino;
    };
}
