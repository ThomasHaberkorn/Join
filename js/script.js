async function init() {
    await startAnimation();
    await sessionStorageFirstTimeTrue();
    handleCheckboxAndMessage();
    checkMsgBox();
    moveContainer();
    checkRememberUser();
    await loadUsers();
    await loadContacts();
}

async function startAnimation() {
    let firstLog = sessionStorage.getItem(
        "IsThisFirstTime_Log_From_LiveServer"
    );
    if ((firstLog = null || firstLog == "true")) {
        document.getElementById("loginHeadLogo").classList.remove("d-none");
        setLogoAnimation();
    }
}

let users;

/**
 * Loads users from remote storage and updates the global `users` array.
 * If no data is found, initializes the array as empty.
 */
async function loadUsers() {
    users = JSON.parse((await getItem("user")).value || "[]");
}

/**
 * Loads contacts from remote storage and updates the global `contacts` array.
 * If no data is found, initializes the array as empty.
 */
async function loadContacts() {
    contacts = JSON.parse((await getItem("contacts")).value || "[]");
}

/**
 * Checks the session storage to see if the page has already been loaded.
 * The animation is displayed the first time the page is loaded;
 * no animation is displayed the next time the page is loaded in the same session.
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
        sessionStorage.setItem("IsThisFirstTime_Log_From_LiveServer", true);
        setLogoAnimation();
    } else if ((firstLog = true)) {
        document.getElementById("loginHeadLogo").classList.remove("d-none");
        setLogoAnimation();
    }
}

/**
 * Checks if the message box is empty and applies a transparency class if it is.
 * Assumes an element with the ID "msgBox" exists in the DOM.
 */
