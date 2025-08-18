// public/js/registrazione.js
document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');

    // Pulisce eventuali messaggi precedenti
    errorMessage.textContent = '';

    // Controllo password
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Le password non coincidono';
        return;
    }

    // Controllo campi vuoti
    if (!name || !email || !password) {
        errorMessage.textContent = 'Tutti i campi sono obbligatori';
        return;
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Errore durante la registrazione');
        }

        // Salva token nel localStorage
        localStorage.setItem('token', data.token);

        // Reset form
        document.getElementById('registration-form').reset();

        // Reindirizza alla pagina profilo utente
        window.location.href = '/user-profile.html';
    } catch (err) {
        errorMessage.textContent = err.message;
        console.error('Errore registrazione:', err);
    }
});

