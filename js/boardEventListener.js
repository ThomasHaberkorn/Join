/**
 * Toggles the visibility of a dropdown menu and updates the arrow icon accordingly.
 * @param {Event} event - The event object triggered by the dropdown toggle.
 */
function toggleDropdown(event) {
    const options = document.querySelector(".dropdown-options");
    const arrow = document.querySelector(".dropdown-arrow");
    const isOpen = options.style.display === "block";
    options.style.display = isOpen ? "none" : "block";
    arrow.src = isOpen
        ? "./assets/img/custom-arrow.png"
        : "./assets/img/custom-arrow-up.png";
    event.stopPropagation();
}

/**
 * Handles the selection of an option in the dropdown menu.
 *
 * @param {Event} event - The event object triggered by the selection.
 */
function selectOption(event) {
    const selectedText = event.target.textContent;
    const selectedValue = event.target.getAttribute("data-value");
    const arrow = document.querySelector(".dropdown-arrow");
    document.querySelector(".dropdown-selected").textContent = selectedText;
    document.querySelector(".dropdown-options").style.display = "none";
    document.getElementById("category").value = selectedValue;
    arrow.src = "./assets/img/custom-arrow.png";
}

/**
 * Sets up event listeners for the dropdown menu.
 */
function setupDropdownListeners() {
    const dropdownSelected = document.querySelector(".dropdown-selected");
    const dropdownArrow = document.querySelector(".dropdown-arrow");
    const dropdownOptions = document.querySelectorAll(".dropdown-option");
    dropdownSelected.addEventListener("click", toggleDropdown);
    dropdownArrow.addEventListener("click", toggleDropdown);
    dropdownOptions.forEach((option) => {
        option.addEventListener("click", selectOption);
    });
    window.addEventListener("click", function () {
        const options = document.querySelector(".dropdown-options");
        const arrow = document.querySelector(".dropdown-arrow");
        if (options.style.display === "block") {
            options.style.display = "none";
            arrow.src = "./assets/img/custom-arrow.png";
        }
    });
}

document.addEventListener("DOMContentLoaded", setupDropdownListeners);

/**
 * Handles click events outside the dropdown.
 * If the clicked target does not match ".dropdown-selected", hides the dropdown options.
 * @param {MouseEvent} event - The click event.
 */
function handleClickOutside(event) {
    if (!event.target.matches(".dropdown-selected")) {
        document.querySelector(".dropdown-options").style.display = "none";
    }
}

/**
 * Handles keyboard accessibility for toggling the dropdown.
 * Toggles the dropdown when the "Enter" key is pressed.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyboardAccessibility(event) {
    if (event.key === "Enter") {
        toggleDropdown();
    }
}

/**
 * Initializes the dropdown by setting up event listeners for dropdown interaction.
 * Listens for click events outside the dropdown to close it.
 * Listens for keyboard events on the dropdown selected element to toggle dropdown visibility.
 */
function initializeDropdown() {
    setupDropdownListeners();
    window.addEventListener("click", handleClickOutside, true);
    document
        .querySelector(".dropdown-selected")
        .addEventListener("keydown", handleKeyboardAccessibility);
}

document.addEventListener("DOMContentLoaded", initializeDropdown);
