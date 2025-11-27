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

// Efecto "typewriter" para el <span> dentro de #titulo 
(function () {
    const span = document.querySelector('#titulo span');
    if (!span) return;

    const originalText = span.textContent.trim();

    function typeText(el, text, delay = 100) {
        el.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            el.textContent += text.charAt(i);
            i++;
            if (i >= text.length) clearInterval(timer);
        }, delay);
    }

    // Cuando cargue la página, inicia la animación una sola vez
    document.addEventListener('DOMContentLoaded', () => {
        
        setTimeout(() => {
            typeText(span, originalText, 120);
        }, 250);
    });
})();

// ==== Olvido de clave ==== 
function olvidoClave(event) {
    event.preventDefault();
    window.location.href = './pages/usuario/restablecer-password/forgot-password.html';
}

// ==== Login con Google ==== 
function entrarConGoogle() {
    console.log("Entrar con Google");
}

// ==== Crear cuenta ==== 
function crearCuenta() {
    window.location.href = './pages/usuario/registro-usuario/registro-usuario.html';
}

//SISTEMA DE MODALES (Eliminado)
