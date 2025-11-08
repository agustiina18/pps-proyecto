// --- CONFIGURACIÓN Y CONSTANTES ---

// URL base de tu backend de FastAPI.
const BASE_URL = "http://localhost:8000"; 
// Endpoint específico para la autenticación de usuarios/empresas.
const LOGIN_ENDPOINT = "/auth/login"; 
// Ruta a la que se redirigirá al usuario tras un login exitoso.
const HOME_EMPRESA_URL = "../panel-empresa.html"; 
// Clave usada para almacenar el token de sesión en el almacenamiento local del navegador.
const TOKEN_STORAGE_KEY = 'userToken';

/**
 * Función que maneja el envío del formulario de login.
 * Esta función está ligada al evento onsubmit="login(event)" en el HTML.
 * * Esquema de Input esperado por el backend: UserLogin (email, password)
 * * @param {Event} event - El objeto de evento del formulario (pasado automáticamente por el navegador).
 */
window.login = async function(event) {
    // 1. Evitar el envío de formulario estándar
    event.preventDefault(); 

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    
    // Obtener valores de los campos de entrada
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // 💡 Datos a enviar al backend (coincide con el esquema UserLogin)
    const userData = { email, password };
    const url = `${BASE_URL}${LOGIN_ENDPOINT}`;
    
    // Obtener elemento para mostrar errores (debe estar en el HTML, ej: <p id="loginErrorMsg"></p>)
    const errorMsgElement = document.getElementById("loginErrorMsg");
    if (errorMsgElement) {
        errorMsgElement.textContent = ""; // Limpia cualquier mensaje de error anterior
    }

    try {
        // 2. Realizar la petición fetch (POST)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Indica que el cuerpo es JSON
            },
            body: JSON.stringify(userData), // Convierte el objeto JS a una cadena JSON
        });

        // 3. Manejo de Errores HTTP
        if (!response.ok) { // Si el estado de la respuesta NO es 2xx (ej: 401, 404, 500)
            let errorBody = {};
            try {
                // Intenta leer el cuerpo de la respuesta para obtener el mensaje de error de FastAPI
                errorBody = await response.json(); 
            } catch (e) {
                // Fallback si la respuesta de error no es JSON
                errorBody = { detail: response.statusText || 'Error desconocido' };
            }

            let friendlyMessage = "Error de conexión. Inténtalo de nuevo.";
            if (response.status === 401) {
                // Mensaje específico para credenciales incorrectas
                friendlyMessage = "Email o contraseña incorrectos.";
            } else if (errorBody.detail) {
                // Usa el detalle del error proporcionado por el backend
                friendlyMessage = typeof errorBody.detail === 'string' ? errorBody.detail : JSON.stringify(errorBody.detail);
            }

            // Lanza el error para que el bloque 'catch' lo maneje
            throw new Error(friendlyMessage);
        }

        // 4. Procesar respuesta exitosa (código 2xx)
        // El backend devuelve los datos del usuario (UserConRolesOut) y, crucialmente, el token de acceso.
        const result = await response.json();
        
        // Asume que el token viene en 'access_token' (JWT estándar) o 'token'
        const token = result.access_token || result.token; 

        if (!token) {
            throw new Error("Respuesta exitosa, pero no se encontró el token de acceso.");
        }

        // 5. Guardar el token de sesión
        // El token se guarda en localStorage para ser usado en peticiones posteriores
        // (como en el endpoint GET /{empresa_id}/panel).
        localStorage.setItem(TOKEN_STORAGE_KEY, token); 

        // 6. Redirigir al usuario
        // Lleva al usuario al panel de la empresa.
        window.location.href = HOME_EMPRESA_URL; 

    } catch (error) {
        console.error("Fallo el inicio de sesión:", error);
        
        // 7. Mostrar el error en el HTML
        if (errorMsgElement) {
            errorMsgElement.textContent = error.message || "Error de red inesperado.";
        } else {
            // Fallback si el elemento de error no existe
            alert(`Error de Login: ${error.message}`);
        }
    }
}