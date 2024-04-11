async function initLegalNotice() {
    await includeW3();
    legalNoticeActive();
    showInitials();
    checkLoggedUserAlt();
    adjustSidebarVisibility();
}

async function initPirivacyPolicy() {
    await includeW3();
    pirivacyPolicyActive();
    showInitials();
    // checkLoggedUserAlt();
    adjustSidebarVisibility();
}

function legalNoticeActive() {
    document.getElementById("legalNoticeContainer").classList.add("bgfocus");
}

function pirivacyPolicyActive() {
    document.getElementById("privacyPolicyContainer").classList.add("bgfocus");
}

function checkLoggedUserAlt() {
    let user = sessionStorage.getItem("userName");
    if (!user) {
        sessionStorage.setItem("sidebarShouldHide", "true");
    } else {
        sessionStorage.removeItem("sidebarShouldHide");
    }
}
