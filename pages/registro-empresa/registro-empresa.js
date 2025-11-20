// VARIABLES DE CONFIGURACIÓN 
const BASE_URL = "http://localhost:8000"; // URL base API de FastAPI
const LOGIN_URL_REDIRECT = "./index.html"; // URL de a donde redirigir

//  REFERENCIAS A ELEMENTOS DEL DOM 
const formRegistro = document.getElementById('form-registro');
const btnSubirLogo = document.getElementById('btn-subir-logo'); 
const logoFileInput = document.getElementById('logo-file'); 
const logoPlaceholder = document.getElementById('logo-placeholder'); 
const btnRegistro = document.getElementById('btn-registro');

// Referencias del Modal
const miModal = document.getElementById('miModal');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');


// 
// LÓGICA DEL MODAL DE NOTIFICACIÓN

/**
 * Muestra el modal de notificación con el título y mensaje especificados.
 * @param {string} titulo El título del modal.
 * @param {string} mensaje El cuerpo del mensaje.
 * @param {string} tipo 'success' o 'error'.
 */
function mostrarModal(titulo, mensaje, tipo = 'info') {
    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    
    // Limpiar clases anteriores
    miModal.classList.remove('modal-success', 'modal-error');
    
    // Asignar clase para estilo de éxito/error
    if (tipo === 'success') {
        miModal.classList.add('modal-success');
    } else if (tipo === 'error') {
        miModal.classList.add('modal-error');
    }
    
    miModal.style.display = 'block';
}

function cerrarModal() {
    miModal.style.display = 'none';
    // Opcional: limpiar estilos
    miModal.classList.remove('modal-success', 'modal-error');
}

// Hacer que la función de cerrar sea globalmente accesible desde el HTML
window.cerrarModal = cerrarModal;


// FUNCIONES AUXILIARES DEL FORMULARIO
// Función para restablecer el estado del botón
function resetearBoton() {
    btnRegistro.textContent = "Crear Empresa";
    btnRegistro.disabled = false;
}


// Subir Logo 
document.addEventListener('DOMContentLoaded', function() {
    if (btnSubirLogo && logoFileInput && logoPlaceholder) {
        
        btnSubirLogo.addEventListener('click', function() {
            logoFileInput.click();
        });

        logoFileInput.addEventListener('change', function() {
            if (logoFileInput.files.length > 0) {
                const file = logoFileInput.files[0];
                const fileName = file.name;
                const fileType = file.type;
                
                if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
                    mostrarModal("Error de Archivo", "Solo se permiten archivos JPG o PNG.", 'error');
                    logoFileInput.value = "";
                    logoPlaceholder.textContent = "Subir Logo (Solo JPG o PNG)";
                    logoPlaceholder.style.color = '#777';
                    return;
                }

                const maxSize = 25; 
                let displayFileName = fileName;
                if (fileName.length > maxSize) {
                    displayFileName = fileName.substring(0, maxSize - 3) + '...';
                }
                
                logoPlaceholder.textContent = `Archivo seleccionado: ${displayFileName}`;
                logoPlaceholder.style.color = '#333'; 

            } else {
                logoPlaceholder.textContent = "Subir Logo (Solo JPG o PNG)";
                logoPlaceholder.style.color = '#777'; 
            }
        });
    }

    // Cerrar modal
    window.onclick = function(event) {
        if (event.target == miModal) {
            cerrarModal();
        }
    }
});


// Registrar Empresa 
async function registrarEmpresa(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-empresa').value;
    const cuit = document.getElementById('cuit').value;
    const rubro = document.getElementById('rubro').value;
    const segundoRubro = document.getElementById('segundo-rubro').value; 
    const email = document.getElementById('email').value;
    const password = ""; 
    const direccion = document.getElementById('direccion').value; 
    const telefono = document.getElementById('telefono').value; 
    const logoFile = logoFileInput.files[0];
    
    // Obtener Coordenadas del Mapa (Inputs Ocultos)
    const latitud = document.getElementById('latitud').value;
    const longitud = document.getElementById('longitud').value;

    // Validación de coordenadas (asegurar que no sean N/A)
    if (!latitud || !longitud || latitud === "N/A") {
        mostrarModal("Ubicación Requerida", "Por favor, ajusta el marcador en el mapa para confirmar la ubicación de tu empresa.", 'error');
        return;
    }
    
    if (logoFile && (logoFile.type !== 'image/jpeg' && logoFile.type !== 'image/png')) {
         mostrarModal("Error de Archivo", "El archivo de logo seleccionado no es JPG o PNG.", 'error');
         return;
    }


    btnRegistro.textContent = "Registrando...";
    btnRegistro.disabled = true;

    // Objeto de Datos  
    const telefonosArray = telefono ? [parseInt(telefono.replace(/\D/g, ''))] : [];
    const rubrosCombinados = segundoRubro ? `${rubro}, ${segundoRubro}` : rubro;

    const datosEmpresa = {
        cuit: parseInt(cuit), 
        nombre: nombre,
        rubro: rubrosCombinados,
        email: email,
        direccion: { 
            domicilio: direccion,
            // Usamos las coordenadas del mapa
            lat: parseFloat(latitud), 
            lng: parseFloat(longitud),
            aclaracion: document.getElementById('datos-adicionales').value || null
        },
        telefonos: telefonosArray,
        email_de_usuario: email, 
        password_de_usuario: password 
    };


    try {
        const response = await fetch(`${BASE_URL}/empresas/`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEmpresa)
        });

        if (response.ok) {
            
            // Éxito: Registro completado.
            mostrarModal("¡Registro Exitoso! ✅", "Tu empresa ha sido registrada correctamente. Serás redirigido al inicio de sesión.", 'success');
            
            // Redirigir al login
            setTimeout(() => {
                window.location.href = LOGIN_URL_REDIRECT;
            }, 3000); 
            
            if (logoFile) {
                console.log("Simulando subida de logo con otro endpoint...");
            }

        } else {
            // Error del servidor (400, 422, etc.)
            const errorData = await response.json();
            const errorMessage = errorData.detail || "Error desconocido al registrar la empresa. Por favor, revisa los datos.";
            
            mostrarModal("Error al Registrar ❌", errorMessage, 'error');
            resetearBoton();
        }

    } catch (error) {
        // Error de red
        console.error("Error de conexión:", error);
        mostrarModal("Error de Conexión ⚠️", "No se pudo conectar al servidor. Asegúrate de que tu API esté funcionando.", 'error');
        resetearBoton();
    }
}

// Globalmente accesible desde el HTML
window.registrarEmpresa = registrarEmpresa;