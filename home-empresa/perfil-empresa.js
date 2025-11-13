document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica para la carga y vista previa de la imagen
    const inputFoto = document.getElementById('inputFotoPerfil');
    const btnCambiarFoto = document.getElementById('btnCambiarFoto');
    const imagenPerfilPrevia = document.getElementById('imagenPerfilPrevia');
    const fotoCirculo = document.querySelector('.foto-circulo');
    const iconoCamara = fotoCirculo.querySelector('.fa-camera');

    // Al hacer click en el botón, activa el input de archivo
    btnCambiarFoto.addEventListener('click', () => {
        inputFoto.click();
    });

    // Evento para mostrar la vista previa
    inputFoto.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Oculta el icono y muestra la imagen
                if (iconoCamara) {
                    iconoCamara.style.display = 'none';
                }
                imagenPerfilPrevia.src = e.target.result;
                imagenPerfilPrevia.style.display = 'block';
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // 2. Lógica para la edición de campos del formulario
    const botonesEditar = document.querySelectorAll('.btn-editar');

    botonesEditar.forEach(btn => {
        btn.addEventListener('click', () => {
            const campoId = btn.getAttribute('data-campo');
            const input = document.getElementById(campoId);

            // Habilita/deshabilita el campo
            const esDeshabilitado = input.disabled;
            input.disabled = !esDeshabilitado;

            // Cambia el ícono y el estilo
            const icono = btn.querySelector('i');
            if (esDeshabilitado) {
                input.focus();
                icono.classList.remove('fa-pencil-alt');
                icono.classList.add('fa-check'); // Icono de guardar/confirmar
                btn.style.color = '#28a745'; // Color verde para indicar edición activa
            } else {
                // Para guardar el valor
                icono.classList.remove('fa-check');
                icono.classList.add('fa-pencil-alt');
                btn.style.color = ''; // Vuelve al color por defecto
            }
        });
    });

    // 3. Función de envío del formulario 
    window.actualizarPerfil = function (event) {
        event.preventDefault();
        alert('Guardando datos...');
        // Acá iría la lógica de fetch() para el endpoint
        // Después de enviar, se deben deshabilitar todos los campos nuevamente.

        // Ejemplo: Deshabilitar todos los campos después de la simulación
        document.querySelectorAll('.perfil-form input').forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('.btn-editar i').forEach(icono => {
            icono.classList.remove('fa-check');
            icono.classList.add('fa-pencil-alt');
            icono.parentElement.style.color = '';
        });
    };
});