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

document.addEventListener(
    "mousedown",
    function (event) {
        var dropdown = document.getElementById("boardDropDownContacts");
        var inputDropDown = document.getElementById("inputDropDown");
        var openDropdown = document.getElementById("openDropdown");
        var boardCheckedUserInitials = document.getElementById(
            "boardCheckedUserInitials"
        );

        if (dropdown) {
            var isClickInsideDropdown = dropdown.contains(event.target);
            var isClickInsideInputDropDown =
                inputDropDown && inputDropDown.contains(event.target);
            var isClickInsideOpenDropdown =
                openDropdown && openDropdown.contains(event.target);
            var dropdownDisplay = window.getComputedStyle(dropdown).display;

            if (
                !isClickInsideDropdown &&
                !isClickInsideInputDropDown &&
                !isClickInsideOpenDropdown &&
                dropdownDisplay === "block"
            ) {
                dropdown.style.display = "none";
                boardCheckedUserInitials.style.display = "flex";
                loadCheckedUserInitials();
            }
        }
    },
    true
);

document.addEventListener(
    "mousedown",
    function (event) {
        var dropdown = document.getElementById("dropDownContactsEdit");
        var contactDropdownEdit = document.getElementById(
            "contact-dropdown-edit"
        );
        var inputDropdownEdit = document.getElementById("input-dropdown-edit");
        var openDropdownEdit = document.getElementById("openDropdownEdit");
        var editInputDropdown = document.getElementById("editInputDropdown");

        if (dropdown) {
            var isClickInsideDropdown = dropdown.contains(event.target);
            var isClickInsideContactDropdownEdit =
                contactDropdownEdit &&
                contactDropdownEdit.contains(event.target);
            var isClickInsideInputDropdownEdit =
                inputDropdownEdit && inputDropdownEdit.contains(event.target);
            var isClickInsideOpenDropdownEdit =
                openDropdownEdit && openDropdownEdit.contains(event.target);
            var isClickInsideEditInputDropdown =
                editInputDropdown && editInputDropdown.contains(event.target);
            var dropdownDisplay = window.getComputedStyle(dropdown).display;

            if (
                !isClickInsideDropdown &&
                !isClickInsideContactDropdownEdit &&
                !isClickInsideInputDropdownEdit &&
                !isClickInsideOpenDropdownEdit &&
                !isClickInsideEditInputDropdown &&
                dropdownDisplay === "block"
            ) {
                dropdown.style.display = "none";
                updateEditCheckedUserInitials();
            }
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
