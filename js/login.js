var userList = [
    {
        username: "karel",
        email: "karelkarunia@gmail.com",
        password: "karel1"
    },
    {
        username: "huehne",
        email: "huehne@htw-berlin.de",
        password: "hunter2"
    },
    {
        username: "will",
        email: "will@htw-berlin.de",
        password: "will"
    },
    {
        email: "admin@ta",
        password: "admin"
    }
]

function pageLoad() {
    const email = localStorage.getItem('email')


    if (email) {
        document.getElementById('email').value = email
    }
    document.getElementById('email').addEventListener("input", afterInput)

}

function afterInput(e) {
    localStorage.setItem('email', e.target.value)
}

document.addEventListener('DOMContentLoaded', pageLoad)
document.getElementById('login').addEventListener("click", function () {
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value

    for (i = 0; i < userList.length; i++) {
        if (email == userList[i].email && password == userList[i].password) {
            console.log('logged in')
            window.location.replace("https://travel-addict.netlify.app/html/home.html");
            return
        }
    }
    alert('wrong password')

    console.log('login')
})