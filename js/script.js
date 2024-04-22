async function init() {
    await startAnimation();
    await sessionStorageFirstTimeTrue();
    await loadUsers();
    await loadContacts();
    handleCheckboxAndMessage();
    checkMsgBox();
    moveContainer();
    checkRememberUser();
    checkError();
}

let users = [];

async function startAnimation() {
    let firstLog = sessionStorage.getItem(
        "IsThisFirstTime_Log_From_LiveServer"
    );
    if ((firstLog = null || firstLog == "true")) {
        document.getElementById("loginHeadLogo").classList.remove("d-none");
        setLogoAnimation();
    }
}

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
 * Manages the registration process, checks for existing users and password confirmation.
 * Registers a new user if the email is available and passwords match. Sets error messages in sessionStorage
 * if conditions fail.
 * @async
 * @returns {Promise<void>} Performs operations related to user registration without returning a value.
 */
async function addUser() {
    const name = document.getElementById("signinInputName").value;
    const email = document.getElementById("signinInputMail").value;
    const password = document.getElementById("suPWInput").value;
    const passwordConfirm = document.getElementById("suPWCInput").value;
    const existingUser = users.find((user) => user.email === email);
    const confirmPassword = password === passwordConfirm;
    if (existingUser) {
        handleExistingUser(email, password);
    }
    if (!confirmPassword) {
        sessionStorage.setItem(
            "authError",
            "Passwörter stimmen nicht überein!"
        );
        checkSignupPasswordConfirm();
    } else {
        signupForward(name, email, password);
    }
}

/**
 * Processes an attempt to register with an email that already exists. Sets a sessionStorage error message,
 * toggles the login/signup interface, unchecks the 'Remember Me' checkbox, and refreshes user data memory.
 * @param {string} email - The email address of the user attempting to register.
 * @param {string} password - The password entered, saved for potential future use.
 */
function handleExistingUser(email, password) {
    let currentUser = [];
    currentUser.push({email, password});
    sessionStorage.setItem("authError", "E-Mail-Adresse bereits registriert!");
    toggleLoginSignup();
    document.getElementById("loginCheckBoxRememberMe").checked = false;
    rememberMe();
    checkError();
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
    let rememberUserData = localStorage.getItem("RememberUser");
    let rememberUser = rememberUserData ? JSON.parse(rememberUserData) : null;
    if (rememberUser && rememberUser[0].password === "") {
        document.getElementById("loginInputMail").value = rememberUser[0].email;
        document.getElementById("loPWInput").value = "";
        document.getElementById("loginCheckBoxRememberMe").checked = false;
    } else if (rememberUser) {
        document.getElementById("loginInputMail").value = rememberUser[0].email;
        document.getElementById("loPWInput").value = rememberUser[0].password;
        document.getElementById("loginCheckBoxRememberMe").checked = true;
    } else {
        document.getElementById("loginInputMail").value = "";
        document.getElementById("loPWInput").value = "";
        document.getElementById("loginCheckBoxRememberMe").checked = false;
    }
}

/**
 * Checks if the user has entered the correct email and password and logs in the user
 * or displays an error message if the email or password is incorrect.
 */
function login(event) {
    if (event) event.preventDefault();
    const email = document.getElementById("loginInputMail").value;
    const password = document.getElementById("loPWInput").value;
    if (!email) {
        handleNoEmail();
    } else if (!password) {
        handleNoPassword(email);
    } else if (authenticateUser(email, password)) {
        manageSessionStorage(true, email, password);
        window.location.href = "summary.html";
    } else {
        setAuthError("Email oder Passwort falsch");
    }
}

function handleNoEmail() {
    let user = [];
    user.push({email: "", password: ""});
    localStorage.setItem("RememberUser", JSON.stringify(user));
    setAuthError("Keine Email eingetragen");
}

function handleNoPassword(email) {
    setAuthError("Kein Passwort eingetragen");
    holdUserClearPassword(email);
}
/**
 * Validates a user's email and password against the stored users data. Sets session storage for successful
 * authentication or error messages for failures.
 * @param {string} email - The email address of the user attempting to log in.
 * @param {string} password - The password entered by the user.
 * @returns {boolean} Returns true if authentication is successful, otherwise false.
 */
function authenticateUser(email, password) {
    let mail = email;
    const foundUser = users.find((user) => user.email === email);
    if (foundUser && password === foundUser.password) {
        sessionStorage.setItem("userName", foundUser.name);
        sessionStorage.setItem("userLevel", foundUser.userLevel);
        return true;
    } else if (foundUser) {
        holdUserClearPassword(mail);
        setAuthError("Falsches Passwort");
    } else {
        document.getElementById("loginInputMail").classList.add("focusAlert");
        setAuthError("E-Mail-Adresse nicht gefunden");
    }
    return false;
}

/**
 * Clears the password input and sets visual cues for an incorrect password attempt.
 * Also updates localStorage to only remember the user's email, not the password.
 * @param {string} email - The email address of the user who attempted to log in.
 */
function holdUserClearPassword(email) {
    document.getElementById("loPWInput").value = "";
    document.getElementById("loginInputMail").classList.add("focusAlert");
    password = "";
    let user = [];
    user.push({email, password});
    localStorage.setItem("RememberUser", JSON.stringify(user));
}

function setAuthError(message) {
    sessionStorage.setItem("authError", message);
    window.location.href = "index.html";
}

/**
 * Manages the storage of user credentials in localStorage based on authentication status and the state of the "Remember Me" checkbox. Stores credentials if authenticated and the checkbox is checked; clears storage otherwise.
 * @param {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @param {string|null} email - The user's email, used if remembering the user. Defaults to null.
 * @param {string|null} password - The user's password, used if remembering the user. Defaults to null.
 */
function manageSessionStorage(isAuthenticated, email = null, password = null) {
    const checkbox = document.getElementById("loginCheckBoxRememberMe");
    if (isAuthenticated) {
        if (checkbox.checked) {
            const currentUser = [{email, password}];
            localStorage.setItem("RememberUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("RememberUser");
        }
    } else {
        localStorage.removeItem("RememberUser");
    }
}

/**
 * Checks for authentication errors stored in sessionStorage and displays them in a designated message box.
 * If an error is present, it is shown and then automatically cleared from both the display and sessionStorage
 * after a set timeout period.
 */
function checkError() {
    const authError = sessionStorage.getItem("authError");
    if (authError) {
        const errorMessageDiv = document.getElementById("msgBox");
        if (errorMessageDiv) {
            errorMessageDiv.textContent = authError;
            errorMessageDiv.style.display = "block";
            setTimeout(() => {
                errorMessageDiv.style.display = "none";
                sessionStorage.removeItem("authError");
            }, 5000);
        }
    }
}

/**
 * Logs the user in as a guest.
 */
function guestLogin() {
    document.getElementById("loginCheckBoxRememberMe").checked = false;
    rememberMe();
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
