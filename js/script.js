async function init() {
    await includeHTML();
    // loadUsers("user", users);
}

/**
 * switch from Log in to Sign up in the index.html
 */

function toggleLoginSignup() {
    const loginInnerContent = document.getElementById("loginInnerContent");
    const signinInnerContent = document.getElementById("signinInnerContent");
    const loginSignUp = document.getElementById("loginSignUp");

    if (loginInnerContent.classList.contains("d-none")) {
        loginInnerContent.classList.remove("d-none");
        signinInnerContent.classList.add("d-none");
    } else {
        loginInnerContent.classList.add("d-none");
        signinInnerContent.classList.remove("d-none");
    }

    loginSignUp.classList.toggle("d-none");
}
/**
 * Includes the Sidebar and the Header to ervery Side
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

let users = [];

function loadUsers(key) {
    users.push(JSON.parse(localStorage.getItem(key)));
}

function addUser() {
    loadUsers("user");
    let name = document.getElementById("signinInputName");
    let email = document.getElementById("signinInputMail");
    let password = document.getElementById("signinpassword");
    users.push({
        name: name.value,
        email: email.value,
        password: password.value,
    });

    loginInnerContent.classList.remove("d-none");
    signinInnerContent.classList.add("d-none");
    setArray("user", users);
    // window.location.href =
    //     "index.html?msg=Du hast dich erfolgreich registriert";
}

function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

function login() {
    let mail = document.getElementById("loginInputMail");
    let pass = document.getElementById("loginpassword");
    let user = JSON.parse(localStorage.getItem("user"));

    console.log(user);
    for (let i = 0; i < user.length; i++) {
        const email = user[i]["email"];
        const passw = user[i]["password"];
        if (mail.value == email && pass.value == passw) {
            window.location.href = "summary.html";
            break;
        } else {
            window.location.href = "index.html?msg=Email oder Passwort falsch";
        }
    }

    // let suser = user.find((u) => u.email == mail.value);
    // console.log(suser);

    // for (let i = 0; i < users.length; i++) {
    //     const user = users[i];

    //     if (mail.value == user["email"] && pass.value == user["password"]) {
    //         window.location.href = "summary.html";
    //     } else {
    //         window.location.href = "index.html?msg=Email oder Passwort falsch";
    //     }
    // }
}
