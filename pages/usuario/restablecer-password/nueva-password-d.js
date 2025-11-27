// Estilos del modal 
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

/* #modal-btn */
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
    background: #AC0505; 
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { transform: scale(0.9); opacity: 0; }
    to  { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(estiloModal);

/**
 * Función principal de llamada para enviar el formulario.
 * @param {Event} event - Envío del formulario.
 */
function resetearClave(event) {
    event.preventDefault();

    const nuevaClave = document.getElementById('nueva-clave').value;
    const confirmacionClave = document.getElementById('confirmacion-clave').value;

    if (nuevaClave.length < 6) {
        mostrarModal("❌ Error:<br>La contraseña debe tener al menos 6 caracteres.", "Aceptar"); 
        return;
    }

    if (nuevaClave !== confirmacionClave) {
        mostrarModal("❌ Error:<br>Las contraseñas no coinciden.", "Aceptar");
        return;
    }
    
    // Simulación de restablecimiento exitoso
    const urlRedireccion = '../../../index.html'; // Cambiar según la ruta real
    
    
    mostrarModal(
        "✅ Éxito:<br>Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.", 
        "Ir a Iniciar Sesión", 
        urlRedireccion
    );
}

/**
 * Muestra el modal 
 * @param {string} mensajeHTML - Mensaje a mostrar 
 * @param {string} textoBoton - Texto del botón de cierre.
 * @param {string} [urlDestino] - URL para redirigir al cerrar el modal (si es que se usa).
 */
function mostrarModal(mensajeHTML, textoBoton, urlDestino) {
    const overlay = document.getElementById('modal-overlay');
    //  Se busca el ID correcto en el HTML: 'modal-mensaje'
    const mensajeElemento = document.getElementById('modal-mensaje'); 
    //  Se busca el ID correcto en el HTML: 'modal-btn'
    const boton = document.getElementById('modal-btn'); 

    // innerHTML para permitir el tag <br>
    mensajeElemento.innerHTML = mensajeHTML; 
    boton.textContent = textoBoton;

    overlay.classList.add('mostrar');

    // Limpiar 
    boton.onclick = null; 

    boton.onclick = () => {
        overlay.classList.remove('mostrar');
        if (urlDestino) {
            window.location.href = urlDestino;
        }
    };
}