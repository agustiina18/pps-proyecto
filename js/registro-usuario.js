// js/registro-usuario.js
import { API_URL } from './config.js';

async function registrarUsuario(event) {
  event.preventDefault();

  const nombre = document.getElementById("regNombreEmpresa").value.trim();
  const apellido = document.getElementById("regApellido")?.value.trim() || "";
  const email = document.getElementById("regEmail").value.trim();
  const telefono = document.getElementById("regTelefono").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!nombre || !email || !telefono || !password) {
    alert("Por favor completá todos los campos obligatorios.");
    return;
  }

  const usuario = {
    nombre,
    apellido,
    email,
    telefono,
    password,
    tipo_usuario: "CLIENTE"
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    const result = await response.json();

    if (response.ok) {
      alert("¡Cuenta creada exitosamente!");
      document.getElementById("registroUsuarioForm").reset();
      
      // Redirigir a página de login
      window.location.href = 'login-usuario.html';
    } else {
      alert(`Error: ${result.detail || 'No se pudo crear la cuenta'}`);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
  }
}
// Hacer la función global
window.registrarUsuario = registrarUsuario;