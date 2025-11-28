document.addEventListener('DOMContentLoaded', () => {

    const profileDropdownBtn = document.querySelector('.profile-dropdown-btn');
    const profileDropdownContent = document.querySelector('.dropdown-content');
    const dropdownArrow = document.querySelector('.dropdown-arrow'); 
    
    const userMenuDropdownBtn = document.querySelector('.user-menu-dropdown-btn');
    const userDropdownContent = document.querySelector('.user-dropdown-content');

    function toggleProfileDropdown() {
        if (!profileDropdownContent || !dropdownArrow) return;
        
        profileDropdownContent.classList.toggle('show');
        
        if (profileDropdownContent.classList.contains('show')) {
            dropdownArrow.classList.remove('fa-caret-down');
            dropdownArrow.classList.add('fa-caret-up');
        } else {
            dropdownArrow.classList.remove('fa-caret-up');
            dropdownArrow.classList.add('fa-caret-down');
        }
    }

    function toggleUserMenuDropdown() {
        if (!userDropdownContent) return;

        userDropdownContent.classList.toggle('show-user-menu');
    }

    function closeAllDropdowns() {
        if (profileDropdownContent && profileDropdownContent.classList.contains('show')) {
            toggleProfileDropdown(); 
        }

        if (userDropdownContent && userDropdownContent.classList.contains('show-user-menu')) {
            toggleUserMenuDropdown();
        }
    }

    if (profileDropdownBtn) {
        profileDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (userDropdownContent && userDropdownContent.classList.contains('show-user-menu')) {
                toggleUserMenuDropdown();
            }
            toggleProfileDropdown();
        });
    }

    if (userMenuDropdownBtn) {
        userMenuDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (profileDropdownContent && profileDropdownContent.classList.contains('show')) {
                toggleProfileDropdown();
            }
            toggleUserMenuDropdown();
        });
    }

    window.addEventListener('click', (event) => {

        const insideUser = event.target.closest('.user-menu-container'); 
        const insideProfile = event.target.closest('.dropdown-menu-container');

        if (userDropdownContent && userDropdownContent.classList.contains('show-user-menu') && !insideUser) {
            toggleUserMenuDropdown();
        }
        
        if (profileDropdownContent && profileDropdownContent.classList.contains('show') && !insideProfile) {
            toggleProfileDropdown();
        }
    });

});