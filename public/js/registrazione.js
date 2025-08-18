document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        role: document.getElementById('role').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Errore durante la registrazione');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = data.user.role === 'manager'
            ? '/area_manager.html'
            : '/area_riservata.html';

    } catch (error) {
        console.error('Errore registrazione:', error);
        document.getElementById('error-message').textContent =
            error.message || 'Errore del server';
    }
});

