// ejemplos/buscar-empresas.js
// CÓDIGO DE REFERENCIA PARA EL EQUIPO FRONTEND

import { API_URL } from './config.js';

/**
 * Busca empresas por categoría
 */
async function buscarEmpresas() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Debes iniciar sesión');
    window.location.href = 'login-usuario.html';
    return;
  }

  // Obtener categoría de localStorage
  const categoriaData = JSON.parse(localStorage.getItem('categoriaSeleccionada') || '{}');
  const categoriaId = categoriaData.id;

  if (!categoriaId) {
    alert('No se seleccionó ninguna categoría');
    window.location.href = 'home-usuario.html';
    return;
  }

  // Mostrar categoría seleccionada
  const titulo = document.getElementById('titulo-categoria');
  if (titulo) {
    titulo.textContent = `Empresas de ${categoriaData.nombre}`;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/empresas?categoria_id=${categoriaId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      const empresas = Array.isArray(data) ? data : data.empresas || [];
      renderizarEmpresas(empresas);
    } else {
      alert(`Error: ${data.detail}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al buscar empresas');
  }
}

/**
 * Renderiza la lista de empresas
 */
function renderizarEmpresas(empresas) {
  const container = document.getElementById('empresas-container');
  
  if (!container) {
    console.error('No se encontró #empresas-container');
    return;
  }

  if (empresas.length === 0) {
    container.innerHTML = '<p class="no-results">No se encontraron empresas en esta categoría.</p>';
    return;
  }

  container.innerHTML = '';

  empresas.forEach(empresa => {
    const card = document.createElement('div');
    card.className = 'empresa-card';
    
    card.innerHTML = `
      <h3>${empresa.razon_social}</h3>
      <p class="descripcion">${empresa.descripcion || 'Sin descripción'}</p>
      <div class="info">
        <span><i class="fas fa-phone"></i> ${empresa.telefono || 'No disponible'}</span>
        <span><i class="fas fa-envelope"></i> ${empresa.email || 'No disponible'}</span>
      </div>
      <div class="acciones">
        <button class="btn-detalle" onclick="verDetalle(${empresa.empresa_id})">
          Ver más
        </button>
        <button class="btn-reservar" onclick="reservarTurno(${empresa.empresa_id})">
          Reservar turno
        </button>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function verDetalle(empresaId) {
  window.location.href = `detalle-empresa.html?id=${empresaId}`;
}

function reservarTurno(empresaId) {
  localStorage.setItem('empresaSeleccionada', empresaId);
  window.location.href = `agenda.html?empresa=${empresaId}`;
}

// Inicialización
document.addEventListener('DOMContentLoaded', buscarEmpresas);

// Funciones globales
window.verDetalle = verDetalle;
window.reservarTurno = reservarTurno;