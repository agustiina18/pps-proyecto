// js/login-empresa.js
import { API_URL } from './config.js';

async function login(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Por favor, ingresa tu correo electrónico y contraseña.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert('¡Inicio de sesión exitoso!');

            // Guardar datos en localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('usuario', JSON.stringify(result.usuario));

            // Redirigir a home de empresa
            window.location.href = 'home-empresa.html';
        } else {
            alert(`Error al iniciar sesión: ${result.detail || 'Credenciales incorrectas'}`);
        }
    } catch (error) {
        console.error('Error de red o del servidor:', error);
        alert('Hubo un problema de conexión. Por favor, intentá de nuevo más tarde.');
    }
}
// Hacer la función global
window.login = login;