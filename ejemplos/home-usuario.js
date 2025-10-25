// ejemplos/home-usuario.js
// CÓDIGO DE REFERENCIA PARA EL EQUIPO FRONTEND
// Copiar a js/home-usuario.js y adaptar según necesidad

import { API_URL } from './config.js';

/**
 * Carga las categorías desde la API y las renderiza en el grid
 */
async function cargarCategorias() {
  const token = localStorage.getItem('token');
  
  // Verificar que el usuario esté autenticado
  if (!token) {
    alert('Debes iniciar sesión para ver las categorías');
    window.location.href = 'login-usuario.html';
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/v1/categorias`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      // El backend puede retornar array directo o { categorias: [...] }
      const categorias = Array.isArray(data) ? data : data.categorias;
      renderizarCategorias(categorias);
    } else {
      console.error('Error al cargar categorías:', data);
      alert(`Error: ${data.detail || 'No se pudieron cargar las categorías'}`);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
  }
}

/**
 * Renderiza las categorías dinámicamente en el grid
 * @param {Array} categorias - Array de objetos categoría
 */
function renderizarCategorias(categorias) {
  const grid = document.querySelector('.categories-grid');
  
  if (!grid) {
    console.error('No se encontró el elemento .categories-grid');
    return;
  }
  
  // Limpiar contenido hardcoded
  grid.innerHTML = '';
  
  // Mapeo de IDs a números de imagen (ajustar según tus imágenes)
  const imageMap = {
    1: 9,   // Salud
    2: 10,  // Cuidado Personal
    3: 11,  // Automotriz
    4: 12,  // Mascotas
    5: 13,  // Hogar
    6: 18,  // Educación
    7: 17,  // Deporte
    8: 16,  // Gastronomía
    9: 15,  // Entretenimiento
    10: 14  // Tecnología
  };
  
  categorias.forEach(categoria => {
    const item = document.createElement('a');
    item.href = '#';
    item.className = 'category-item';
    item.dataset.categoriaId = categoria.categoria_id;
    
    const imageNum = imageMap[categoria.categoria_id] || 9;
    
    item.innerHTML = `
      <span>${categoria.nombre}</span>
      <div class="category-icon">
        <img src="../img/Frame ${imageNum}.png" alt="Icono ${categoria.nombre}">
      </div>
    `;
    
    // Event listener para navegación
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navegarABusqueda(categoria.categoria_id, categoria.nombre);
    });
    
    grid.appendChild(item);
  });
  
  console.log(`✅ ${categorias.length} categorías cargadas exitosamente`);
}

/**
 * Navega a la página de búsqueda de empresas
 * @param {number} categoriaId - ID de la categoría seleccionada
 * @param {string} categoriaNombre - Nombre de la categoría
 */
function navegarABusqueda(categoriaId, categoriaNombre) {
  // Opción 1: Guardar en localStorage y navegar
  localStorage.setItem('categoriaSeleccionada', JSON.stringify({
    id: categoriaId,
    nombre: categoriaNombre
  }));
  window.location.href = 'buscar-empresas.html';
  
  // Opción 2: Usar query params (si prefieren)
  // window.location.href = `buscar-empresas.html?categoria=${categoriaId}`;
}

// Cargar categorías cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
});

// Hacer funciones globales si es necesario
window.cargarCategorias = cargarCategorias;