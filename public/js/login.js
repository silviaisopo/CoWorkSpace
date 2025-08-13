
    document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
},
    body: JSON.stringify({ email, password }),
});

    const data = await res.json();

    if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
}

    localStorage.setItem('token', data.token);
    window.location.href = '/public/user-profile.html'; // Redirect to profile page
} catch (err) {
    errorMessage.textContent = err.message;
}
});
