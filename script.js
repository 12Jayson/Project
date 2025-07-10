document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica del menú de hamburguesa (mantener sin cambios) ---
    const dropdown = document.querySelector('.dropdown.main-nav-dropdown');
    const dropbtn = dropdown ? dropdown.querySelector('.dropbtn') : null;
    const dropdownContent = dropdown ? dropdown.querySelector('.dropdown-content') : null;
    const closeBtn = dropdownContent ? dropdownContent.querySelector('.close-btn') : null;

    const isMobile = window.matchMedia('(max-width: 767px)');

    function toggleDropdownMenu() {
        if (isMobile.matches) {
            dropdown.classList.toggle('active');
            if (dropdown.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    function closeDropdownMenu() {
        if (isMobile.matches) {
            dropdown.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (dropbtn) {
        dropbtn.addEventListener('click', toggleDropdownMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDropdownMenu);
    }

    document.addEventListener('click', function(event) {
        if (isMobile.matches) {
            if (dropdown && !dropdown.contains(event.target) && dropdown.classList.contains('active')) {
                closeDropdownMenu();
            }
        }
    });

    isMobile.addEventListener('change', function(e) {
        if (!e.matches) {
            if (dropdown && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // --- Lógica para la barra de búsqueda (SECCIÓN MODIFICADA) ---
    const openSearchButton = document.getElementById('openSearchButton');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearchButton = document.getElementById('closeSearchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    // Declarar estas variables aquí, pero inicializarlas condicionalmente
    let productCards;
    let allProductCards;

    // Solo inicializar productCards y allProductCards si estamos en full-menu.html
    if (window.location.pathname.includes('full-menu.html') || (window.location.pathname === '/' && document.querySelector('.product-card'))) {
        productCards = document.querySelectorAll('.product-card');
        allProductCards = Array.from(productCards); // Copia para construir resultados dinámicamente
    }

    // Al abrir la barra de búsqueda (solo si estamos en full-menu.html)
    if (openSearchButton && searchOverlay && (window.location.pathname.includes('full-menu.html') || (window.location.pathname === '/' && document.querySelector('.product-card')))) {
        openSearchButton.addEventListener('click', function(event) {
            event.preventDefault();
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (searchInput) {
                searchInput.focus();
                const urlParams = new URLSearchParams(window.location.search);
                const searchTermFromUrl = urlParams.get('search');
                if (searchTermFromUrl) {
                    searchInput.value = decodeURIComponent(searchTermFromUrl);
                    filterAndDisplayProducts(decodeURIComponent(searchTermFromUrl));
                }
            }
        });
    }

    // Al cerrar la barra de búsqueda
    if (closeSearchButton && searchOverlay) {
        closeSearchButton.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = ''; // Limpia el input
            if (searchResultsContainer) {
                searchResultsContainer.innerHTML = ''; // Limpia los resultados
                searchResultsContainer.style.display = 'none'; // Oculta el contenedor de resultados
            }

            // Restaurar la visibilidad de los productos del menú principal si es necesario
            if (window.location.pathname.includes('full-menu.html') || (window.location.pathname === '/' && document.querySelector('.product-card'))) {
                if (productCards) { // Asegurarse de que productCards está definido
                    productCards.forEach(card => card.style.display = 'flex');
                }
            }
            // Eliminar el parámetro 'search' de la URL al cerrar la búsqueda
            const url = new URL(window.location.href);
            url.searchParams.delete('search');
            window.history.replaceState({}, document.title, url.toString());
        });
    }

    // Al presionar 'Escape'
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
            if (searchResultsContainer) {
                searchResultsContainer.innerHTML = '';
                searchResultsContainer.style.display = 'none';
            }
            if (window.location.pathname.includes('full-menu.html') || (window.location.pathname === '/' && document.querySelector('.product-card'))) {
                if (productCards) { // Asegurarse de que productCards está definido
                    productCards.forEach(card => card.style.display = 'flex');
                }
            }
            // Eliminar el parámetro 'search' de la URL al cerrar con Escape
            const url = new URL(window.location.href);
            url.searchParams.delete('search');
            window.history.replaceState({}, document.title, url.toString());
        }
    });

    // --- Lógica simple para el carrito (solo si estás en cart.html - mantener sin cambios) ---
    if (document.querySelector('.quantity-btn') || document.querySelector('.remove-item-btn')) {
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        quantityButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.closest('.cart-item-quantity').querySelector('.quantity-input');
                let quantity = parseInt(input.value);

                if (this.dataset.action === 'increase') {
                    quantity++;
                } else if (this.dataset.action === 'decrease' && quantity > 1) {
                    quantity--;
                }
                input.value = quantity;
            });
        });

        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.cart-item').remove();
                alert('¡Artículo eliminado del carrito!');
            });
        });
    }

    // --- LÓGICA DE ANIMACIÓN AL CARGAR LA PÁGINA (mantener sin cambios) ---
    const pageLoadElement = document.querySelector('.page-load-animation');
    if (pageLoadElement) {
        pageLoadElement.classList.add('loaded');
    }

    // --- CÓDIGO PARA EL MENÚ DE CATEGORÍAS (Efecto momentáneo al hacer clic) (mantener sin cambios) ---
    const categoryLinks = document.querySelectorAll('.category-list a');
    const menuCategoryNav = document.getElementById('menuCategoryNav');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 500);

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Importante: Asegurarse de que la barra de búsqueda esté limpia y sus resultados ocultos
            if (searchInput) searchInput.value = '';
            if (searchResultsContainer) {
                searchResultsContainer.innerHTML = '';
                searchResultsContainer.style.display = 'none';
            }
            // Aseguramos que los productos del menú principal estén visibles antes del scroll
            if (window.location.pathname.includes('full-menu.html') || (window.location.pathname === '/' && document.querySelector('.product-card'))) {
                 if (productCards) { // Asegurarse de que productCards está definido
                    productCards.forEach(card => card.style.display = 'flex');
                }
            }
            // Eliminar el parámetro 'search' de la URL al hacer clic en una categoría
            const url = new URL(window.location.href);
            url.searchParams.delete('search');
            window.history.replaceState({}, document.title, url.toString());

            if (targetSection) {
                const headerOffset = menuCategoryNav ? menuCategoryNav.offsetHeight : 0;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- CÓDIGO PARA EL BOTÓN "VOLVER ARRIBA" (mantener sin cambios) ---
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    window.addEventListener("scroll", function() {
        if (scrollToTopBtn) { // Asegura que el botón existe en la página actual
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = "flex";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- LÓGICA PARA FILTRAR Y MOSTRAR ÍTEMS DEL MENÚ EN LA BARRA DE BÚSQUEDA ---
    function filterAndDisplayProducts(searchTerm) {
        // Solo ejecuta la lógica de filtrado si estamos en full-menu.html
        if (!window.location.pathname.includes('full-menu.html') && !(window.location.pathname === '/' && document.querySelector('.product-card'))) {
            return;
        }

        if (!searchResultsContainer) return; // Salir si el contenedor de resultados no existe

        searchResultsContainer.innerHTML = ''; // Limpia resultados anteriores

        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

        if (lowerCaseSearchTerm.length === 0) {
            searchResultsContainer.style.display = 'none';
            if (productCards) { // Asegurarse de que productCards está definido
                productCards.forEach(card => card.style.display = 'flex'); // Muestra el menú principal
            }
            return;
        }

        let resultsFound = false;

        if (allProductCards) { // Asegurarse de que allProductCards está definido
            allProductCards.forEach(card => {
                const titleElement = card.querySelector('.product-title');
                const descriptionElement = card.querySelector('.product-description');
                const imageElement = card.querySelector('.product-image-wrapper img');
                const priceElement = card.querySelector('.product-price');

                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                const imageUrl = imageElement ? imageElement.src : '';
                const price = priceElement ? priceElement.textContent : '';

                if (title.includes(lowerCaseSearchTerm) || description.includes(lowerCaseSearchTerm)) {
                    resultsFound = true;
                    const resultCard = document.createElement('div');
                    resultCard.classList.add('search-result-item');

                    resultCard.innerHTML = `
                        <div class="result-image-wrapper">
                            <img src="${imageUrl}" alt="${titleElement.textContent}">
                        </div>
                        <div class="result-info">
                            <p class="result-title">${titleElement.textContent}</p>
                            <p class="result-description">${descriptionElement.textContent.substring(0, 50)}${descriptionElement.textContent.length > 50 ? '...' : ''}</p>
                            <p class="result-price">${price}</p>
                            <button class="add-to-cart-btn-small">Add to Cart <i class="fas fa-cart-plus"></i></button>
                        </div>
                    `;
                    searchResultsContainer.appendChild(resultCard);
                }
            });
        }

        if (resultsFound) {
            searchResultsContainer.style.display = 'flex';
            // Oculta los productos del menú principal cuando se muestran resultados en el overlay
            if (productCards) { // Asegurarse de que productCards está definido
                productCards.forEach(card => card.style.display = 'none');
            }
        } else {
            searchResultsContainer.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
            searchResultsContainer.style.display = 'flex';
            if (productCards) { // Asegurarse de que productCards está definido
                productCards.forEach(card => card.style.display = 'none'); // Oculta los productos del menú principal
            }
        }
    }

    // Event Listener para el input de búsqueda (SECCIÓN MODIFICADA)
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            const currentPath = window.location.pathname;
            // Si estamos en la página del menú completo, filtra en el overlay
            if (currentPath.includes('full-menu.html') || (currentPath === '/' && document.querySelector('.product-card'))) {
                filterAndDisplayProducts(searchInput.value);
            } else {
                // Si estamos en cualquier otra página, redirige a full-menu.html con el término de búsqueda
                // Solo redirige si el usuario presiona Enter para una búsqueda "formal" o si el campo está vacío y presiona Enter
                if (event.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    if (searchTerm !== '') {
                        window.location.href = `full-menu.html?search=${encodeURIComponent(searchTerm)}`;
                    } else {
                        window.location.href = `full-menu.html`; // Si el campo está vacío y se presiona Enter, redirige a full-menu.html sin parámetro de búsqueda
                    }
                }
            }
        });

        const searchButtonInOverlay = document.getElementById('searchButton');
        if (searchButtonInOverlay) {
            searchButtonInOverlay.addEventListener('click', function() {
                const currentPath = window.location.pathname;
                const searchTerm = searchInput.value.trim();
                if (currentPath.includes('full-menu.html') || (currentPath === '/' && document.querySelector('.product-card'))) {
                    filterAndDisplayProducts(searchTerm);
                } else {
                    if (searchTerm !== '') {
                        window.location.href = `full-menu.html?search=${encodeURIComponent(searchTerm)}`;
                    } else {
                        window.location.href = `full-menu.html`;
                    }
                }
            });
        }
    }

    // NUEVA LÓGICA: Manejar el término de búsqueda de la URL en full-menu.html al cargar la página
    if (window.location.pathname.includes('full-menu.html') || (window.location.pathname === '/' && document.querySelector('.product-card'))) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('search');
        if (searchTermFromUrl) {
            if (searchOverlay) {
                searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            if (searchInput) {
                searchInput.value = decodeURIComponent(searchTermFromUrl);
                filterAndDisplayProducts(decodeURIComponent(searchTermFromUrl));
            }
        } else {
            // Si no hay término de búsqueda en la URL, asegúrate de que el menú principal sea visible por defecto
            // Solo si la página actual es full-menu.html y los productCards existen
            if (window.location.pathname.includes('full-menu.html') && productCards) {
                productCards.forEach(card => card.style.display = 'flex');
            }
        }
    }

    // Inicialmente, asegúrate de que el contenedor de resultados esté oculto
    if (searchResultsContainer) {
        searchResultsContainer.style.display = 'none';
    }
}); // Fin de DOMContentLoaded