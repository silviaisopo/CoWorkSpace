// Mostra/nascondi password
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

// Event listener per login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) errorMessage.textContent = '';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Errore login');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Reindirizza in base al ruolo
        if (data.user.role === 'manager') {
            window.location.href = '/dashboard-manager.html';
        } else {
            window.location.href = '/area_riservata.html';
        }

    } catch (err) {
        if (errorMessage) errorMessage.textContent = err.message || 'Errore del server';
    }
});
