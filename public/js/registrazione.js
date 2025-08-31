//registrazione.js
    document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const messageBox = document.getElementById('register-message');

    // Gestione registrazione
    form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    // Validazione
    if (password !== confirmPassword) {
    showMessage("Le password non coincidono!", true);
    return;
}

    // Mostra loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Registrazione...';
    submitBtn.disabled = true;

    try {
    const response = await fetch("/api/auth/register", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    name: name,
    email: email,
    password: password,
    role: role
})
});

    const data = await response.json();

    if (!response.ok || !data.success) {
    console.error("Errore registrazione:", data);
    showMessage("Errore: " + (data.message || "Impossibile registrarsi"), true);
    return;
}

    console.log("Registrazione riuscita:", data);

    // ✅ Svuota form
    form.reset();

    // ✅ Mostra messaggio di successo
    showMessage("Registrazione avvenuta con successo, accedi!", false);

    // ✅ Reindirizza dopo 2s
    setTimeout(() => {
    window.location.href = 'login.html';
}, 2000);

} catch (err) {
    console.error("Errore di rete:", err);
    showMessage("Errore di rete, riprova più tardi.", true);
} finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}
});

    // Funzione per mostrare messaggi
        function showMessage(text, isError) {
            messageBox.textContent = isError ? text : "✅ " + text; // icona ✅ se successo
            messageBox.style.display = "block";
            messageBox.style.background = "#f3f6f4" // rosso se errore, verde se ok
            messageBox.style.color = isError ? "#dc3545" : "#28a745";
        }
});

    // ✅ Funzione globale per mostrare/nascondere password
    function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    input.type = (input.type === "password") ? "text" : "password";
}