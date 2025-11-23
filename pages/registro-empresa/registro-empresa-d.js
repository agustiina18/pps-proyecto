// VARIABLES DE CONFIGURACIÓN 
const BASE_URL = "http://localhost:8000"; // URL base API 
const LOGIN_URL_REDIRECT = "../login/login-usuario.html"; 

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


// Registrar Empresa (SIMULACION)
async function registrarEmpresa(event) {
    event.preventDefault();

    // Obtención y validación de datos
    const latitud = document.getElementById('latitud').value;
    const longitud = document.getElementById('longitud').value;
    const logoFile = logoFileInput.files[0];

    // 1. Validación de coordenadas (asegurar que no sean N/A)
    if (!latitud || !longitud || latitud === "N/A") {
        mostrarModal("Ubicación Requerida", "Por favor, ajusta el marcador en el mapa para confirmar la ubicación de tu empresa.", 'error');
        return;
    }
    
    // 2. Validación de tipo de archivo para el logo
    if (logoFile && (logoFile.type !== 'image/jpeg' && logoFile.type !== 'image/png')) {
         mostrarModal("Error de Archivo", "El archivo de logo seleccionado no es JPG o PNG.", 'error');
         return;
    }

    // SIMULACIÓN DE REGISTRO EXITOSO
    btnRegistro.textContent = "Registrando...";
    btnRegistro.disabled = true;

    // Simulación de tiempo de carga (1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Éxito: Registro completado y redirección
    mostrarModal("¡Registro Exitoso!", "Tu empresa ha sido registrada correctamente. Serás redirigido al inicio.", 'success');
            
    // Redirigir 
    setTimeout(() => {
        window.location.href = LOGIN_URL_REDIRECT; 
    }, 3000); // 3 segundos antes de redirigir
}

// Globalmente accesible desde el HTML
window.registrarEmpresa = registrarEmpresa;