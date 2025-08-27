/*document.addEventListener('DOMContentLoaded', async () => {
    const managerBox = document.getElementById('manager-info');
    const logoutBtn = document.getElementById('logout-btn');

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi effettuare il login!');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error('Token non valido');

        const manager = data.manager;
        managerBox.innerHTML = `
            <p>Nome: ${manager.name}</p>
            <p>Email: ${manager.email}</p>
            <p>Ruolo: ${manager.role}</p>
        `;
    } catch (err) {
        console.error(err);
        alert('Sessione scaduta, effettua nuovamente il login.');
        localStorage.clear();
        window.location.href = 'login.html';
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});*/
// js/dashboard_manager.js
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Redirect se non manager o non loggato
    if (!user || !token || user.role !== "manager") {
        window.location.href = "login.html";
        return;
    }

    // Popolo header sidebar
    document.getElementById("user-name").textContent = user.name || "Manager";
    document.getElementById("user-role").textContent = user.role || "";

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });

    // Funzioni gestione Sale
    const saleList = document.getElementById("sale-list");
    document.getElementById("add-sala").addEventListener("click", () => {
        const val = document.getElementById("new-sala").value.trim();
        if(val){
            const li = document.createElement("li");
            li.textContent = val;
            saleList.appendChild(li);
            document.getElementById("new-sala").value = "";
        }
    });
    document.getElementById("remove-sala").addEventListener("click", () => {
        if(saleList.lastChild) saleList.removeChild(saleList.lastChild);
    });

    // Funzioni gestione Uffici
    const ufficiList = document.getElementById("uffici-list");
    document.getElementById("add-ufficio").addEventListener("click", () => {
        const val = document.getElementById("new-ufficio").value.trim();
        if(val){
            const li = document.createElement("li");
            li.textContent = val;
            ufficiList.appendChild(li);
            document.getElementById("new-ufficio").value = "";
        }
    });
    document.getElementById("remove-ufficio").addEventListener("click", () => {
        if(ufficiList.lastChild) ufficiList.removeChild(ufficiList.lastChild);
    });

    // Funzioni gestione Postazioni
    const postazioniList = document.getElementById("postazioni-list");
    document.getElementById("add-postazione").addEventListener("click", () => {
        const val = document.getElementById("new-postazione").value.trim();
        if(val){
            const li = document.createElement("li");
            li.textContent = val;
            postazioniList.appendChild(li);
            document.getElementById("new-postazione").value = "";
        }
    });
    document.getElementById("remove-postazione").addEventListener("click", () => {
        if(postazioniList.lastChild) postazioniList.removeChild(postazioniList.lastChild);
    });
});
