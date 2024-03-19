async function init() {
    // setItem();
    await includeHTML();
}

/**
 * switch from Log in to Sign up in the index.html
 */

function loginToSignup() {
    document.getElementById("loginInnerContent").classList.add("d-none");
    document.getElementById("signinInnerContent").classList.remove("d-none");
    document.getElementById("loginSignUp").classList.add("d-none");
}

/**
 * switch back to Log in Page from Sign up Page in the index.html
 */

function signupToLogin() {
    document.getElementById("loginInnerContent").classList.remove("d-none");
    document.getElementById("signinInnerContent").classList.add("d-none");
    document.getElementById("loginSignUp").classList.remove("d-none");
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

