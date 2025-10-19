// ejemplos/registro-empresa.js
// CÓDIGO DE REFERENCIA PARA EL EQUIPO FRONTEND

import { API_URL } from './config.js';

/**
 * Carga las categorías en el selector del formulario
 */
async function cargarCategoriasEnSelector() {
  try {
    const response = await fetch(`${API_URL}/api/v1/categorias`, {
      method: 'GET'
    });

    const data = await response.json();

    if (response.ok) {
      const categorias = Array.isArray(data) ? data : data.categorias;
      const select = document.getElementById('regCategoria');
      
      if (!select) {
        console.warn('No se encontró el selector de categorías. Agregarlo al HTML.');
        return;
      }
      
      select.innerHTML = '<option value="">Selecciona una categoría</option>';
      
      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.categoria_id;
        option.textContent = cat.nombre;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

/**
 * Registra una nueva empresa
 */
async function registrarEmpresa(event) {
  event.preventDefault();

  const nombre = document.getElementById('regNombreEmpresa').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const telefono = document.getElementById('regTelefono').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const repetirPassword = document.getElementById('regRepetirPassword').value.trim();
  const categoriaId = document.getElementById('regCategoria')?.value;
  const latitud = document.getElementById('latitud')?.value;
  const longitud = document.getElementById('longitud')?.value;

  // Validaciones
  if (!nombre || !email || !telefono || !password) {
    alert('Por favor completá todos los campos obligatorios.');
    return;
  }

  if (password !== repetirPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  if (!categoriaId) {
    alert('Por favor seleccioná una categoría.');
    return;
  }

  const empresa = {
    nombre,
    apellido: "", // Las empresas no usan apellido
    email,
    telefono,
    password,
    tipo_usuario: "EMPRESA",
    categoria_id: parseInt(categoriaId)
  };

  // Agregar coordenadas si están disponibles
  if (latitud && longitud) {
    empresa.latitud = parseFloat(latitud);
    empresa.longitud = parseFloat(longitud);
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empresa)
    });

    const result = await response.json();

    if (response.ok) {
      alert('¡Empresa registrada exitosamente!');
      document.getElementById('registroEmpresaForm').reset();
      window.location.href = 'login-empresa.html';
    } else {
      alert(`Error: ${result.detail || 'No se pudo registrar la empresa'}`);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor.');
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  cargarCategoriasEnSelector();
});

// Hacer función global
window.registrarEmpresa = registrarEmpresa;