async function init() {
    await includeHTML();
    handleCheckboxAndMessage();
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

// Neue Funktion zum Behandeln der Checkbox und Nachrichtenanzeige
function handleCheckboxAndMessage() {
    const submitButton = document.querySelector(".signupButton");
    const checkbox = document.getElementById("signinCheckBoxPrivacyPolicy");
    const msgBox = document.getElementById("msgBox"); // Angenommen, Sie haben ein Element mit dieser ID für die Nachricht

    // Erstmaliger Check und Button-Status
    submitButton.disabled = !checkbox.checked;
    submitButton.classList.add(!checkbox.checked ? "bcGray" : ""); // Ternärer Operator für bedingte Klassenaddition

    // Event-Listener für Checkbox-Änderungen
    checkbox.addEventListener("change", () => {
        submitButton.disabled = !checkbox.checked;
        submitButton.classList.toggle("bcGray"); // Umschalten der Klasse basierend auf dem Checkbox-Status
    });

    // Behandlung der Nachrichtenanzeige aus URL-Parametern
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get("msg");
    if (msg) {
        msgBox.innerHTML = msg;
        msgBox.classList.remove("d-none");
    } else {
        msgBox.classList.add("d-none");
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
    // Verhindert den standardmäßigen Formular-Submit
    event.preventDefault();

    const email = document.getElementById("loginInputMail").value;
    const password = document.getElementById("loginpassword").value;

    const foundUser = users.find((user) => user.email === email);

    if (foundUser && password === foundUser.password) {
        // Speichern des Namens im Session Storage
        sessionStorage.setItem("userName", foundUser.name);
        // sessionStorage.setItem("userId", foundUser.id);
        // Speichern der ID (falls vorhanden)

        // Weiterleiten zur Summary-Seite
        window.location.href = "summary.html";
    } else {
        window.location.href = "index.html?msg=Email oder Passwort falsch";
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html"; // oder eine andere Logout-Zielseite
}

let timeout;

function showMenu() {
    clearTimeout(timeout);
    dropdownMenu.classList.remove("d-none");
}

function hideMenu() {
    timeout = setTimeout(() => {
        dropdownMenu.classList.add("d-none");
    }, 700); // Verzögerung in Millisekunden
}

function linkToSummary() {
    window.location.href = "summary.html";
    // resetFocus();
}

function linkToAddTask() {
    window.location.href = "add_task.html";
    // resetFocus();
    // document.getElementById("addTasksum").classList.add("bgfocus");
}

function linkToBoard() {
    window.location.href = "board.html";
    // resetFocus();
    document.getElementById("boardSum").classList.add("bgfocus");
}

function linkToContact() {
    window.location.href = "contacts.html";
    // resetFocus();
    document.getElementById("contactSum").classList.add("bgfocus");
}

function resetFocus() {
    document.getElementById("sumSidebar").classList.remove("bgfocus");
    document.getElementById("addTasksum").classList.remove("bgfocus");
    document.getElementById("boardSum").classList.remove("bgfocus");
    document.getElementById("contactSum").classList.remove("bgfocus");
}

// function getTask() {
//     let task = localStorage.getItem("task");
//     console.log(task);
// }
// function setTimeout() {
//     // Initialisierung des Dropdown-Menüs
//     const headerLogoutButton = document.getElementById("headerLogoutButton");
//     const dropdownMenu = document.getElementById("dropdownMenu");

//     let timeout;

//     headerLogoutButton.addEventListener("mouseover", () => {
//         clearTimeout(timeout);
//         dropdownMenu.style.display = "block";
//     });

//     headerLogoutButton.addEventListener("mouseout", () => {
//         timeout = setTimeout(() => {
//             dropdownMenu.style.display = "none";
//         }, 500); // Verzögerung in Millisekunden
//     });
// }
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
