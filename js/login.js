const form = document.querySelector('#loginForm');

const email = document.querySelector('input[id="email"]');
const password = document.querySelector('input[id="password"]');

const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://travel-addict-backend-server.herokuapp.com";
// const BASE_URL = process.env.NODE_ENV === "production" ? "https://travel-addict-backend-server.herokuapp.com" : "http://localhost:8080";

function afterInput(e) {
    localStorage.setItem('email', e.target.value)
}

const login = async (email, password) => {
    console.log(email)
    console.log(password)
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

form.addEventListener('submit', (event) => {
    event.preventDefault();

    login(email.value, password.value)
        .then(wasSuccessfulLogin => {
            if (wasSuccessfulLogin) {
                console.log('great! you are logged in!');
                document.getElementById('invalidLogin').style.display = "none";
                // getExpenses().then(displayExpenses);
                window.location.href = '/html/home.html';

            } else {
                // loginError.classList.remove('hidden')
                console.log('unsuccessful login')
                document.getElementById('invalidLogin').style.display = "block";
                document.getElementById('invalidLogin').innerHTML = '<img src="img/exclamation-mark-svgrepo-com.svg" style="width: 15px;"> Login fehlgeschlagen';
                document.getElementById('signup_password').value = ''
            }
        })
})
document.addEventListener('DOMContentLoaded', async () => {
    // login tab
    const email_ls = localStorage.getItem('email')

    if (email_ls) {
        document.getElementById('email').value = email_ls
    }
    document.getElementById('email').addEventListener("input", afterInput)
    // document.getElementById('login').addEventListener("click", function () {
    //     var email = document.getElementById('email').value
    //     var password = document.getElementById('password').value
    //     const loginData = { email: email, password: password };

    //     fetch('http://localhost:8080/login', {
    //         method: 'POST',
    //         mode: 'cors',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             email: email,
    //             password: password
    //         }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Success:', data);
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    //     // document.getElementById('invalidLogin').style.display = "block";
    //     // document.getElementById('password').value = ''
    // })

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
            // register an account
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
