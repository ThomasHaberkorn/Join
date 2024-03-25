async function init() {
    await includeHTML();
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

let users = JSON.parse(localStorage.getItem("user")) || []; // Lade vorhandene Nutzer

function addUser() {
    const name = document.getElementById("signinInputName").value;
    const email = document.getElementById("signinInputMail").value;
    const password = document.getElementById("signinpassword").value;
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
        window.location.href =
            "index.html?msg=E-Mail-Adresse bereits registriert!";
        return;
    }

    users.push({
        name,
        email,
        password,
    });

    localStorage.setItem("user", JSON.stringify(users));

    loginInnerContent.classList.remove("d-none");
    signinInnerContent.classList.add("d-none");
    window.location.href =
        "index.html?msg=Du hast dich erfolgreich registriert";
}

function login() {
    const email = document.getElementById("loginInputMail").value;
    const password = document.getElementById("loginpassword").value;

    const foundUser = users.find((user) => user.email === email);

    if (foundUser && password === foundUser.password) {
        window.location.href = "summary.html?name=" + foundUser.name;
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
// }

// let users = JSON.parse(localStorage.getItem("user")) || []; // Lade vorhandene Nutzer

// function addUser() {
//   const name = document.getElementById("signinInputName").value;
//   const email = document.getElementById("signinInputMail").value;
//   const password = document.getElementById("signinpassword").value;

//   // Validierung für leere Eingaben
//   if (!name || !email || !password) {
//     // Fehlermeldung anzeigen
//     return;
//   }

//   // Passwort hashen, bevor es gespeichert wird
//   const hashedPassword = bcryptjs.hashSync(password, 8);

//   users.push({
//     name,
//     email,
//     password: hashedPassword,  // Speichere nur den Hash
//   });

//   localStorage.setItem("user", JSON.stringify(users));

//   document.getElementById("loginInnerContent").hidden = false;
//   document.getElementById("signinInnerContent").hidden = true;
// }

// function login() {
//   const email = document.getElementById("loginInputMail").value;
//   const password = document.getElementById("loginpassword").value;

//   const foundUser = users.find((user) => user.email === email);

//   if (foundUser && bcryptjs.compareSync(password, foundUser.password)) {
//     window.location.href = "summary.html";
//   } else {
//     window.location.href = "index.html?msg=Email oder Passwort falsch";
//   }
// }

// let users = [];

// function loadUsers(key) {
//     users.push(JSON.parse(localStorage.getItem(key)));
// }

// function addUser() {
//     let name = document.getElementById("signinInputName");
//     let email = document.getElementById("signinInputMail");
//     let password = document.getElementById("signinpassword");
//     users.push({
//         name: name.value,
//         email: email.value,
//         password: password.value,
//     });

//     loginInnerContent.classList.remove("d-none");
//     signinInnerContent.classList.add("d-none");
//     setArray("user", users);
//     // window.location.href =
//     //     "index.html?msg=Du hast dich erfolgreich registriert";
// }

// function setArray(key, array) {
//     localStorage.setItem(key, JSON.stringify(array));
// }

// function login() {
//     let mail = document.getElementById("loginInputMail");
//     let pass = document.getElementById("loginpassword");
//     let user = JSON.parse(localStorage.getItem("user"));

//     console.log(user);
//     for (let i = 0; i < user.length; i++) {
//         const email = user[i]["email"];
//         const passw = user[i]["password"];
//         if (mail.value == email && pass.value == passw) {
//             window.location.href = "summary.html";
//             break;
//         } else {
//             window.location.href = "index.html?msg=Email oder Passwort falsch";
//         }
//     }
