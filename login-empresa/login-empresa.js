const login = async (event) => {
    event.preventDefault(); // Evita que la página se recargue

    // Obtiene los valores del formulario
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Valida que los campos no estén vacíos
    if (!email || !password) {
        alert('Por favor, ingresa tu correo electrónico y contraseña.');
        return; // Detiene la ejecución si los campos están vacíos
    }

    // Si los campos están completos, se envianlos datos
    const loginData = {
        email: email,
        password: password
    };
    
    // Integración con el back
    try {
        const response = await fetch('http://supuestobackdeejemplo-api.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        // Procesando la respuesta del servidor
        if (response.ok) {
            alert('¡Inicio de sesión exitoso!');

            // Guardar datos en el almacenamiento local
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userType', result.userType);
            localStorage.setItem('token', result.token);

            // Redirigir al usuario a la página correspondiente
            if (result.userType === 'empresa') {
                window.location.href = '/dashboard-empresa.html';
            } else {
                window.location.href = '/dashboard-usuario.html';
            }

        } else {
            // El inicio de sesión falló
            // Mostrar un mensaje específico si el servidor lo proporciona
            alert('Error al iniciar sesión: ' + result.message);
        }

    } catch (error) {
        console.error('Error de red o del servidor:', error);
        alert('Hubo un problema de conexión. Por favor, inténtalo de nuevo más tarde.');
    }
};