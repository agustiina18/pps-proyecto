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

#modal-btn {
    margin-top: 1.5rem;
    /* Usando la variable CSS --rojo-principal de password.css */
    background: var(--rojo-principal); 
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-size: 20px;
    cursor: pointer;
    transition: 0.2s;
}

#modal-btn:hover {
    /* Usando la variable CSS --rojo-hover de password.css */
    background: var(--rojo-hover); 
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { transform: scale(0.9); opacity: 0; }
    to  { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(estiloModal);

/**
* @param {Event} event - Envío del formulario.
 */
function restablecerClave(event) {
    event.preventDefault();

    const emailInput = document.getElementById('resetEmail');
    const email = emailInput.value.trim();

    if (!email) {
        // 🎯 Ahora la función existe
        mostrarModalError('Por favor, ingresa tu email.');
        return;
    }
    
    // Simulación de éxito
    const mensajeExito = "✅ Se ha enviado un enlace de restablecimiento a " + email + ". Revisa tu correo.";
    
    mostrarModalExito(mensajeExito); 

    emailInput.value = '';
}

/**
 * Muestra un modal de éxito 
 * @param {string} mensaje - El mensaje a mostrar.
 * @param {string} [urlDestino] - La URL a la que redirigir (si es que se usa).
 */
function mostrarModalExito(mensaje, urlDestino) {
    const overlay = document.getElementById('modal-overlay');
    const mensajeElemento = document.getElementById('modal-mensaje');
    const boton = document.getElementById('modal-btn');

    mensajeElemento.textContent = mensaje;
    overlay.classList.add('mostrar');

    const manejarClick = () => {
        overlay.classList.remove('mostrar');

        boton.removeEventListener('click', manejarClick); 
        

        if (urlDestino) {
            window.location.href = urlDestino;
        }
    };
    
    boton.textContent = "Aceptar"; 
    boton.addEventListener('click', manejarClick);
}

/**
 * odal de error.
 * @param {string} mensaje 
 */
function mostrarModalError(mensaje) {
    const overlay = document.getElementById('modal-overlay');
    const mensajeElemento = document.getElementById('modal-mensaje');
    const boton = document.getElementById('modal-btn');

    // innerHTML para permitir íconos o etiquetas
    mensajeElemento.innerHTML = "❌ Error:<br>" + mensaje; 
    
    overlay.classList.add('mostrar');

    const manejarClick = () => {
        overlay.classList.remove('mostrar');
        boton.removeEventListener('click', manejarClick);
    };
    
    boton.textContent = "Aceptar"; 
    boton.addEventListener('click', manejarClick);
}