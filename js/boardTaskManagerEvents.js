/**
 * Clears the subtask input field and hides the clear button.
 */
function clearSubtaskInput() {
    document.getElementById("subtask").value = "";
    document.getElementById("clear-subtask").style.display = "none";
}

/**
 * Represents the next sibling element of the current element.
 * @type {HTMLElement}
 */
document
    .querySelectorAll('.custom-checkbox input[type="checkbox"]')
    .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const imgElement = this.nextElementSibling;
            if (this.checked) {
                imgElement.src = "assets/img/checkboxChecked.png";
            } else {
                imgElement.src = "assets/img/checkbox.png";
            }
        });
    });

/**
 * Closes the board add task section by hiding it.
 */
function closeBoardAddTask() {
    document.getElementById("boardAddTask").style.display = "none";
}

/**
 * Opens the add task form with the specified status.
 * @param {string} status - The status of the task.
 */
function openAddTaskWithStatus(status) {
    currentTaskStatus = status;
    document.getElementById("boardAddTask").style.display = "block";
    document.getElementById("boardCheckedUserInitials").innerHTML = "";
}

/**
 * Retrieves the dropdown elements from the DOM by their IDs.
 * @returns {Object} An object containing the dropdown elements.
 */
function getBoardDropdownElementsById() {
    return {
        dropdown: document.getElementById("boardDropDownContacts"),
        inputDropDown: document.getElementById("inputDropDown"),
        openDropdown: document.getElementById("openDropdown"),
        boardCheckedUserInitials: document.getElementById(
            "boardCheckedUserInitials"
        ),
    };
}

/**
 * Checks if a click event occurred inside the board dropdown elements.
 * @param {Event} event - The click event.
 * @param {Object} elements - The dropdown elements.
 * @param {HTMLElement} elements.dropdown - The dropdown element.
 * @param {HTMLElement} elements.inputDropDown - The input dropdown element.
 * @param {HTMLElement} elements.openDropdown - The open dropdown element.
 * @returns {Object} - An object containing boolean values indicating if the click occurred inside each dropdown element.
 */
function isClickInsideBoardDropdownElements(event, elements) {
    return {
        isClickInsideDropdown: elements.dropdown?.contains(event.target),
        isClickInsideInputDropDown: elements.inputDropDown?.contains(
            event.target
        ),
        isClickInsideOpenDropdown: elements.openDropdown?.contains(
            event.target
        ),
    };
}

/**
 * The computed display value of the dropdown element.
 * @type {string}
 */
document.addEventListener(
    "mousedown",
    function (event) {
        let elements = getBoardDropdownElementsById();
        if (elements.dropdown) {
            let clicks = isClickInsideBoardDropdownElements(event, elements);
            let dropdownDisplay = window.getComputedStyle(
                elements.dropdown
            ).display;
            if (
                !clicks.isClickInsideDropdown &&
                !clicks.isClickInsideInputDropDown &&
                !clicks.isClickInsideOpenDropdown &&
                dropdownDisplay === "block"
            ) {
                elements.dropdown.style.display = "none";
                elements.boardCheckedUserInitials.style.display = "flex";
                loadCheckedUserInitials();
            }
        }
    },
    true
);

/**
 * Retrieves elements by their ID.
 * @returns {Object} An object containing references to the elements.
 */
function getElementsById() {
    return {
        dropdown: document.getElementById("dropDownContactsEdit"),
        contactDropdownEdit: document.getElementById("contact-dropdown-edit"),
        inputDropdownEdit: document.getElementById("input-dropdown-edit"),
        openDropdownEdit: document.getElementById("openDropdownEdit"),
        editInputDropdown: document.getElementById("editInputDropdown"),
    };
}

/**
 * Checks if a click event occurred inside specific elements.
 * @param {Event} event - The click event.
 * @param {Object} elements - The elements to check.
 * @returns {Object} - An object containing boolean values indicating if the click event occurred inside each element.
 */
function isClickInsideElements(event, elements) {
    return {
        isClickInsideDropdown: elements.dropdown?.contains(event.target),
        isClickInsideContactDropdownEdit:
            elements.contactDropdownEdit?.contains(event.target),
        isClickInsideInputDropdownEdit: elements.inputDropdownEdit?.contains(
            event.target
        ),
        isClickInsideOpenDropdownEdit: elements.openDropdownEdit?.contains(
            event.target
        ),
        isClickInsideEditInputDropdown: elements.editInputDropdown?.contains(
            event.target
        ),
    };
}

/**
 * Adds an event listener to handle clicks outside specific elements.
 * @param {Event} event - The mousedown event object.
 */
document.addEventListener(
    "mousedown",
    function (event) {
        let elements = getElementsById();
        let clicks = isClickInsideElements(event, elements);
        let dropdownDisplay = window.getComputedStyle(
            elements.dropdown
        ).display;
        if (
            !clicks.isClickInsideDropdown &&
            !clicks.isClickInsideContactDropdownEdit &&
            !clicks.isClickInsideInputDropdownEdit &&
            !clicks.isClickInsideOpenDropdownEdit &&
            !clicks.isClickInsideEditInputDropdown &&
            dropdownDisplay === "block"
        ) {
            elements.dropdown.style.display = "none";
            updateEditCheckedUserInitials();
        }
    },
    true
);

/**
 * Updates the display of checked user initials in the edit mode.
 */
function updateEditCheckedUserInitials() {
    const dropdownEdit = document.getElementById("dropDownContactsEdit");
    const editCheckedUserInitials = document.getElementById(
        "editCheckedUserInitials"
    );
    editCheckedUserInitials.innerHTML = "";
    const checkboxes = dropdownEdit.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const contactId = checkbox.value;
            const contact = contacts.find((c) => c.userID === contactId);
            if (contact) {
                const initialsDiv = document.createElement("div");
                initialsDiv.className = "userInitials";
                initialsDiv.textContent = `${contact.firstLetter}${contact.lastLetter}`;
                initialsDiv.style.backgroundColor = contact.color;
                editCheckedUserInitials.appendChild(initialsDiv);
            }
        }
    });
}
