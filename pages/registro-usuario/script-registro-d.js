// --- Elementos del DOM ---
const body = document.getElementById('body');
const formRegistro = document.getElementById('form-registro');

// --- Función para crear el modal (estructura y estilos básicos) ---
function crearModal(titulo, mensaje, tipo) {
    // Eestilos y contenido
    const claseTipo = tipo === 'success' ? 'modal-success' : 'modal-error';
    const iconoTipo = tipo === 'success' ? 'fa-check-circle' : 'fa-times-circle';
    const colorIcono = tipo === 'success' ? '#28a745' : '#dc3545';
    
    // Crear el fondo (overlay)
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(3px);
        opacity: 0; /* Inicialmente transparente */
        transition: opacity 0.3s ease;
    `;

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.id = 'modal-content';
    modalContent.className = claseTipo;
    modalContent.style.cssText = `
        background-color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: scale(0.8); /* Inicialmente pequeño */
        transition: transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    // HTML interno
    modalContent.innerHTML = `
        <i class="fas ${iconoTipo}" style="font-size: 60px; color: ${colorIcono}; margin-bottom: 20px;"></i>
        <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: 700;">${titulo}</h2>
        <p style="margin: 0 0 30px; font-size: 16px; color: #555;">${mensaje}</p>
        <button id="modal-close-btn" class="btn-rojo" style="
            padding: 10px 25px; /* Ajuste para que se vea bien */
            font-size: 18px;
            width: 100%;
        ">Aceptar</button>
    `;

    // Agregar y mostrar
    modalOverlay.appendChild(modalContent);
    body.appendChild(modalOverlay);

    // Activar transiciones de entrada
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // 6. Función para cerrar y eliminar el modal
    const cerrarModal = () => {
        modalOverlay.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (body.contains(modalOverlay)) {
                body.removeChild(modalOverlay);
            }
        }, 300);
    };

    // 7. Evento para cerrar
    document.getElementById('modal-close-btn').addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });
    
    return { cerrarModal }; // Devolver la función de cierre por si se necesita externamente
}

// --- Función principal de registro ---
function registrarUsuario(event) {
    // Prevenir el envío por defecto
    event.preventDefault(); 
    
    // Recolectar datos
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const datosAdicionales = document.getElementById('datos adicionales').value.trim(); 
    const email = document.getElementById('email').value.trim();
    const clave = document.getElementById('clave').value;

    const datosRegistro = {
        nombre, apellido, dni, telefono, direccion, datosAdicionales, email, clave
    };

    console.log('Intentando registrar:', datosRegistro);

    // --- SIMULACIÓN DE RESPUESTAS ---
    
    // Error si el DNI es '123'
    if (dni === '123') {
        crearModal(
            '⚠️ Error de Registro', 
            'El DNI ingresado ya existe en nuestra base de datos. Por favor, revisa tus datos o inicia sesión.', 
            'error'
        );
        return; 
    }
    
    // Error si el email es 'error@mail.com'
    if (email === 'error@mail.com') {
        crearModal(
            '⚠️ Email Inválido', 
            'El correo electrónico proporcionado no es válido o ya está en uso. Intenta con otro.', 
            'error'
        );
        return; 
    }

    // Éxito en el registro
    const { cerrarModal } = crearModal(
        '¡Registro Exitoso!', 
        'Tu cuenta ha sido creada correctamente. Serás redirigido para iniciar sesión.', 
        'success'
    );
    
    // Limpiar formulario y redirigir 
    setTimeout(() => {
        cerrarModal();
        formRegistro.reset();
        // Redirigir al índice (página de inicio de sesión)
        window.location.href = '../login/login-usuario.html'; 
    }, 4000); 

}
