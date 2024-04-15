async function initW3() {
    await includeW3();
    adjustSidebarVisibility();
    showInitials();
}

/**
 * Checks if the user is logged in. If not, the user is redirected to the help page.
 */
function checkLoggedUser() {
    let user = sessionStorage.getItem("userName");
    if (!user) {
        sessionStorage.setItem("sidebarShouldHide", "true");
        window.location.href = "index.html";
    } else {
        sessionStorage.removeItem("sidebarShouldHide");
    }
}

/**
 *  Adjusts the visibility of the sidebar according to the session storage.
 * If the session storage contains the key "sidebarShouldHide" with the value "true",
 * the sidebar is hidden. Otherwise, the sidebar is displayed.
 */

function adjustSidebarVisibility() {
    let shouldHideSidebar =
        sessionStorage.getItem("sidebarShouldHide") === "true";
    let sidebar = document.getElementById("sibebarNavContainer");
    if (sidebar) {
        if (shouldHideSidebar) {
            sidebar.classList.add("d-none");
        } else {
            sidebar.classList.remove("d-none");
        }
    }
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

function linkToLegalNotice() {
    window.location.href = "legal_notice.html";
}

function linkToPrivacyPolicy() {
    window.location.href = "privacy_policy.html";
}

function linkToPrivacyPolicyFromSignup() {
    sessionStorage.setItem("sidebarShouldHide", "true");
    window.location.href = "privacy_policy.html";
}

function linkToLegalNoticeFromSignup() {
    sessionStorage.setItem("sidebarShouldHide", "true");
    window.location.href = "legal_notice.html";
}

function sessionStorageFalse() {
    sessionStorage.setItem("sidebarShouldHide", "false");
}
/**
 * deletes the session storage when the user logs out
 */

async function logout() {
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
    }, 700); // delay in  Milliseconds
}

/**
 * show initials from first and last name in the header but only for two characters
 */

function showInitials() {
    let uName = sessionStorage.getItem("userName");
    if (uName) {
        let initials = uName
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")
            .toUpperCase();
        initials = initials.substring(0, 2); // Limit the initials to 2 characters
        document.getElementById("headerUserProfileInitials").innerHTML =
            initials;
    }
}

// -----------------------------------
// let tasks = [];
// const userLevel = sessionStorage.getItem("userLevel");
// let taskTemp = JSON.parse(localStorage.getItem("tasks")) || [];
// if (userLevel === "user") {
//     const userTasks = taskTemp.filter((t) => t.userLevel === "user");
//     tasks = userTasks;
// } else {
//     const userTasks = taskTemp.filter((t) => t.userLevel === "guest");
//     tasks = userTasks;
// }

// -----------------------------------

// function toggleDropdown() {
//     const options = document.querySelector(".dropdown-options");
//     options.style.display = options.style.display === "none" ? "block" : "none";
// }

function toggleDropdown(event) {
    const options = document.querySelector(".dropdown-options");
    const arrow = document.querySelector(".dropdown-arrow");
    const isOpen = options.style.display === "block";

    options.style.display = isOpen ? "none" : "block";
    arrow.src = isOpen
        ? "/assets/img/custom-arrow.png"
        : "/assets/img/custom-arrow-up.png";

    // Stoppt die Propagation des Events, um Doppeltrigger zu verhindern
    event.stopPropagation();
}

// function selectOption(event) {
//     const selectedText = event.target.textContent;
//     const selectedValue = event.target.getAttribute("data-value");

//     document.querySelector(".dropdown-selected").textContent = selectedText;
//     document.querySelector(".dropdown-options").style.display = "none";
//     document.getElementById("category").value = selectedValue;
// }

function selectOption(event) {
    const selectedText = event.target.textContent;
    const selectedValue = event.target.getAttribute("data-value");
    const arrow = document.querySelector(".dropdown-arrow");

    document.querySelector(".dropdown-selected").textContent = selectedText;
    document.querySelector(".dropdown-options").style.display = "none";
    document.getElementById("category").value = selectedValue;
    arrow.src = "/assets/img/custom-arrow.png";
}

function setupDropdownListeners() {
    const dropdownSelected = document.querySelector(".dropdown-selected");
    const dropdownArrow = document.querySelector(".dropdown-arrow");
    const dropdownOptions = document.querySelectorAll(".dropdown-option");

    dropdownSelected.addEventListener("click", toggleDropdown);
    dropdownArrow.addEventListener("click", toggleDropdown);

    dropdownOptions.forEach((option) => {
        option.addEventListener("click", selectOption);
    });

    // Fügt einen Listener zum Fenster hinzu, um das Dropdown zu schließen, wenn außerhalb geklickt wird
    window.addEventListener("click", function () {
        const options = document.querySelector(".dropdown-options");
        const arrow = document.querySelector(".dropdown-arrow");
        if (options.style.display === "block") {
            options.style.display = "none";
            arrow.src = "/assets/img/custom-arrow.png";
        }
    });
}

document.addEventListener("DOMContentLoaded", setupDropdownListeners);

function handleClickOutside(event) {
    if (!event.target.matches(".dropdown-selected")) {
        document.querySelector(".dropdown-options").style.display = "none";
    }
}

function handleKeyboardAccessibility(event) {
    if (event.key === "Enter") {
        toggleDropdown();
    }
}

// function initializeDropdown() {
//     setupDropdownListeners();
//     window.addEventListener("click", handleClickOutside, true);
//     document
//         .querySelector(".dropdown-selected")
//         .addEventListener("keydown", handleKeyboardAccessibility);
// }

function initializeDropdown() {
    setupDropdownListeners();
    window.addEventListener("click", handleClickOutside, true);
    document
        .querySelector(".dropdown-selected")
        .addEventListener("keydown", handleKeyboardAccessibility);
}

// Initialize the dropdown once the document is fully loaded
// document.addEventListener("DOMContentLoaded", initializeDropdown);
document.addEventListener("DOMContentLoaded", initializeDropdown);
