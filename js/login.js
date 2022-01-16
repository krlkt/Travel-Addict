const form = document.querySelector('#loginForm');
const signUpForm = document.querySelector('#createAccountForm');

const email = document.querySelector('input[id="email"]');
const password = document.querySelector('input[id="password"]');

const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://travel-addict-backend-server.herokuapp.com";
// const BASE_URL = process.env.NODE_ENV === "production" ? "https://travel-addict-backend-server.herokuapp.com" : "http://localhost:8080";

function afterInput(e) {
    localStorage.setItem('email', e.target.value)
}

// fetch from heroku backend server methods
const login = async (email, password) => {
    const loginUrl = `${BASE_URL}/login`;

    const response = await fetch(loginUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return response.status === 200;
}

const signup = async (email, password) => {
    const signupUrl = `${BASE_URL}/user`;

    const response = await fetch(signupUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return response.status === 200;
}

// to save login email on local client
document.addEventListener('DOMContentLoaded', async () => {
    const email_ls = localStorage.getItem('email')

    if (email_ls) {
        document.getElementById('email').value = email_ls
    }
    document.getElementById('email').addEventListener("input", afterInput)

    // changing view between login and sign up page
    const loginForm = document.querySelector("#loginForm");
    const createAccountForm = document.querySelector("#createAccountForm");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form-hidden");
        createAccountForm.classList.remove("form-hidden");
    });
})

// login tab
form.addEventListener('submit', (event) => {
    event.preventDefault();

    login(email.value, password.value)
        .then(wasSuccessfulLogin => {
            if (wasSuccessfulLogin) {
                document.getElementById('invalidLogin').style.display = "none";
                window.location.href = '/html/home.html';
            } else {
                console.log('unsuccessful login')
                document.getElementById('invalidLogin').style.display = "block";
                document.getElementById('invalidLogin').innerHTML = '<img src="img/exclamation-mark-svgrepo-com.svg" style="width: 15px;"> Login fehlgeschlagen';
                document.getElementById('signup_password').value = ''
            }
        })
})

// sign up tab
signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    var signup_email = document.getElementById('signup_email').value
    var signup_password = document.getElementById('signup_password').value

    if (signup_password.length < 5) {
        document.getElementById('invalidSignup').style.display = "block";
        document.getElementById('invalidSignup').innerHTML = '<img src="img/exclamation-mark-svgrepo-com.svg" style="width: 15px;"> Passwort muss mindestens 5 Zeichen haben';
        document.getElementById('signup_password').value = ''
    }
    else {
        // register an account
        signup(signup_email, signup_password)
            .then(wasSuccessful => {
                if (wasSuccessful) {
                    document.getElementById('invalidSignup').style.display = "block";
                    document.getElementById('invalidSignup').innerHTML = 'Registrierung erfolgreich, bitte Prüfen Sie Ihr Post Eingang ✌️'
                    document.getElementById('invalidSignup').style.color = 'green'
                    document.getElementById('invalidSignup').style.border = '1px solid green'
                } else {
                    document.getElementById('invalidSignup').style.display = "block";
                    document.getElementById('invalidSignup').style.border = '1px solid red'
                    document.getElementById('invalidSignup').style.color = 'red'
                    document.getElementById('invalidSignup').innerHTML = '<img src="img/exclamation-mark-svgrepo-com.svg" style="width: 15px;"> User ist bereits registriert 😣';
                    document.getElementById('signup_password').value = ''
                }
            })
    }
})