// js/area_riservata.js

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Se non sei loggato → redirect
    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    // Popolo i dati dell'utente
    document.getElementById("user-name").textContent = user.name || "Utente";
    document.getElementById("user-role").textContent = user.role || "";
    document.getElementById("user-name-detail").textContent = user.name || "";
    document.getElementById("user-email").textContent = user.email || "";
    document.getElementById("user-role-detail").textContent = user.role || "";

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }
});


