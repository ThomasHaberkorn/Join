async function init() {
    await sessionStorageFirstTimeTrue();
    handleCheckboxAndMessage();
    checkMsgBox();
    moveContainer();
}

/**
 * Checks the session storage to see if the page has already been loaded.
 * The animation is displayed the first time the page is loaded;
 * no animation is displayed the next time the page is loaded
 */

async function sessionStorageFirstTimeTrue() {
    let firstLog = sessionStorage.getItem(
        "IsThisFirstTime_Log_From_LiveServer"
    );
    if (firstLog == "false") {
        document.getElementById("loginHeadLogo").style.opacity = 1;
        document.getElementById("loginHeadLogo").classList.remove("d-none");
        setLogoAnimationDone();
        document
            .getElementById("loginHeadLogo")
            .classList.add("loginLogoFrame");
    } else if (firstLog == null) {
        sessionStorage.setItem("IsThisFirstTime_Log_From_LiveServer", true); // firstLog auf true setzen
    } else if ((firstLog = true)) {
        document.getElementById("loginHeadLogo").classList.remove("d-none");
        setLogoAnimation();
    }
}

/**
 * Checks the message box for content. If it is empty, the message box is hidden.
 */

function checkMsgBox() {
    let mG = document.getElementById("msgBox").innerHTML;

    if (mG == null) {
        mG.classList.add("bcTransp");
    }
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
 * Sets style classes when the animation is executed.
 */

function setLogoAnimation() {
    document.getElementById("loginSignUp").classList.add("transformOpacity");
    document
        .getElementById("loginMiddleContainer")
        .classList.add("transformOpacity");
    document.getElementById("loginHeadLogo").classList.add("transformLogo");
    sessionStorage.setItem("IsThisFirstTime_Log_From_LiveServer", false);
}

/**
 * Remove style classes when the animation has been executed.
 */

async function setLogoAnimationDone() {
    document.getElementById("loginSignUp").classList.remove("transformOpacity");
    document
        .getElementById("loginMiddleContainer")
        .classList.remove("transformOpacity");
    document.getElementById("loginHeadLogo").classList.remove("transformLogo");
}

// Neue Funktion zum Behandeln der Checkbox und Nachrichtenanzeige
function handleCheckboxAndMessage() {
    const submitButton = document.querySelector(".signupButton");
    const checkbox = document.getElementById("signinCheckBoxPrivacyPolicy");
    const msgBox = document.getElementById("msgBox"); // Angenommen, Sie haben ein Element mit dieser ID für die Nachricht
    if (submitButton) {
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
    event.preventDefault(); // Verhindert den standardmäßigen Formular-Submit
    const email = document.getElementById("loginInputMail").value;
    const password = document.getElementById("loginpassword").value;
    const foundUser = users.find((user) => user.email === email);

    if (foundUser && password === foundUser.password) {
        sessionStorage.setItem("userName", foundUser.name);
        window.location.href = "summary.html";
    } else {
        window.location.href = "index.html?msg=Email oder Passwort falsch";
    }
}

function guestLogin() {
    sessionStorage.setItem("userName", "Guest");
    window.location.href = "summary.html";
}

/**
 * Moves the Sing Up button to the "signinMobileContainer" with a screen width of 720 pixels
 */

const mediaQuery = window.matchMedia("(max-width: 720px)");

function moveContainer() {
    const loginSignUp = document.getElementById("loginSignUp");
    const loginHead = document.getElementById("loginHead");
    const signinMobilContainer = document.getElementById(
        "signinMobileContainer"
    );
    if (mediaQuery.matches) {
        signinMobilContainer.appendChild(loginSignUp);
    } else {
        loginHead.appendChild(loginSignUp);
    }
}
mediaQuery.addListener(moveContainer);
