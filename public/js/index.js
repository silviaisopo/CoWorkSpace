// js/index.js
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Inserisci un termine di ricerca');
        return;
    }

    const encodedSearchTerm = encodeURIComponent(searchTerm);
    window.location.href = `catalogo.html?search=${encodedSearchTerm}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('form[onsubmit="handleSearch(); return false;"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch();
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});