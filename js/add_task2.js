/**
 * Shows or hides the clear button based on the given value.
 * @param {boolean} value - The value indicating whether to show or hide the clear button.
 */
function showClearButton(value) {
    document.getElementById("clear-subtask").style.display = value
        ? "inline"
        : "none";
}

/**
 * Clears the subtask input field and hides the clear button.
 */
function clearSubtaskInput() {
    document.getElementById("subtask").value = "";
    document.getElementById("clear-subtask").style.display = "none";
}

document
    .querySelectorAll('.custom-checkbox input[type="checkbox"]')
    .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const imgElement = this.nextElementSibling;
            if (this.checked) {
                imgElement.src = "./assets/img/checkboxChecked.png";
            } else {
                imgElement.src = "./assets/img/checkbox.png";
            }
        });
    });

/**
 * Toggles the visibility of the dropdown menu and updates the arrow icon accordingly.
 * @param {Event} event - The event object triggered by the user action.
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
 * Handles the click event outside of the dropdown-selected element.
 * If the clicked element does not match the dropdown-selected class, it hides the dropdown-options element.
 * @param {Event} event - The click event object.
 */
function handleClickOutside(event) {
    if (!event.target.matches(".dropdown-selected")) {
        document.querySelector(".dropdown-options").style.display = "none";
    }
}

/**
 * Handles keyboard accessibility for the event.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleKeyboardAccessibility(event) {
    if (event.key === "Enter") {
        toggleDropdown();
    }
}

/**
 * Initializes the dropdown functionality.
 * Sets up event listeners for the dropdown and handles keyboard accessibility.
 */
function initializeDropdown() {
    setupDropdownListeners();
    window.addEventListener("click", handleClickOutside, true);
    document
        .querySelector(".dropdown-selected")
        .addEventListener("keydown", handleKeyboardAccessibility);
}

document.addEventListener("DOMContentLoaded", initializeDropdown);

/**
 * Closes the dropdown and fills the dropdown list.
 */
function closeDropdown() {
    fillDropdownList();
    document.getElementById("dropDownContacts").style.display = "none";
}