function checkMsgBox() {
    let mG = document.getElementById("msgBox");
    if (!mG.innerHTML) {
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
    sessionStorage.removeItem("sidebarShouldHide");
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

/**
 * Function to handle the checkbox and message display
 */

function handleCheckboxAndMessage() {
    const submitButton = document.querySelector(".signupButton");
    const checkbox = document.getElementById("signinCheckBoxPrivacyPolicy");
    const msgBox = document.getElementById("msgBox");
    if (submitButton) {
        submitButton.disabled = !checkbox.checked;
        submitButton.classList.add(!checkbox.checked ? "bcGray" : "");
        checkbox.addEventListener("change", () => {
            submitButton.disabled = !checkbox.checked;
            submitButton.classList.toggle("bcGray");
        });
        fillMsgBox();
    }
}

/**
 * Fills the message box with the message from the URL parameters.
 */

function fillMsgBox() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get("msg");
    if (msg) {
        msgBox.innerHTML = msg;
        msgBox.classList.remove("d-none");
    } else {
        msgBox.classList.add("d-none");
    }
}

/**
 * check if the user already exists and if the password and the password confirm are the same
 */

async function addUser() {
    const name = document.getElementById("signinInputName").value;
    const email = document.getElementById("signinInputMail").value;
    const password = document.getElementById("suPWInput").value;
    const passwordConfirm = document.getElementById("suPWCInput").value;
    let currentUser = [];
    const existingUser = users.find((user) => user.email === email);
    const confirmPassword = password === passwordConfirm;
    if (existingUser) {
        currentUser.push({email, password});
        window.location.href =
            "index.html?msg=E-Mail-Adresse bereits registriert!";
        return;
    }
    if (!confirmPassword) {
        checkSignupPasswordConfirm();
    } else {
        signupForward(name, email, password);
    }
}

/**
 * checkSignupPasswordConfirm function to check if the password and the password confirm are the same
 */

function checkSignupPasswordConfirm() {
    document.getElementById("suPWCInput").classList.add("focusAlert");
    document.getElementById("my-form").innerHTML =
        "Ups! Your password don't match";
}

/**
 * signupForward function to save the user data in the local storage and redirect to the index.html
 */

async function signupForward(a, b, c) {
    let name = a;
    let email = b;
    let password = c;
    let currentUser = [];
    let userLevel = "user";
    let lastName = name.split(" ").pop();
    signupForwardPush(name, email, password, userLevel, lastName);
    currentUser.push({email, password});
    await setItem("user", users);
    await setItem("contacts", contacts);
    localStorage.setItem("RememberUser", JSON.stringify(currentUser));
    signupForwardRedirect(email, password);
}

function signupForwardPush(name, email, password, userLevel, lastName) {
    let fullName = name.split(" ");
    let capitalizedPart = fullName.map(
        (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );
    name = capitalizedPart.join(" ");
    const userObj = {
        color: getRandomColor(),
        name,
        email,
        password,
        userLevel,
        firstLetter: name.charAt(0).toUpperCase(),
        lastLetter: lastName.charAt(0).toUpperCase(),
        userID: generateUserId(),
    };
    users.push(userObj);
    contacts.push(userObj);
}

function signupForwardRedirect(email, password) {
    loginInnerContent.classList.remove("d-none");
    document.getElementById("loginInputMail").value = email;
    document.getElementById("loPWInput").value = password;
    document.getElementById("loginCheckBoxRememberMe").checked = true;
    signinInnerContent.classList.add("d-none");
    window.location.href =
        "index.html?msg=Du hast dich erfolgreich registriert";
}

/**
 * remove "RememberUser" from the local storage if the user uncheck the "Remember me" checkbox
 */

function rememberMe() {
    let checkbox = document.getElementById("loginCheckBoxRememberMe");
    if (!checkbox.checked) {
        localStorage.removeItem("RememberUser");
    } else {
        let currentUser = [];
        const email = document.getElementById("loginInputMail").value;
        const password = document.getElementById("loPWInput").value;
        currentUser.push({email, password});
        localStorage.setItem("RememberUser", JSON.stringify(currentUser));
    }
}

/**
 * Checks if the user has checked the "Remember me" checkbox and saves the user data in the local storage.
 */
function checkRememberUser() {
    let rememberUser = JSON.parse(localStorage.getItem("RememberUser"));
    if (rememberUser) {
        document.getElementById("loginInputMail").value = rememberUser[0].email;
        document.getElementById("loPWInput").value = rememberUser[0].password;
        document.getElementById("loginCheckBoxRememberMe").checked = true;
    }
}

/**
 * Checks if the user has entered the correct email and password and logs in the user.
 */
function login() {
    event.preventDefault();
    const email = document.getElementById("loginInputMail").value;
    const password = document.getElementById("loPWInput").value;
    const foundUser = users.find((user) => user.email === email);
    let checkbox = document.getElementById("loginCheckBoxRememberMe");
    let currentUser = [];
    if (foundUser && password === foundUser.password) {
        if (checkbox.checked) {
            currentUser.push({email, password});
            localStorage.setItem("RememberUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("RememberUser");
        }
        sessionStorage.setItem("userName", foundUser.name);
        sessionStorage.setItem("userLevel", foundUser.userLevel);
        window.location.href = "summary.html";
    } else {
        window.location.href = "index.html?msg=Email oder Passwort falsch";
    }
}

/**
 * Logs the user in as a guest.
 */

function guestLogin() {
    sessionStorage.setItem("userName", "guest");
    sessionStorage.setItem("userLevel", "guest");
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

/**
 *
 * @param {*} id take the id of the current event and change the image of the password field
 * it work for the login and the signup page
 */

function changeImg(id) {
    let img = document.getElementById(`${id}`);
    img.src = "/assets/img/passw-hidden.png";
    img.style.cursor = "pointer";
}

function checkPW(id) {
    event.stopPropagation();
    let img = document.getElementById(`${id}`);
    let input = document.getElementById(`${id}Input`);
    if (input.type === "password") {
        img.src = "/assets/img/passw-visible.png";
        input.type = "text";
        img.style.cursor = "pointer";
    } else {
        img.src = "/assets/img/passw-hidden.png";
        input.type = "password";
        img.style.cursor = "pointer";
    }
}

function removeFocus(id) {
    let img = document.getElementById(`${id}`);
    img.src = "/assets/img/lock.png";
}
