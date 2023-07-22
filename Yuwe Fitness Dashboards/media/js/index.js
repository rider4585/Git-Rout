// Check if the user is logged in
if (!sessionStorage.getItem("loggedIn")) {
    // Redirect to login page if not logged in
    window.location.href = "./Dashboard Login/login.html";
} else {
    // Set the logged-in flag in sessionStorage
    sessionStorage.setItem("loggedIn", true);
}

// Inactivity timeout for automatic logout
let inactivityTimeout;

function startInactivityTimer() {
    // Clear any existing timeout
    clearTimeout(inactivityTimeout);

    // Set new timeout for 5 minutes
    inactivityTimeout = setTimeout(function () {
        // Clear the logged-in flag from sessionStorage
        sessionStorage.removeItem("loggedIn");

        // Redirect to login page after timeout
        window.location.href = "./Dashboard Login/login.html";
    }, 5 * 60 * 1000); // 5 minutes (in milliseconds)
}

// Start the inactivity timer when the page is loaded or clicked
window.addEventListener("load", startInactivityTimer);
window.addEventListener("click", startInactivityTimer);