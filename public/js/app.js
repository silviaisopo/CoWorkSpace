document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profile-btn");
    if (!profileBtn) return;

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
});

