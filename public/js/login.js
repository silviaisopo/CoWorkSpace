// login.js
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const messageBox = document.getElementById('login-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // reset messaggi
        messageBox.style.display = "none";
        messageBox.textContent = "";

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Errore login');
            }

            // Salva token e user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect in base al ruolo
            if (data.user.role === 'manager') {
                window.location.href = 'dashboard_manager.html';
            } else {
                window.location.href = 'area_riservata.html';
            }

        } catch (err) {
            messageBox.textContent = err.message || 'Errore del server';
            messageBox.style.display = "block";
            messageBox.style.background = "#dc3545"; // rosso errore
            messageBox.style.color = "#fff";
        }
    });
});