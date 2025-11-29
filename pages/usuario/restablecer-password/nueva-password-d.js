// ==============================================
//  CÓDIGO DE VALIDACIÓN – TOKEN ENVIADO POR WSP
//  (Simulado — en producción vendrá del backend)
// ==============================================
const CODIGO_VALIDO = "123456"; 
// Cambiar por el token real que retorna el backend


// ==============================================
// ESTILOS DEL MODAL (AUTO-INYECTADOS)
// ==============================================
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

/* Botón del modal */
#modal-btn { 
    margin-top: 1.5rem;
    background: #AC0505; 
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
}

#modal-btn:hover {
    background: #8c0404; 
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { transform: scale(0.9); opacity: 0; }
    to  { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(estiloModal);



// ==============================================
// FUNCIÓN PRINCIPAL: RESTABLECER CONTRASEÑA
// ==============================================
function resetearClave(event) {
    event.preventDefault();

    // Campos
    const codigoIngresado = document.getElementById('codigo-recibido').value.trim();
    const nuevaClave = document.getElementById('nueva-clave').value.trim();
    const confirmacionClave = document.getElementById('confirmacion-clave').value.trim();


    // ==========================
    // 1. VALIDAR CÓDIGO
    // ==========================
    if (codigoIngresado === "") {
        mostrarModal("❌ Debes ingresar el código recibido.", "Aceptar");
        return;
    }

    if (codigoIngresado !== CODIGO_VALIDO) {
        mostrarModal("❌ Código incorrecto.<br>Verifica el código enviado por WhatsApp.", "Reintentar");
        return;
    }


    // ==========================
    // 2. VALIDAR CONTRASEÑA
    // ==========================
    if (nuevaClave.length < 6) {
        mostrarModal("❌ La contraseña debe tener al menos 6 caracteres.", "Aceptar");
        return;
    }

    if (nuevaClave !== confirmacionClave) {
        mostrarModal("❌ Las contraseñas no coinciden.", "Aceptar");
        return;
    }


    // ==========================
    // 3. SIMULACIÓN DE ÉXITO
    // ==========================
    const urlRedireccion = '../../../index.html';

    mostrarModal(
        "✅ Éxito:<br>Tu contraseña ha sido restablecida correctamente.",
        "Ir a Iniciar Sesión",
        urlRedireccion
    );
}



// ==============================================
// FUNCIÓN DEL MODAL
// ==============================================
function mostrarModal(mensajeHTML, textoBoton, urlDestino) {

    const overlay = document.getElementById('modal-overlay');
    const mensajeElemento = document.getElementById('modal-mensaje');
    const boton = document.getElementById('modal-btn');

    mensajeElemento.innerHTML = mensajeHTML;
    boton.textContent = textoBoton;

    overlay.classList.add('mostrar');

    boton.onclick = () => {
        overlay.classList.remove('mostrar');

        if (urlDestino) {
            window.location.href = urlDestino;
        }
    };
}
