/*document.addEventListener("DOMContentLoaded", () => {
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

    // 🔹 aggiorno il badge carrello al caricamento
    updateCartBadge();
});

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    const pendingBooking = JSON.parse(localStorage.getItem("pendingBooking"));

    if (pendingBooking) {
        badge.textContent = "1";
        badge.classList.remove("hidden");
    } else {
        badge.textContent = "";
        badge.classList.add("hidden");
    }
}
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}*/

document.addEventListener("DOMContentLoaded", () => {
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
    const user = JSON.parse(localStorage.getItem("user"));

    // Rimuove solo token e user, mantiene prenotazioni di altri utenti
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Aggiorna badge senza utente loggato
    updateCartBadge(null);

    // Redirect home
    window.location.href = "index.html";
}

// 🔹 Funzione aggiorna badge carrello
function updateCartBadge(user) {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    let pendingBooking = JSON.parse(localStorage.getItem("pendingBooking")) || [];

    if (user && user.id) {
        // Utente loggato → filtra solo le sue prenotazioni
        pendingBooking = pendingBooking.filter(b => b.userId === user.id);
    } // altrimenti, se non c'è utente, lascia tutte le prenotazioni

    if (pendingBooking.length > 0) {
        badge.textContent = pendingBooking.length;
        badge.classList.remove("hidden");
    } else {
        badge.textContent = "";
        badge.classList.add("hidden");
    }
}


// 🔹 Aggiorna badge in tempo reale quando viene aggiunta una prenotazione
function addPendingBooking(booking) {
    let pendingBooking = JSON.parse(localStorage.getItem("pendingBooking")) || [];
    pendingBooking.push(booking);
    localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));

    const user = JSON.parse(localStorage.getItem("user"));
    updateCartBadge(user);
}

// 🔹 Rimuovi prenotazione dal carrello (opzionale)
function removePendingBooking(bookingId) {
    let pendingBooking = JSON.parse(localStorage.getItem("pendingBooking")) || [];
    pendingBooking = pendingBooking.filter(b => b.id !== bookingId);
    localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));

    const user = JSON.parse(localStorage.getItem("user"));
    updateCartBadge(user);
}


