// Get the button, and when the user clicks on it, execute myFunction
document.getElementById("logout").onclick = function () { logout() };

/* myFunction toggles between adding and removing the show class, which is used to hide and show the dropdown content */
function logout() {
    window.location.replace("/index.html");
}