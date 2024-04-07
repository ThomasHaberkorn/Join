async function initLegalNotice() {
    await includeW3();
    legalNoticeActive();
}

function legalNoticeActive() {
    document.getElementById("legalNoticeContainer").classList.add("bgfocus");
}
