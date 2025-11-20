document.addEventListener('DOMContentLoaded', () => {
    
    // Menú de Perfil 
    const profileDropdownBtn = document.querySelector('.profile-dropdown-btn'); 
    const profileDropdownContent = document.querySelector('.dropdown-content');
    const dropdownArrow = document.querySelector('.dropdown-arrow'); 
    
    // Menú de Barras Perfil USUARIO 
    const userMenuDropdownBtn = document.querySelector('.user-menu-dropdown-btn');
    const userDropdownContent = document.querySelector('.user-dropdown-content');

    // Función para alternar la visibilidad del Menú de Perfil
    function toggleProfileDropdown() {
        if (!profileDropdownContent || !dropdownArrow) return;
        
        // Alterna la clase 'show' para el contenido del perfil
        profileDropdownContent.classList.toggle('show');
        
        // Cambia el ícono de la flecha 
        if (profileDropdownContent.classList.contains('show')) {
            dropdownArrow.classList.remove('fa-caret-down');
            dropdownArrow.classList.add('fa-caret-up');
        } else {
            dropdownArrow.classList.remove('fa-caret-up');
            dropdownArrow.classList.add('fa-caret-down');
        }
    }

    // Función para alternar la visibilidad del Menú de Barras en USUARIO
    function toggleUserMenuDropdown() {
        if (!userDropdownContent) return;
        // Alterna la clase 'show-user-menu' para el menú de altura completa
        userDropdownContent.classList.toggle('show-user-menu');
    }

    // Función para cerrar TODOS los menús
    function closeAllDropdowns() {
        // Cierra menú de perfil si está abierto
        if (profileDropdownContent && profileDropdownContent.classList.contains('show')) {
            toggleProfileDropdown(); 
        }
        // Cierra menú de barras si está abierto
        if (userDropdownContent && userDropdownContent.classList.contains('show-user-menu')) {
            toggleUserMenuDropdown();
        }
    }
    
    // Asignación de Eventos
    
    // Evento para el Menú de Perfil
    if (profileDropdownBtn) {
        profileDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            
            // Paea evitar dos menús abiertos
            if (userDropdownContent && userDropdownContent.classList.contains('show-user-menu')) {
                toggleUserMenuDropdown();
            }
            toggleProfileDropdown();
        });
    }

    // Evento para el Menú de Barras USUARIO
    if (userMenuDropdownBtn) {
        userMenuDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            // Cierra el menú de perfil si está abierto (evita dos menús abiertos)
            if (profileDropdownContent && profileDropdownContent.classList.contains('show')) {
                toggleProfileDropdown();
            }
            toggleUserMenuDropdown();
        });
    }
    
    // Cierre global al hacer click fuera
    window.addEventListener('click', (event) => {
        // Contenedor del menú de barras
        const isClickInsideUserMenuContainer = event.target.closest('.user-menu-container'); 
        
        // Contenedor del menú de perfil
        const isClickInsideProfileMenuContainer = event.target.closest('.dropdown-menu-container');

        // Lógica de cierre para el Menú de Barras
        if (userDropdownContent && userDropdownContent.classList.contains('show-user-menu') && !isClickInsideUserMenuContainer) {
            toggleUserMenuDropdown();
        }
        
        // Lógica de cierre para el Menú de Perfil
        if (profileDropdownContent && profileDropdownContent.classList.contains('show') && !isClickInsideProfileMenuContainer) {
            toggleProfileDropdown();
        }
    });

});