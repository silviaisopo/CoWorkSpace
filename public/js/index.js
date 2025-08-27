// index.js
document.addEventListener("DOMContentLoaded", () => {

    // --- GESTIONE RICERCA ---
    const searchInput = document.getElementById("search-input");
    const searchForm = searchInput?.closest("form");

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (!query) return;

            // Reindirizza a catalogo.html con parametro search
            const url = `catalogo.html?search=${encodeURIComponent(query)}`;
            window.location.href = url;
        });
    }

    // --- BOTTONI ---
    const signupBtn = document.querySelector('a[href="registrazione.html"] button');
    if (signupBtn) {
        signupBtn.addEventListener("click", () => window.location.href = "registrazione.html");
    }

    const loginBtn = document.querySelector('a[href="login.html"] button');
    if (loginBtn) {
        loginBtn.addEventListener("click", () => window.location.href = "login.html");
    }

    const profileBtn = document.getElementById("profile-btn");
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.role) {
                window.location.href = "login.html";
            } else if (user.role === "manager") {
                window.location.href = "dashboard_manager.html";
            } else {
                window.location.href = "area_riservata.html";
            }
        });
    }
});


