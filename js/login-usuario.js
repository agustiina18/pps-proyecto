// js/login-usuario.js
import { API_URL } from './config.js';

async function loginUsuario(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Por favor completá todos los campos.");
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
      alert("¡Inicio de sesión exitoso!");
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', result.token);
      localStorage.setItem('usuario', JSON.stringify(result.usuario));
      
      // Redirigir según tipo de usuario
      if (result.usuario.tipo_usuario === 'EMPRESA') {
        window.location.href = 'home-empresa.html';
      } else {
        window.location.href = 'agenda.html';
      }
    } else {
      alert(`Error: ${result.detail || 'Credenciales incorrectas'}`);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
  }
}

// Conectar la función al formulario cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginUsuarioForm');
  if (form) {
    form.addEventListener('submit', loginUsuario);
  }
});
// Hacer la función global para que el onsubmit la encuentre
window.loginUsuario = loginUsuario;