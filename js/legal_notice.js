async function initLegalNotice() {
    await includeW3();
    legalNoticeActive();
    showInitials();
    checkLoggedUserAlt();
    adjustSidebarVisibility();
}

/**
 * Initializes the privacy policy functionality.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initPirivacyPolicy() {
    await includeW3();
    pirivacyPolicyActive();
    showInitials();
    adjustSidebarVisibility();
}

/**
 * Adds the "bgfocus" class to the legal notice container element.
 */
function legalNoticeActive() {
    document.getElementById("legalNoticeContainer").classList.add("bgfocus");
}

/**
 * Activates the privacy policy container by adding the "bgfocus" class.
 */
function pirivacyPolicyActive() {
    document.getElementById("privacyPolicyContainer").classList.add("bgfocus");
}

/**
 * Checks if a user is logged in and updates the session storage accordingly.
 */
function checkLoggedUserAlt() {
    let user = sessionStorage.getItem("userName");
    if (!user) {
        sessionStorage.setItem("sidebarShouldHide", "true");
    } else {
        sessionStorage.removeItem("sidebarShouldHide");
    }
}
