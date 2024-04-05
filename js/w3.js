async function initW3() {
    await includeW3();
    showInitials();
}
/**
 * Includes the Sidebar and the Header to ervery Side
 */

async function includeW3() {
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

/**
 * links of the sidebar to the respective pages
 */

function linkToSummary() {
    window.location.href = "summary.html";
}

function linkToAddTask() {
    window.location.href = "add_task.html";
}

function linkToBoard() {
    window.location.href = "board.html";
}

function linkToContact() {
    window.location.href = "contacts.html";
}

function linkToHelp() {
    window.location.href = "help.html";
}

/**
 * deletes the session storage when the user logs out
 */

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

/**
 *  dropdown menu show and close delay
 */
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

/**
 * show initials from first and last name in the header
 */

function showInitials() {
    let uName = sessionStorage.getItem("userName");
    let initials = uName
        .split(" ")
        .map((n) => n.charAt(0))
        .join("");
    document.getElementById("headerUserProfileInitials").innerHTML = initials;
}
