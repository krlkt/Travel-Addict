function afterInput(e) {
    localStorage.setItem('email', e.target.value)
}

document.addEventListener('DOMContentLoaded', () => {
    // login tab
    const email_ls = localStorage.getItem('email')
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value

    if (email_ls) {
        document.getElementById('email').value = email_ls
    }
    document.getElementById('email').addEventListener("input", afterInput)
    document.getElementById('login').addEventListener("click", function () {
        if (true) {
            console.log('logging in')
        }
        document.getElementById('invalidLogin').style.display = "block";
        document.getElementById('password').value = ''
    })

    // sign up tab
    document.getElementById('signup').addEventListener("click", function () {
        var signup_name = document.getElementById('signup_name').value
        var signup_email = document.getElementById('signup_email').value
        var signup_password = document.getElementById('signup_password').value

        if (signup_name.length < 3) {
            document.getElementById('invalidSignup').style.display = "block";
            document.getElementById('invalidSignup').innerHTML = '<img src="img/exclamation-mark-svgrepo-com.svg" style="width: 15px;"> Ihre Name darf nicht weniger als 3 Zeichen sein';
            document.getElementById('signup_password').value = ''
        }
        else if (signup_password.length < 6) {
            document.getElementById('invalidSignup').style.display = "block";
            document.getElementById('invalidSignup').innerHTML = '<img src="img/exclamation-mark-svgrepo-com.svg" style="width: 15px;"> Passwort muss mindestens 5 Zeichen haben';
            document.getElementById('signup_password').value = ''
        }
        else {
            
        }
    })

    // changing view between login and sign up page
    const loginForm = document.querySelector("#loginForm");
    const createAccountForm = document.querySelector("#createAccountForm");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form-hidden");
        createAccountForm.classList.remove("form-hidden");
    });
})
