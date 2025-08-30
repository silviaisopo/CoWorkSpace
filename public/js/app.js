/*document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profile-btn");
    const loginBtn = document.getElementById("login-btn");
    const loginButtonText = document.querySelector("#login-button span");

    let user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // 🔹 Gestione bottone Accedi / Logout
    if (loginBtn && loginButtonText) {
        if (user && token) {
            loginButtonText.textContent = "Logout";
            loginBtn.href = "#";

            // Rimuove listener precedenti per evitare duplicazioni
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.replaceWith(newLoginBtn);

            newLoginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            loginButtonText.textContent = "Accedi";
            loginBtn.href = "login.html";
        }
    }

    // 🔹 Gestione click sul profilo
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.role) {
                window.location.href = "login.html";
            } else if (user.role === "manager") {
                window.location.href = "dashboard_manager.html";
            } else {
                window.location.href = "area_riservata.html";
            }
        });
    }

    // 🔹 Aggiorna badge carrello al caricamento
    updateCartBadge(user);
});

// 🔹 Funzione logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    updateCartBadge(null);
    window.location.href = "index.html";
}

// 🔹 Funzione aggiorna badge carrello
// In app.js
function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        // Non loggato → rimuove eventuali prenotazioni pendenti
        localStorage.removeItem("pendingBooking");
        badge.textContent = "";
        badge.classList.add("hidden");
        return;
    }

    const pendingBooking = JSON.parse(localStorage.getItem("pendingBooking"));
    // Badge = 1 se esiste una prenotazione per l'utente, altrimenti nascosto
    if (pendingBooking && pendingBooking.userId === user.id) {
        badge.textContent = "1";
        badge.classList.remove("hidden");
    } else {
        badge.textContent = "";
        badge.classList.add("hidden");
    }
}



// 🔹 Aggiunge prenotazione al carrello
function addPendingBooking(booking) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return; // Non loggato → non aggiungere

    booking.userId = user.id;
    localStorage.setItem("pendingBooking", JSON.stringify(booking));
    updateCartBadge();
}


// 🔹 Rimuove prenotazione dal carrello
function removePendingBooking() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    localStorage.removeItem("pendingBooking");
    updateCartBadge();
}*/

document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profile-btn");
    const loginBtn = document.getElementById("login-btn");
    const loginButtonText = document.querySelector("#login-button span");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Bottone Accedi / Logout
    if (loginBtn && loginButtonText) {
        if (user && token) {
            loginButtonText.textContent = "Logout";
            loginBtn.href = "#";
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.replaceWith(newLoginBtn);
            newLoginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            loginButtonText.textContent = "Accedi";
            loginBtn.href = "login.html";
        }
    }

    // Click sul profilo
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const userNow = JSON.parse(localStorage.getItem("user"));
            if (!userNow || !userNow.role) window.location.href = "login.html";
            else if (userNow.role === "manager") window.location.href = "dashboard_manager.html";
            else window.location.href = "area_riservata.html";
        });
    }

    // Aggiorna badge al caricamento
    updateCartBadge();
});

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingBooking"); // cancella prenotazioni pendenti
    updateCartBadge();
    window.location.href = "index.html";
}

// Aggiorna badge carrello
function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        localStorage.removeItem("pendingBooking");
        badge.textContent = "";
        badge.classList.add("hidden");
        return;
    }

    const pendingBooking = JSON.parse(localStorage.getItem("pendingBooking"));
    if (pendingBooking && pendingBooking.userId === user.id) {
        badge.textContent = "1"; // ✅ mostra 1 se prenotazione dell'utente
        badge.classList.remove("hidden");
    } else {
        badge.textContent = "";
        badge.classList.add("hidden");
    }
}

// Aggiunge prenotazione al carrello
function addPendingBooking(booking) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    booking.userId = user.id;
    localStorage.setItem("pendingBooking", JSON.stringify(booking));
    updateCartBadge();
}

// Rimuove prenotazione dal carrello
function removePendingBooking() {
    localStorage.removeItem("pendingBooking");
    updateCartBadge();
}


