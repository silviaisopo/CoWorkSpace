// public/js/login.js
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Pulisce eventuali messaggi di errore precedenti
    errorMessage.textContent = '';

    try {
        const res = await fetch('/api/auth/login', {  // percorso relativo al server
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Errore login');
        }

        // Salva token nel localStorage
        localStorage.setItem('token', data.token);

        // Reindirizza alla pagina profilo utente
        window.location.href = '/user-profile.html';
    } catch (err) {
        errorMessage.textContent = err.message;
    }
});

