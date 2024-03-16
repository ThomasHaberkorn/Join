function init() {
    // setItem();
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
