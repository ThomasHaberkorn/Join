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

function linkToSummary() {
    window.location.href = "summary.html";
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
