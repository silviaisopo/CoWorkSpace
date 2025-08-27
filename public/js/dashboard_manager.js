document.addEventListener('DOMContentLoaded', async () => {
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
});
